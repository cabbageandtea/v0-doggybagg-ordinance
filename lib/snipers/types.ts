/** Lead Sniper / Municipal Sentinel shared types */

export type DistressedLead = {
  type: "code_enforcement" | "parking"
  address: string
  caseId: string
  description?: string
  dateOpened?: string
}

export type NewEntrant = {
  type: "stro_license"
  licenseId: string
  address: string
  zip: string
  tier: string
  localContactName?: string
  localContactPhone?: string
  hostContactName?: string
}

export type HighPriorityTarget = {
  lead: DistressedLead | NewEntrant
  contactInfo?: {
    name?: string
    phone?: string
    pmCompany?: string
  }
}

export type LegislativeAlert = {
  meetingDate: string
  topicSummary: string
  link: string
  meetingId?: string
}

export type SentinelResult = {
  distressedLeads: DistressedLead[]
  newEntrants: NewEntrant[]
  targets: HighPriorityTarget[]
  runId?: string
}
