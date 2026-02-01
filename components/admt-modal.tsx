"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Shield, Brain, Eye, FileText, Scale } from "lucide-react"

const ADMT_STORAGE_KEY = "ordinance_admt_acknowledged"

const compliancePoints = [
  {
    icon: Brain,
    title: "Automated Risk Scoring",
    description: "Our AI analyzes public municipal records to generate property risk scores based on violation history, location patterns, and enforcement trends.",
  },
  {
    icon: Eye,
    title: "Data Sources",
    description: "Risk assessments are derived exclusively from publicly available San Diego municipal records, including STRO registry data and code enforcement filings.",
  },
  {
    icon: Scale,
    title: "Human Oversight",
    description: "All automated decisions can be reviewed. You may request manual review of any risk assessment by contacting our support team.",
  },
  {
    icon: FileText,
    title: "Your Rights Under CCPA",
    description: "You have the right to know what data we collect, request deletion, and opt-out of certain automated processing. Contact privacy@doggybagg.cc for requests.",
  },
]

export function ADMTModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasAcknowledged, setHasAcknowledged] = useState(false)

  useEffect(() => {
    const acknowledged = localStorage.getItem(ADMT_STORAGE_KEY)
    if (!acknowledged) {
      setIsOpen(true)
    }
  }, [])

  const handleAccept = () => {
    if (hasAcknowledged) {
      localStorage.setItem(ADMT_STORAGE_KEY, "true")
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="liquid-glass-glow border-border sm:max-w-2xl [&>button]:hidden">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 glow-accent">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Automated Decision-Making Disclosure
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            CCPA 2026 Compliance Notice
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <p className="mb-6 text-sm text-muted-foreground text-center">
            DoggyBagg uses automated systems to analyze property compliance risk. 
            Before proceeding, please review how your data is processed.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {compliancePoints.map((point) => (
              <div
                key={point.title}
                className="rounded-xl border border-border bg-secondary/30 p-4 transition-colors hover:border-primary/30"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <point.icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="mb-1 text-sm font-semibold text-foreground">
                  {point.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-secondary/20 p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="acknowledge"
              checked={hasAcknowledged}
              onCheckedChange={(checked) => setHasAcknowledged(checked === true)}
              className="mt-0.5 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <Label
              htmlFor="acknowledge"
              className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
            >
              I understand that DoggyBagg uses automated systems to generate risk 
              assessments and that I can request human review of any automated decision. 
              I acknowledge my rights under CCPA regarding my personal data.
            </Label>
          </div>
        </div>

        <DialogFooter className="mt-4 sm:justify-center">
          <Button
            onClick={handleAccept}
            disabled={!hasAcknowledged}
            className="w-full sm:w-auto glow-accent bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Dashboard
          </Button>
        </DialogFooter>

        <p className="text-center text-xs text-muted-foreground">
          Questions? Contact{" "}
          <a href="mailto:privacy@doggybagg.cc" className="text-primary hover:underline">
            privacy@doggybagg.cc
          </a>
        </p>
      </DialogContent>
    </Dialog>
  )
}
