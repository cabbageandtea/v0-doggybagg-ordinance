import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"
import { FileQuestion, BookOpen, Mail, Rocket, CreditCard, Search, AlertCircle } from "lucide-react"

export const metadata = {
  title: "Help Center",
  description:
    "DoggyBagg help and support — getting started, billing, property search, and contact options for precision ordinance oversight.",
}

const helpLinks = [
  { href: "/docs", label: "API & Documentation", icon: BookOpen },
  { href: "/privacy", label: "Privacy Policy", icon: FileQuestion },
  { href: "mailto:support@doggybagg.cc?subject=Help%20Request", label: "Contact Support", icon: Mail },
]

const sections = [
  {
    id: "getting-started",
    icon: Rocket,
    title: "Getting Started",
    items: [
      "Sign up at doggybagg.cc with your email.",
      "Add your first property (address or STRO license ID).",
      "Your dashboard shows health scores and ordinance standing.",
      "Enable email/SMS alerts in Settings to stay informed.",
    ],
  },
  {
    id: "billing",
    icon: CreditCard,
    title: "Billing & Plans",
    items: [
      "Community Alert (free): 1 property, weekly checks.",
      "Starter ($29/mo): 1 property, daily checks, email updates.",
      "Professional ($99/mo): Up to 10 properties, real-time monitoring, SMS + email updates.",
      "Cancel anytime from your dashboard. No long-term commitment.",
    ],
  },
  {
    id: "property-search",
    icon: Search,
    title: "Property Search",
    items: [
      "Enter a San Diego address or STRO license number.",
      "Results show compliance status and any known violations.",
      "Bulk upload via CSV is available on Professional and Enterprise plans.",
    ],
  },
  {
    id: "common-issues",
    icon: AlertCircle,
    title: "Common Issues",
    items: [
      "Can't find my property: Ensure the address is in San Diego County. Try the full street address.",
      "Alerts not arriving: Check spam folder and notification settings in your account.",
      "Wrong violation shown: Contact support@doggybagg.cc with the property and violation details.",
    ],
  },
]

export default function HelpPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="liquid-glass-glow mx-auto max-w-3xl rounded-2xl border border-primary/10 p-8 md:p-12">
            <h1 className="mb-4 text-3xl font-bold text-foreground">Help Center</h1>
            <p className="mb-10 text-muted-foreground">
              Get answers, guides, and support. We&apos;re here to help you stay compliant.
            </p>

            <div className="mb-12 space-y-6">
              {sections.map((s) => {
                const Icon = s.icon
                return (
                  <section key={s.id} id={s.id} className="scroll-mt-24">
                    <div className="mb-3 flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold text-foreground">{s.title}</h2>
                    </div>
                    <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                      {s.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>

            <div className="mb-10 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Quick links</h2>
              {helpLinks.map((item) => {
                const Icon = item.icon
                const isMailto = item.href.startsWith("mailto:")
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 rounded-xl border border-border bg-secondary/30 p-4 transition-colors hover:border-primary/30 hover:bg-secondary/50"
                  >
                    <Icon className="h-6 w-6 text-primary" />
                    <span className="font-medium text-foreground">{item.label}</span>
                    {!isMailto && <span className="ml-auto text-primary">→</span>}
                  </Link>
                )
              })}
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <h2 className="mb-2 text-lg font-semibold text-foreground">Contact support</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Questions not answered here? Email us and we&apos;ll respond within 24 hours.
              </p>
              <a
                href="mailto:support@doggybagg.cc?subject=DoggyBagg%20Support%20Request"
                className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                support@doggybagg.cc
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
