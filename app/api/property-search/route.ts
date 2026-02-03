import { NextRequest, NextResponse } from "next/server"
import { searchLeads } from "@/lib/leads"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? ""
  if (q.length < 2) {
    return NextResponse.json({ results: [] })
  }
  const results = searchLeads(q, 10)
  return NextResponse.json({ results: results.map((r) => ({ address: r.lead.Address, slug: r.slug })) })
}
