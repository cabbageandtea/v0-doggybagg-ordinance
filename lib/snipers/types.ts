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

export type ExpiringLicense = {
  licenseId: string
  expirationDate: string
  address?: string
  zip?: string
  localContactName?: string
  localContactPhone?: string
  hostContactName?: string
}

export type TaxRisk = {
  licenseId: string
  address?: string
  status: "Missing TOT"
}

export type IntegrityRisk = {
  listingUrl: string
  displayedPermit: string
  address?: string
  mismatch: string
}

export type SentinelResult = {
  distressedLeads: DistressedLead[]
  newEntrants: NewEntrant[]
  integrityRisks: IntegrityRisk[]
  taxRisks: TaxRisk[]
  expiringLicenses: ExpiringLicense[]
  targets: HighPriorityTarget[]
  runId?: string
}
