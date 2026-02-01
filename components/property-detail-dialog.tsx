"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import type { Property } from "@/app/actions/properties"

function getStatusBadge(status: string) {
  switch (status) {
    case "compliant":
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Compliant
        </Badge>
      )
    case "warning":
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          Warning
        </Badge>
      )
    case "violation":
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          Violation
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status || "Pending"}</Badge>
  }
}

function getRiskScoreColor(score: number) {
  if (score <= 25) return "text-green-400"
  if (score <= 50) return "text-yellow-400"
  if (score <= 75) return "text-orange-400"
  return "text-red-400"
}

interface PropertyDetailDialogProps {
  property: Property | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (property: Property) => void
}

export function PropertyDetailDialog({
  property,
  open,
  onOpenChange,
  onEdit,
}: PropertyDetailDialogProps) {
  if (!property) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="liquid-glass border-border sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-foreground">Property Details</DialogTitle>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-border text-foreground hover:bg-secondary"
                onClick={() => {
                  onOpenChange(false)
                  onEdit(property)
                }}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium text-foreground">{property.address}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-sm text-muted-foreground">STRO Tier</p>
              <Badge variant="secondary">Tier {property.stro_tier || 1}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">License ID</p>
              <code className="rounded bg-secondary/50 px-2 py-1 text-sm">
                {property.license_id || "N/A"}
              </code>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              {getStatusBadge(property.reporting_status)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Risk Score</p>
              <span
                className={`font-mono font-bold ${getRiskScoreColor(
                  property.risk_score || 0
                )}`}
              >
                {property.risk_score ?? 0}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Added</p>
            <p className="text-foreground">
              {property.created_at
                ? new Date(property.created_at).toLocaleDateString(undefined, {
                    dateStyle: "medium",
                  })
                : "—"}
            </p>
          </div>
          <p className="text-xs text-muted-foreground border-t border-border pt-4">
            Risk history and compliance timeline coming soon.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
