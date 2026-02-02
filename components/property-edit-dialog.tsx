"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PropertyForm } from "@/components/property-form"
import { useUpdateProperty } from "@/lib/hooks/use-properties"
import type { Property } from "@/app/actions/properties"

interface PropertyEditDialogProps {
  property: Property | null
  open: boolean
  onOpenChange: (_open: boolean) => void
}

export function PropertyEditDialog({
  property,
  open,
  onOpenChange,
}: PropertyEditDialogProps) {
  const updateMutation = useUpdateProperty()

  if (!property) return null

  const handleSubmit = async (data: { address?: string; stro_tier?: number; license_id?: string; reporting_status?: string }) => {
    const result = await updateMutation.mutateAsync({
      id: property.id,
      updates: data,
    })
    return result
  }

  const handleSuccess = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="liquid-glass border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Property</DialogTitle>
        </DialogHeader>
        <PropertyForm
          property={property}
          mode="edit"
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          submitLabel="Save Changes"
        />
      </DialogContent>
    </Dialog>
  )
}
