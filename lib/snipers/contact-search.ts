/**
 * Contact search for leads.
 * Wire to Google Search MCP, SerpAPI, or similar for production.
 * @see npx -y @modelcontextprotocol/server-google-search
 */

import type { DistressedLead, NewEntrant } from "./types"

export type ContactInfo = {
  name?: string
  phone?: string
  pmCompany?: string
}

/** Search for owner/PM contact by address. Placeholder until MCP or API wired. */
export async function searchContactForLead(
  lead: DistressedLead | NewEntrant
): Promise<ContactInfo> {
  if (lead.type === "stro_license") {
    const l = lead
    return {
      name: l.localContactName ?? l.hostContactName,
      phone: l.localContactPhone,
    }
  }
  // Code enforcement / parking: no built-in contact; needs Google Search MCP or SerpAPI
  return {}
}
