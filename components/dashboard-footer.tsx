"use client"

import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export function DashboardFooter() {
  return (
    <footer className="mt-8 border-t border-border bg-secondary/10">
      <div className="container mx-auto px-4 py-6">
        {/* Legal Disclaimer */}
        <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ordinance.ai is a data-monitoring utility by DoggyBagg LLC. Registry matching 
              is based on public San Diego municipal records. Not legal or tax advice. We do 
              not warrant 100% accuracy; verify all findings with the San Diego City Treasurer. 
              Liability is limited to the greater of $100 or the amount paid in the last 12 months.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 DoggyBagg LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
              CCPA Notice
            </Link>
            <Link href="mailto:support@doggybagg.cc" className="text-xs text-muted-foreground hover:text-foreground">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
