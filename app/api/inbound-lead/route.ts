/**
 * POST /api/inbound-lead — Save email from property page CTA (Unlock Full 2026 Audit).
 * Writes to Supabase inbound_leads table.
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

const schema = z.object({
  email: z.string().email(),
  address: z.string().optional(),
})

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }
    const { email, address } = parsed.data

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 })
    }

    const supabase = createClient(url, key, { auth: { persistSession: false } })
    const { error } = await supabase.from("inbound_leads").insert({
      email,
      address: address ?? null,
      status: "Inbound_Lead",
    })

    if (error) {
      console.error("[inbound-lead]", error)
      return NextResponse.json({ error: "Failed to save" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[inbound-lead]", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
