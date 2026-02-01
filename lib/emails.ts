/**
 * DoggyBagg transactional email via Resend.
 * All emails use support@doggybagg.cc as reply-to for consistent support routing.
 */

import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.EMAIL_FROM ?? "DoggyBagg <notifications@doggybagg.cc>"
const replyTo = "support@doggybagg.cc"
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://doggybagg.cc"
const logoUrl = `${siteUrl}/images/darkdoggylogo.jpg`

function getResend() {
  if (!resendApiKey) {
    console.warn("[emails] RESEND_API_KEY not set – emails will not be sent")
    return null
  }
  return new Resend(resendApiKey)
}

/** Shared email header with DoggyBagg branding */
function emailHeader(): string {
  return `
    <div style="text-align: center; margin-bottom: 24px;">
      <img src="${logoUrl}" alt="DoggyBagg" width="80" height="80" style="border-radius: 50%; object-fit: cover;" />
      <p style="margin: 8px 0 0; font-size: 14px; color: #6b7280;">Take it with you</p>
    </div>
  `
}

/** Wrapper for consistent styling */
function wrapBody(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1f2937;">
      ${emailHeader()}
      <div style="line-height: 1.6;">
        ${content}
      </div>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
      <p style="font-size: 12px; color: #9ca3af;">
        Questions? Reply to this email or contact support@doggybagg.cc
      </p>
    </body>
    </html>
  `
}

export async function sendWelcomeEmail(to: string, name?: string): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { ok: false, error: "Email not configured" }

  const displayName = name ?? to.split("@")[0]
  const body = wrapBody(`
    <h2 style="margin: 0 0 16px;">Welcome to DoggyBagg, ${displayName}!</h2>
    <p>Your account is ready. Start protecting your San Diego properties from municipal code violations.</p>
    <p><a href="${siteUrl}/dashboard" style="color: #6366f1; font-weight: 600;">Go to Dashboard</a></p>
  `)

  const { error } = await resend.emails.send({
    from: fromEmail,
    to,
    replyTo,
    subject: "Welcome to DoggyBagg",
    html: body,
  })
  if (error) {
    console.error("[emails] sendWelcomeEmail failed:", error)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

export async function sendReceiptEmail(
  to: string,
  opts: { productName: string; amount?: number; currency?: string }
): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { ok: false, error: "Email not configured" }

  const amountStr = opts.amount != null ? `$${(opts.amount / 100).toFixed(2)}` : ""
  const body = wrapBody(`
    <h2 style="margin: 0 0 16px;">Thank you for your purchase</h2>
    <p>You're now subscribed to <strong>${opts.productName}</strong>${amountStr ? ` – ${amountStr}` : ""}.</p>
    <p><a href="${siteUrl}/dashboard" style="color: #6366f1; font-weight: 600;">Go to Dashboard</a></p>
  `)

  const { error } = await resend.emails.send({
    from: fromEmail,
    to,
    replyTo,
    subject: `Receipt: ${opts.productName}`,
    html: body,
  })
  if (error) {
    console.error("[emails] sendReceiptEmail failed:", error)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

export async function sendPaymentFailedEmail(to: string): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { ok: false, error: "Email not configured" }

  const body = wrapBody(`
    <h2 style="margin: 0 0 16px;">Payment issue with your DoggyBagg subscription</h2>
    <p>We couldn't process your recent payment. This is often due to an expired card or insufficient funds.</p>
    <p>Please <a href="${siteUrl}/dashboard" style="color: #6366f1; font-weight: 600;">update your payment method</a> to avoid service interruption.</p>
    <p>Need help? Reply to this email or contact support@doggybagg.cc</p>
  `)

  const { error } = await resend.emails.send({
    from: fromEmail,
    to,
    replyTo,
    subject: "Action required: DoggyBagg payment failed",
    html: body,
  })
  if (error) {
    console.error("[emails] sendPaymentFailedEmail failed:", error)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

export async function sendComplianceViolationEmail(
  to: string,
  opts: { propertyAddress: string; violationType?: string }
): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { ok: false, error: "Email not configured" }

  const body = wrapBody(`
    <h2 style="margin: 0 0 16px;">Compliance alert</h2>
    <p>A compliance issue was detected for <strong>${opts.propertyAddress}</strong>${opts.violationType ? ` (${opts.violationType})` : ""}.</p>
    <p><a href="${siteUrl}/dashboard" style="color: #6366f1; font-weight: 600;">View in Dashboard</a></p>
  `)

  const { error } = await resend.emails.send({
    from: fromEmail,
    to,
    replyTo,
    subject: `Compliance alert: ${opts.propertyAddress}`,
    html: body,
  })
  if (error) {
    console.error("[emails] sendComplianceViolationEmail failed:", error)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}
