/**
 * Durable post-purchase workflow for the $499 Portfolio Audit.
 * Triggered by Stripe checkout.session.completed for audit product.
 *
 * Step 1: Welcome & Deliverable Specs email (immediate)
 * Step 2: sleep(3 days)
 * Step 3: Follow-up Audit Health Check email
 *
 * @see https://useworkflow.dev
 */

import { sleep } from "workflow"
import { sendWelcomeAuditEmail, sendFollowUpAuditEmail } from "@/lib/emails"

async function stepWelcomeEmail(email: string) {
  "use step"
  const result = await sendWelcomeAuditEmail(email)
  if (!result.ok) throw new Error(result.error ?? "Failed to send welcome email")
  return result
}

async function stepFollowUpEmail(email: string) {
  "use step"
  const result = await sendFollowUpAuditEmail(email)
  if (!result.ok) throw new Error(result.error ?? "Failed to send follow-up email")
  return result
}

/** Durable workflow for $499 Portfolio Audit post-purchase sequence */
export async function purchaseAuditWorkflow(customerEmail: string) {
  "use workflow"

  await stepWelcomeEmail(customerEmail)

  await sleep("3 days")

  await stepFollowUpEmail(customerEmail)

  return { status: "completed", email: customerEmail }
}
