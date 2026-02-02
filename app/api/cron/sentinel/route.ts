/**
 * Cron endpoint for Municipal Sentinel workflow.
 * GET/POST /api/cron/sentinel with Authorization: Bearer <CRON_SECRET>
 * Schedule: daily (e.g. 7:00 UTC) via vercel.json
 */

import { NextRequest, NextResponse } from "next/server"
import { start } from "workflow/api"
import { municipalSentinelWorkflow } from "@/app/workflows/sentinel"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: NextRequest) {
  return handleCron(request)
}

export async function POST(request: NextRequest) {
  return handleCron(request)
}

async function handleCron(request: NextRequest) {
  const auth = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const run = await start(municipalSentinelWorkflow, [])
    return NextResponse.json({
      ok: true,
      runId: run.runId,
      message: "Municipal Sentinel workflow started",
    })
  } catch (err) {
    console.error("[cron/sentinel]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Workflow start failed" },
      { status: 500 }
    )
  }
}
