"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Plus } from "lucide-react"
import type { Property, AddPropertyInput, UpdatePropertyInput } from "@/app/actions/properties"

export interface PropertyFormProps {
  /** For create: pass null. For edit: pass the property. */
  property?: Property | null
  onSubmit: (data: AddPropertyInput | UpdatePropertyInput) => Promise<{ success: boolean; error: string | null }>
  onSuccess?: () => void
  submitLabel?: string
  mode?: "create" | "edit"
}

export function PropertyForm({
  property = null,
  onSubmit,
  onSuccess,
  submitLabel,
  mode = property ? "edit" : "create",
}: PropertyFormProps) {
  const [address, setAddress] = useState(property?.address ?? "")
  const [stroTier, setStroTier] = useState(property?.stro_tier ?? 1)
  const [licenseId, setLicenseId] = useState(property?.license_id ?? "")
  const [reportingStatus, setReportingStatus] = useState(
    property?.reporting_status ?? "pending"
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      if (mode === "create") {
        const result = await onSubmit({
          address: address.trim(),
          stro_tier: stroTier,
          license_id: licenseId.trim(),
        })
        if (result.success) {
          setAddress("")
          setStroTier(1)
          setLicenseId("")
          onSuccess?.()
        } else {
          setError(result.error ?? "Failed to add property")
        }
      } else {
        const result = await onSubmit({
          address: address.trim(),
          stro_tier: stroTier,
          license_id: licenseId.trim(),
          reporting_status: reportingStatus,
        })
        if (result.success) {
          onSuccess?.()
        } else {
          setError(result.error ?? "Failed to update property")
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="address" className="text-foreground">
          Address *
        </Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Main St, San Diego, CA 92101"
          className="mt-1 border-border bg-secondary/50 text-foreground"
          required
        />
      </div>
      <div>
        <Label htmlFor="stro_tier" className="text-foreground">
          STRO Tier
        </Label>
        <Select
          value={stroTier.toString()}
          onValueChange={(v) => setStroTier(parseInt(v, 10))}
        >
          <SelectTrigger className="mt-1 border-border bg-secondary/50 text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Tier 1</SelectItem>
            <SelectItem value="2">Tier 2</SelectItem>
            <SelectItem value="3">Tier 3</SelectItem>
            <SelectItem value="4">Tier 4</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="license_id" className="text-foreground">
          License ID *
        </Label>
        <Input
          id="license_id"
          value={licenseId}
          onChange={(e) => setLicenseId(e.target.value)}
          placeholder="STR-2024-001"
          className="mt-1 border-border bg-secondary/50 text-foreground"
          required
        />
      </div>
      {mode === "edit" && (
        <div>
          <Label htmlFor="reporting_status" className="text-foreground">
            Status
          </Label>
          <Select
            value={reportingStatus}
            onValueChange={setReportingStatus}
          >
            <SelectTrigger className="mt-1 border-border bg-secondary/50 text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="compliant">Compliant</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="violation">Violation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        {submitLabel ?? (mode === "create" ? "Add Property" : "Save Changes")}
      </Button>
    </form>
  )
}
