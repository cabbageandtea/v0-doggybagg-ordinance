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
    <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">Know a landlord or property manager? <a href="${siteUrl}/refer" style="color: #6366f1;">Refer them</a> and earn when they sign up.</p>
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

/** Audit confirmation — sent when customer pays $499. Sets expectations for next steps. */
export async function sendAuditConfirmationEmail(to: string): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { ok: false, error: "Email not configured" }

  const body = wrapBody(`
    <h2 style="margin: 0 0 16px;">Audit request received</h2>
    <p>Thank you for your $499 Portfolio Audit purchase. Your payment has been confirmed.</p>
    <p><strong>What happens next:</strong></p>
    <ul style="margin: 12px 0; padding-left: 20px;">
      <li>Our team will contact you within 24–48 hours to schedule your consultation</li>
      <li>You'll receive a custom ordinance standing report + 30-minute expert call</li>
      <li>Delivery within 5 business days of your scheduled session</li>
    </ul>
    <p>Questions? Reply to this email or contact support@doggybagg.cc.</p>
    <p><a href="${siteUrl}" style="color: #6366f1; font-weight: 600;">Back to DoggyBagg</a></p>
  `)

  const { error } = await resend.emails.send({
    from: fromEmail,
    to,
    replyTo,
    subject: "Portfolio Audit — next steps | DoggyBagg",
    html: body,
  })
  if (error) {
    console.error("[emails] sendAuditConfirmationEmail failed:", error)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

/** Welcome & Deliverable Specs — Step 1 of purchase workflow; sent immediately after $499 audit payment */
export async function sendWelcomeAuditEmail(to: string): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { ok: false, error: "Email not configured" }

  const body = wrapBody(`
    <h2 style="margin: 0 0 16px;">Welcome & Deliverable Specs</h2>
    <p>Thank you for your $499 Portfolio Audit purchase. Your payment has been confirmed.</p>
    <p><strong>What you'll receive:</strong></p>
    <ul style="margin: 12px 0; padding-left: 20px;">
      <li>Custom ordinance standing report for your San Diego portfolio</li>
      <li>30-minute expert consultation call</li>
      <li>Delivered within 5 business days of your scheduled session</li>
    </ul>
    <p><strong>Next steps:</strong> Our team will contact you within 24–48 hours to schedule your consultation.</p>
    <p><a href="${siteUrl}" style="color: #6366f1; font-weight: 600;">Back to DoggyBagg</a></p>
    <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">Know a landlord or property manager? <a href="${siteUrl}/refer" style="color: #6366f1;">Refer them</a> and earn when they sign up.</p>
  `)

  const { error } = await resend.emails.send({
    from: fromEmail,
    to,
    replyTo,
    subject: "Portfolio Audit — Welcome & Deliverable Specs | DoggyBagg",
    html: body,
  })
  if (error) {
    console.error("[emails] sendWelcomeAuditEmail failed:", error)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

/** Follow-up Audit Health Check — Step 3 of purchase workflow; sent 3 days after purchase */
export async function sendFollowUpAuditEmail(to: string): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { ok: false, error: "Email not configured" }

  const body = wrapBody(`
    <h2 style="margin: 0 0 16px;">Portfolio Audit — Quick Health Check</h2>
    <p>Hi — we wanted to follow up on your $499 Portfolio Audit.</p>
    <p>Have you heard from our team? If you haven't received a scheduling link yet, please reply to this email and we'll get you on the calendar right away.</p>
    <p>Meanwhile, you can add your properties in your <a href="${siteUrl}/dashboard" style="color: #6366f1; font-weight: 600;">dashboard</a> to start monitoring ordinance filings.</p>
    <p>Questions? Reply to this email or contact support@doggybagg.cc.</p>
  `)

  const { error } = await resend.emails.send({
    from: fromEmail,
    to,
    replyTo,
    subject: "Portfolio Audit — follow-up | DoggyBagg",
    html: body,
  })
  if (error) {
    console.error("[emails] sendFollowUpAuditEmail failed:", error)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

/** Sentinel high-priority targets — sent to admin@doggybagg.cc daily */
export async function sendSentinelTargetsEmail(
  targets: Array<{
    type: string
    address: string
    caseId?: string
    licenseId?: string
    contact?: { name?: string; phone?: string }
  }>,
  alerts: Array<{ meetingDate: string; topicSummary: string; link: string }> = [],
  integrityRisks: Array<{ listingUrl: string; displayedPermit: string; address?: string; mismatch: string }> = [],
  expiring: Array<{ licenseId: string; expirationDate: string; address?: string; localContactName?: string; localContactPhone?: string }> = [],
  taxRisks: Array<{ licenseId: string; address?: string; status: string }> = []
): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { ok: false, error: "Email not configured" }

  const alertSection =
    alerts.length > 0
      ? `
    <div style="margin-bottom: 24px; padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
      <h3 style="margin: 0 0 12px; color: #92400e;">🚨 URGENT: Legislative Alerts</h3>
      <p style="margin: 0 0 12px; font-size: 14px;">City Council meetings in the next 7 days with STRO/ordinance discussion:</p>
      <ul style="margin: 0; padding-left: 20px;">
        ${alerts
          .slice(0, 10)
          .map(
            (a) =>
              `<li style="margin-bottom: 8px;"><strong>${a.meetingDate}</strong> — ${a.topicSummary}<br/><a href="${a.link}" style="color: #6366f1; font-size: 13px;">View docket</a></li>`
          )
          .join("")}
      </ul>
    </div>
  `
      : ""

  const integritySection =
    integrityRisks.length > 0
      ? `
    <div style="margin-bottom: 24px; padding: 16px; background: #fee2e2; border-left: 4px solid #dc2626; border-radius: 4px;">
      <h3 style="margin: 0 0 12px; color: #991b1b;">🚨 CRITICAL: Integrity Gap (Illegal Listings)</h3>
      <p style="margin: 0 0 12px; font-size: 14px;">Listings displaying permit numbers not found in STRO Registry (92109, 92037):</p>
      <ul style="margin: 0; padding-left: 20px;">
        ${integrityRisks
          .slice(0, 10)
          .map(
            (r) =>
              `<li style="margin-bottom: 8px;">${r.mismatch}<br/><a href="${r.listingUrl}" style="color: #6366f1; font-size: 13px;">View listing</a>${r.address ? ` — ${r.address}` : ""}</li>`
          )
          .join("")}
      </ul>
    </div>
  `
      : ""

  const taxSection =
    taxRisks.length > 0
      ? `
    <div style="margin-bottom: 24px; padding: 16px; background: #fef2f2; border-left: 4px solid #b91c1c; border-radius: 4px;">
      <h3 style="margin: 0 0 12px; color: #7f1d1d;">💸 FINANCIAL RISK: Missing TOT Certificate</h3>
      <p style="margin: 0 0 12px; font-size: 14px;"><strong>Red Alert:</strong> STRO-licensed properties without a TOT (Transient Occupancy Tax) certificate. Highest-priority leads for the $499 Portfolio Audit—tax exposure is a major pain point.</p>
      <ul style="margin: 0; padding-left: 20px;">
        ${taxRisks
          .slice(0, 15)
          .map(
            (t) =>
              `<li style="margin-bottom: 8px;">License <strong>#${t.licenseId}</strong> — ${t.status}${t.address ? ` — ${t.address}` : ""}</li>`
          )
          .join("")}
      </ul>
    </div>
  `
      : ""

  const renewalSection =
    expiring.length > 0
      ? `
    <div style="margin-bottom: 24px; padding: 16px; background: #dbeafe; border-left: 4px solid #2563eb; border-radius: 4px;">
      <h3 style="margin: 0 0 12px; color: #1e40af;">📅 ACTION REQUIRED: Upcoming Renewals</h3>
      <p style="margin: 0 0 12px; font-size: 14px;"><strong>Revenue protection:</strong> Licenses expiring in 10–45 days. Highest-conversion leads for the $499 Portfolio Audit—reach out 6 weeks before renewal.</p>
      <ul style="margin: 0; padding-left: 20px;">
        ${expiring
          .slice(0, 15)
          .map(
            (e) =>
              `<li style="margin-bottom: 8px;">License <strong>#${e.licenseId}</strong> expires <strong>${e.expirationDate}</strong>${e.address ? ` — ${e.address}` : ""}<br/><span style="font-size: 12px; color: #6b7280;">${[e.localContactName, e.localContactPhone].filter(Boolean).join(" • ") || "—"}</span></li>`
          )
          .join("")}
      </ul>
    </div>
  `
      : ""

  const rows = targets
    .slice(0, 50)
    .map(
      (t) =>
        `<tr><td>${t.type}</td><td>${t.address}</td><td>${t.caseId ?? t.licenseId ?? "-"}</td><td>${t.contact?.name ?? "-"}</td><td>${t.contact?.phone ?? "-"}</td></tr>`
    )
    .join("")

  const body = wrapBody(`
    <h2 style="margin: 0 0 16px;">Municipal Sentinel — High-Priority Targets</h2>
    ${integritySection}
    ${taxSection}
    ${renewalSection}
    ${alertSection}
    <p>Today's distressed leads and new STRO entrants for $499 Portfolio Audit outreach.</p>
    <table style="width:100%; border-collapse: collapse; font-size: 13px;">
      <thead><tr style="background: #f3f4f6;"><th style="padding: 8px; text-align: left;">Type</th><th>Address</th><th>Case/License</th><th>Contact</th><th>Phone</th></tr></thead>
      <tbody>${rows || "<tr><td colspan='5'>No targets today</td></tr>"}</tbody>
    </table>
    <p style="margin-top: 16px;"><a href="${siteUrl}/dashboard" style="color: #6366f1; font-weight: 600;">DoggyBagg Dashboard</a></p>
  `)

  const subject =
    integrityRisks.length > 0
      ? `🚨 Sentinel: ${integrityRisks.length} Integrity Gap(s) + ${targets.length} targets | DoggyBagg`
      : taxRisks.length > 0
        ? `💸 Sentinel: ${taxRisks.length} TOT Gap(s) + ${targets.length} targets | DoggyBagg`
        : expiring.length > 0
          ? `📅 Sentinel: ${expiring.length} Upcoming Renewal(s) + ${targets.length} targets | DoggyBagg`
          : alerts.length > 0
            ? `🚨 Sentinel: ${alerts.length} Legislative Alert(s) + ${targets.length} targets | DoggyBagg`
            : targets.length > 0
              ? `Sentinel: ${targets.length} High-Priority Targets | DoggyBagg`
              : "Sentinel: Daily Report (0 targets) | DoggyBagg"

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: "admin@doggybagg.cc",
    replyTo,
    subject,
    html: body,
  })
  if (error) {
    console.error("[emails] sendSentinelTargetsEmail failed:", error)
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
