import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"
import { FileQuestion, BookOpen, Mail } from "lucide-react"

export const metadata = {
  title: "Help Center",
  description: "DoggyBagg help and support — get answers about property compliance monitoring.",
}

const helpLinks = [
  { href: "/docs", label: "API & Documentation", icon: BookOpen },
  { href: "/privacy", label: "Privacy Policy", icon: FileQuestion },
  { href: "mailto:support@doggybagg.cc?subject=Help%20Request", label: "Contact Support", icon: Mail },
]

export default function HelpPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="liquid-glass-glow mx-auto max-w-3xl rounded-2xl border border-primary/10 p-8 md:p-12">
            <h1 className="mb-8 text-3xl font-bold text-foreground">Help Center</h1>
            <p className="mb-8 text-muted-foreground">
              Find documentation, FAQs, and contact options. We&apos;re here to help you stay compliant.
            </p>
            <div className="space-y-4">
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
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
