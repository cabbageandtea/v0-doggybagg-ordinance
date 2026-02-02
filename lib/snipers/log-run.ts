/** Log sentinel run to sniper_runs for observability */

import { createClient } from "@supabase/supabase-js"

export async function logSentinelRun(opts: {
  status: "completed" | "failed"
  alertsCount?: number
  integrityRisksCount?: number
  distressedCount: number
  newEntrantsCount: number
  totalTargets: number
  error?: string
}): Promise<void> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!serviceKey || !supabaseUrl) return

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

  await supabase.from("sniper_runs").insert({
    run_type: "sentinel_full",
    status: opts.status,
    completed_at: new Date().toISOString(),
    result_json: {
      alertsCount: opts.alertsCount ?? 0,
      integrityRisksCount: opts.integrityRisksCount ?? 0,
      distressedCount: opts.distressedCount,
      newEntrantsCount: opts.newEntrantsCount,
      totalTargets: opts.totalTargets,
      error: opts.error,
    },
  })
}
