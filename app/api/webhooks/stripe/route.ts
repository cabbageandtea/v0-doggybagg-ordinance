import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"

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
    console.error("[stripe-webhook] Signature verification failed:", message)
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
        const userId = session.metadata?.userId as string | undefined

        if (!sessionId) {
          console.error("[stripe-webhook] checkout.session.completed missing session id")
          break
        }

        // Mark payment_transactions as completed
        const { error: updateError } = await supabase
          .from("payment_transactions")
          .update({
            status: "completed",
            stripe_payment_intent_id: session.payment_intent as string | null,
          })
          .eq("stripe_session_id", sessionId)

        if (updateError) {
          console.error("[stripe-webhook] Failed to update payment_transactions:", updateError)
        }

        // Optionally update profiles.subscription_tier from metadata
        if (userId && session.metadata?.subscription_tier) {
          await supabase
            .from("profiles")
            .update({ subscription_tier: session.metadata.subscription_tier })
            .eq("id", userId)
        }
        break
      }

      default:
        // Log unhandled event types for future implementation
        // eslint-disable-next-line no-console
        if (!["ping", "charge.succeeded"].includes(event.type)) {
          console.log("[stripe-webhook] Unhandled event type:", event.type)
        }
    }

    // Record processed event for idempotency
    await supabase.from("stripe_webhook_events").insert({
      event_id: event.id,
      event_type: event.type,
    })
  } catch (err) {
    console.error("[stripe-webhook] Processing error:", err)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
