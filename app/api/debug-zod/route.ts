/**
 * Debug endpoint: verify Zod _parse is available (not mangled by bundler).
 * GET /api/debug-zod returns typeof z._parse and schema._parse.
 * If _parseType is "undefined", the bundle is corrupted.
 */
import { NextResponse } from "next/server"
import { z } from "zod"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const schema = z.object({ test: z.string() })
  const zAny = z as unknown as { _parse?: unknown }
  const schemaAny = schema as unknown as { _parse?: unknown }

  return NextResponse.json({
    zodVersion: (z as unknown as { version?: string }).version ?? "unknown",
    zHasParse: "_parse" in zAny,
    zParseType: typeof zAny._parse,
    schemaHasParse: "_parse" in schemaAny,
    schemaParseType: typeof schemaAny._parse,
    parseType: typeof (schema as unknown as { parse: unknown }).parse,
  })
}
