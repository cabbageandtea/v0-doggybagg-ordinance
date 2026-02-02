import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const payload: Record<string, unknown> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'DoggyBagg API',
    version: '1.0.0',
  }

  // DB ping: know if Supabase is reachable (for uptime monitoring)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (url && key) {
    try {
      const supabase = createClient(url, key, { auth: { persistSession: false } })
      const { error } = await supabase.from('profiles').select('id').limit(1).maybeSingle()
      payload.db = error ? 'degraded' : 'ok'
    } catch {
      payload.db = 'error'
    }
  } else {
    payload.db = 'skipped'
  }

  const status = payload.db === 'ok' || payload.db === 'skipped' ? 200 : 503
  return NextResponse.json(payload, { status })
}
