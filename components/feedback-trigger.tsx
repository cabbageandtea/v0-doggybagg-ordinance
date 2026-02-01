"use client"

import { MessageCircle } from "lucide-react"
import { trackFeedbackClicked } from "@/lib/analytics"

interface FeedbackTriggerProps {
  /** Where this trigger is rendered (e.g. "dashboard", "footer") */
  source?: string
  /** Optional mailto when clicked; defaults to support@doggybagg.cc */
  mailto?: string
  /** Custom class for styling */
  className?: string
  /** Variant: floating (fixed bottom-right) or inline */
  variant?: "floating" | "inline"
}

export function FeedbackTrigger({
  source = "unknown",
  mailto = "mailto:support@doggybagg.cc?subject=DoggyBagg%20Feedback",
  className = "",
  variant = "floating",
}: FeedbackTriggerProps) {
  const handleClick = () => {
    trackFeedbackClicked({ source })
    window.location.href = mailto
  }

  const baseClasses =
    "flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"

  if (variant === "floating") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`fixed bottom-6 right-6 z-50 ${baseClasses} ${className}`}
        aria-label="Send feedback"
      >
        <MessageCircle className="h-4 w-4" />
        Feedback
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseClasses} ${className}`}
      aria-label="Send feedback"
    >
      <MessageCircle className="h-4 w-4" />
      Send feedback
    </button>
  )
}
