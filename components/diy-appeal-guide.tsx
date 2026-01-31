"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  BookOpen, 
  CheckCircle,
  FileText,
  Mail,
  MapPin,
  Clock,
  Phone,
  AlertTriangle,
  ChevronRight
} from "lucide-react"

const steps = [
  {
    number: 1,
    title: "Review Your AI-Generated Letter",
    icon: FileText,
    description: "Copy the appeal letter from the Resolution Center",
    details: [
      "Ensure all property details are accurate",
      "Verify the violation code references",
      "Check that your address matches city records",
      "Review the reasoning and tone"
    ],
    timeEstimate: "5 minutes"
  },
  {
    number: 2,
    title: "Gather Supporting Documentation",
    icon: BookOpen,
    description: "Collect evidence to strengthen your appeal",
    details: [
      "Photos showing compliance (timestamped)",
      "Receipts for corrective actions taken",
      "Neighbor statements (if applicable)",
      "Previous correspondence with the city",
      "Business licenses or permits"
    ],
    timeEstimate: "30 minutes"
  },
  {
    number: 3,
    title: "Submit to City Treasurer",
    icon: Mail,
    description: "Send your appeal through official channels",
    details: [
      "Email: treasurer@sandiego.gov",
      "Online Portal: sandiego.gov/treasurer/appeals",
      "Mail: 1200 Third Avenue, Suite 1400, San Diego, CA 92101",
      "Include your TOT ID or property address",
      "Request confirmation of receipt"
    ],
    timeEstimate: "10 minutes"
  },
  {
    number: 4,
    title: "Track Your Appeal Status",
    icon: Clock,
    description: "Monitor the city's response timeline",
    details: [
      "Initial review: 5-7 business days",
      "Formal response: 15-30 business days",
      "Follow up if no response after 21 days",
      "Call (619) 533-6000 for status updates",
      "Document all interactions"
    ],
    timeEstimate: "Ongoing"
  }
]

const cityContacts = [
  {
    department: "Treasurer's Office",
    phone: "(619) 533-6000",
    email: "treasurer@sandiego.gov",
    hours: "Mon-Fri 8AM-5PM"
  },
  {
    department: "Short-Term Rental Division",
    phone: "(619) 446-5000",
    email: "STRinfo@sandiego.gov",
    hours: "Mon-Fri 8AM-5PM"
  }
]

export function DIYAppealGuide() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full sm:w-auto gap-2 bg-secondary/50 hover:bg-secondary border-border"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">DIY Appeal Guide</span>
          <span className="sm:hidden">Appeal Guide</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="liquid-glass border-border max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-6 w-6 text-primary" />
            DIY Appeal Toolkit
          </DialogTitle>
          <DialogDescription>
            Step-by-step guide to submit your appeal without legal representation
          </DialogDescription>
        </DialogHeader>

        {/* Banner */}
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-green-400 mb-1">Free Community Resource</h4>
              <p className="text-sm text-muted-foreground">
                This guide is provided free to all San Diego residents. We believe everyone 
                deserves access to compliance tools regardless of legal budget.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4 mt-6">
          {steps.map((step) => {
            const Icon = step.icon
            const isExpanded = expandedStep === step.number

            return (
              <div
                key={step.number}
                className="liquid-glass rounded-xl overflow-hidden border border-border"
              >
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : step.number)}
                  className="w-full p-4 text-left hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          Step {step.number}
                        </Badge>
                        <span className="text-xs text-muted-foreground hidden sm:inline">
                          ~{step.timeEstimate}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    </div>
                    <ChevronRight 
                      className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border bg-secondary/20">
                    <ul className="space-y-2 mt-4">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* City Contacts */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            San Diego City Contacts
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {cityContacts.map((contact, idx) => (
              <div key={idx} className="liquid-glass rounded-lg p-4 border border-border">
                <h4 className="font-semibold text-foreground mb-3 text-sm">
                  {contact.department}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                    <a 
                      href={`tel:${contact.phone}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors break-all"
                    >
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{contact.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
          <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            <strong className="text-yellow-400">Important:</strong> This guide is for informational 
            purposes only and does not constitute legal advice. For complex cases, consult with 
            a licensed attorney specializing in San Diego municipal code.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
