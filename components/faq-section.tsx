"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "How does DoggyBagg detect violations?",
    answer:
      "We continuously monitor all San Diego municipal databases, including the City Treasurer, Code Enforcement, and STRO registries. Our AI system cross-references property addresses with active violation reports and sends real-time alerts when new filings are detected.",
  },
  {
    question: "Which properties can I monitor?",
    answer:
      "You can monitor any residential or commercial property within San Diego County, including short-term rentals (STRs), multifamily units, and ADUs. Our system covers all municipalities within the county.",
  },
  {
    question: "How quickly will I be notified of violations?",
    answer:
      "Most violations are detected within 24 hours of being filed with the city. Critical violations (like STR non-compliance) trigger immediate notifications via email and SMS.",
  },
  {
    question: "What types of violations are tracked?",
    answer:
      "We track all municipal code violations including: trash/debris, unpermitted construction, noise ordinances, parking violations, STR compliance issues, occupancy violations, overgrown vegetation, and more. Each violation type has specific fine structures that our calculator estimates.",
  },
  {
    question: "Can I add properties in bulk?",
    answer:
      "Yes! Enterprise and Professional plan subscribers can upload CSV files with multiple properties. Our system validates each address against the STRO registry and automatically begins monitoring all properties in your portfolio.",
  },
  {
    question: "What happens if I receive a violation alert?",
    answer:
      "When a violation is detected, you'll receive an immediate notification with the violation type, filing date, and recommended actions. Our dashboard provides detailed information including potential fines, resolution deadlines, and historical context.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use bank-level encryption (AES-256) for all data storage and transmission. We're SOC 2 Type II compliant and never share your property information with third parties. All data is stored in secure US-based servers.",
  },
  {
    question: "Can I cancel at any time?",
    answer:
      "Yes, you can cancel your subscription at any time with no penalties. Your data remains accessible for 30 days after cancellation, giving you time to export reports or transition to another solution.",
  },
]

export function FAQSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-pretty">
            Everything you need to know about protecting your San Diego property portfolio
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="liquid-glass rounded-xl border border-border px-6"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Still have questions?
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Our team is here to help you protect your property investments
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <a
                href="/help"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Help Center <span>→</span>
              </a>
              <span className="text-muted-foreground">|</span>
              <a
                href="mailto:support@doggybagg.cc?subject=DoggyBagg%20Support"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                support@doggybagg.cc
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
