"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PropertyForm } from "@/components/property-form"
import { useAddProperty, type AddPropertyInput, type UpdatePropertyInput } from "@/lib/hooks/use-properties"

interface PropertyCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function PropertyCreateDialog({ open, onOpenChange, onSuccess }: PropertyCreateDialogProps) {
  const addMutation = useAddProperty()

  const handleSubmit = async (data: AddPropertyInput | UpdatePropertyInput) => {
    return addMutation.mutateAsync(data as AddPropertyInput)
  }

  const handleSuccess = () => {
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="liquid-glass border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Property</DialogTitle>
        </DialogHeader>
        <PropertyForm
          mode="create"
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          submitLabel="Add Property"
        />
      </DialogContent>
    </Dialog>
  )
}
