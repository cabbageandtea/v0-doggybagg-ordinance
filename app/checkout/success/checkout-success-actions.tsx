"use client"

import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { subscriptionTierKeys } from "@/lib/hooks/use-subscription-tier"

export function CheckoutSuccessActions() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleGoToDashboard = () => {
    void queryClient.invalidateQueries({ queryKey: subscriptionTierKeys.all })
    router.push("/dashboard")
  }

  return (
    <div className="space-y-3">
      <Button
        size="lg"
        className="w-full gap-2 bg-primary hover:bg-primary/90"
        onClick={handleGoToDashboard}
      >
        Go to Dashboard
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
