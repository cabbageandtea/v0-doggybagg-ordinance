# DoggyBagg Workflows

Durable post-purchase and background workflows via [Workflow DevKit](https://useworkflow.dev).

## Purchase Audit Workflow

**File:** `app/workflows/purchase.ts`  
**Trigger:** Stripe `checkout.session.completed` for $499 Portfolio Audit  
**Function:** `purchaseAuditWorkflow(customerEmail: string)`

### Steps

1. **Welcome & Deliverable Specs** — Immediate email via Resend
2. **Sleep 3 days** — Durable pause (no compute used)
3. **Follow-up Audit Health Check** — Second email (scheduling reminder, dashboard link)

### Observability

- **Local:** `npx workflow web` to open the Workflow DevKit UI
- **Vercel:** Workflows Dashboard (if enabled for project)
- **Routes:** `/.well-known/workflow/v1/flow`, `/.well-known/workflow/v1/step`

### Env Requirements

- `RESEND_API_KEY` — For sending emails
- No extra env vars for Workflow DevKit (uses Vercel when deployed)
