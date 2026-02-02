import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"
import { parseCheckoutMetadata } from "@/lib/validation/stripe-webhook"
import { captureCheckoutCompletedServer } from "@/lib/analytics-server"
import { start } from "workflow/api"
import { purchaseAuditWorkflow } from "@/app/workflows/purchase"
import { sendReceiptEmail, sendPaymentFailedEmail } from "@/lib/emails"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

function logProductionWarning() {
  const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production"
  if (isProd && !webhookSecret) {
    console.error(
      "[stripe-webhook] PRODUCTION WARNING: STRIPE_WEBHOOK_SECRET is not set. " +
        "Webhook will reject all requests. Add this env var in Vercel before accepting payments."
    )
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

/** Log webhook delivery failures for first-24h launch monitoring */
function logWebhookFailure(context: string, error: unknown) {
  const msg = error instanceof Error ? error.message : String(error)
  console.error(`[stripe-webhook] DELIVERY_FAILURE: ${context} - ${msg}`)
}

/** Dead letter: log validation failure to webhook_logs for debugging */
async function deadLetter(
  supabaseClient: { from: (_table: string) => { insert: (_row: object) => PromiseLike<unknown> } },
  context: string,
  error: unknown,
  eventId?: string,
  eventType?: string,
  rawBody?: string,
  payload?: unknown
) {
  logWebhookFailure(context, error)
  const errMsg = error instanceof Error ? error.message : String(error)
  const row = {
    source: "stripe",
    event_id: eventId ?? null,
    event_type: eventType ?? null,
    context,
    error_message: errMsg,
    payload: payload ? JSON.parse(JSON.stringify(payload)) : null,
    raw_body: rawBody ?? null,
  }
  // webhook_logs from scripts/010; not in generated types
  await supabaseClient.from("webhook_logs").insert(row)
}

/**
 * Stripe webhook handler with:
 * - stripe-signature verification
 * - Idempotency: prevents duplicate processing of checkout.session.completed
 */
export async function POST(request: NextRequest) {
  logProductionWarning()

  const rawBody = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    logWebhookFailure("missing_signature", "Missing stripe-signature header")
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    )
  }

  let event: Stripe.Event
  try {
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      )
    }
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    logWebhookFailure("signature_verification", err)
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    )
  }

  // Idempotency requires Supabase service role (bypasses RLS for stripe_webhook_events)
  if (!supabaseServiceKey) {
    console.error("[stripe-webhook] SUPABASE_SERVICE_ROLE_KEY not set")
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    )
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data: existing } = await supabase
    .from("stripe_webhook_events")
    .select("event_id")
    .eq("event_id", event.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ received: true, duplicate: true }, { status: 200 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const sessionId = session.id

        if (!sessionId) {
          await deadLetter(supabase, "checkout_session_missing_id", "Missing session id", event.id, event.type, rawBody, session)
          break
        }

        const md = session.metadata as Record<string, string> | null | undefined
        const parseResult = parseCheckoutMetadata(md)

        if (!parseResult.success) {
          await deadLetter(
            supabase,
            "metadata_validation_failed",
            parseResult.error,
            event.id,
            event.type,
            rawBody,
            { metadata: md, sessionId }
          )
          // Still process payment_transactions (may have minimal metadata); skip profile/tier update
        }

        const meta = parseResult.success ? parseResult.data : null
        const userId = meta?.userId
        const subscriptionTier = meta?.subscriptionTier ?? meta?.subscription_tier
        const productId = meta?.productId

        // Mark payment_transactions as completed
        const { error: updateError } = await supabase
          .from("payment_transactions")
          .update({
            status: "completed",
            stripe_payment_intent_id: session.payment_intent as string | null,
          })
          .eq("stripe_session_id", sessionId)

        if (updateError) {
          await deadLetter(supabase, "payment_transactions_update", updateError, event.id, event.type, undefined, { sessionId })
        }

        // Update profiles.subscription_tier from validated metadata
        if (userId && subscriptionTier) {
          await supabase
            .from("profiles")
            .update({ subscription_tier: subscriptionTier })
            .eq("id", userId)
        }

        // Server-side telemetry: checkout_completed (reliable attribution, PostHog user identity)
        if (userId) {
          const value = session.amount_total != null ? session.amount_total / 100 : undefined
          captureCheckoutCompletedServer(userId, { productId, value })
        }

        // Branded receipt or audit confirmation email (support@doggybagg.cc reply-to)
        const customerEmail = session.customer_details?.email ?? session.customer_email
        const amountTotal = session.amount_total ?? 0
        const isAudit = amountTotal === 49900 || productId === "portfolio-audit"

        if (customerEmail) {
          if (isAudit) {
            void start(purchaseAuditWorkflow, [customerEmail])
          } else {
            const productName = productId === "starter-plan" ? "Starter" : productId === "professional-plan" ? "Professional" : productId ?? "Subscription"
            void sendReceiptEmail(customerEmail, {
              productName,
              amount: amountTotal || undefined,
              currency: session.currency ?? "usd",
            })
          }
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        let customerEmail: string | null = invoice.customer_email ?? null
        if (!customerEmail && typeof invoice.customer === "string") {
          const customer = await stripe.customers.retrieve(invoice.customer)
          customerEmail = (customer as Stripe.Customer).email ?? null
        }
        if (customerEmail) {
          void sendPaymentFailedEmail(customerEmail)
        }
        break
      }

      default:
        // Log unhandled event types for future implementation
        if (!["ping", "charge.succeeded"].includes(event.type)) {
          console.warn("[stripe-webhook] Unhandled event type:", event.type)
        }
    }

    // Record processed event for idempotency
    await supabase.from("stripe_webhook_events").insert({
      event_id: event.id,
      event_type: event.type,
    })
  } catch (err) {
    try {
      await deadLetter(supabase, "processing", err, event.id, event.type, rawBody, { message: "Unhandled exception in webhook handler" })
    } catch {
      logWebhookFailure("processing", err)
    }
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
