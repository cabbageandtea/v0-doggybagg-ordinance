/**
 * Cron endpoint for San Diego municipal data sync
 * Protected by CRON_SECRET. Call with: Authorization: Bearer <CRON_SECRET>
 *
 * Vercel Cron triggers daily (see vercel.json)
 */
import { NextRequest, NextResponse } from "next/server"
import { runSanDiegoSync } from "@/lib/ingestion/san-diego-sync"

export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const secret = process.env.CRON_SECRET
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const result = await runSanDiegoSync()
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  return GET(request)
}
