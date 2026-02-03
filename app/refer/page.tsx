import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"
import { Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Refer Landlords, Earn",
  description:
    "DoggyBagg referral program. Refer property managers and landlords, earn when they sign up. Precision ordinance oversight.",
}

export default function ReferPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="liquid-glass-glow mx-auto max-w-2xl rounded-2xl border border-primary/10 p-8 md:p-12">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-foreground">
              Refer Landlords, Earn
            </h1>
            <p className="mb-6 text-muted-foreground">
              Know property managers or landlords in San Diego? Send them our way. We&apos;ll get you set up as a referral partner and you&apos;ll earn when they protect their portfolio with DoggyBagg.
            </p>
            <ul className="mb-8 space-y-2 text-sm text-muted-foreground">
              <li>• Property managers, real estate investors, landlords</li>
              <li>• San Diego County focus</li>
              <li>• Earn per qualifying sign-up</li>
            </ul>
            <a
              href="mailto:maliklomax@doggybagg.cc?subject=Referral%20Partner%20Inquiry&body=Hi%2C%20I%27d%20like%20to%20learn%20about%20the%20DoggyBagg%20referral%20program.%0A%0AName%3A%0ANumber%20of%20landlords%2FPMs%20I%20can%20refer%3A"
            >
              <Button size="lg" className="gap-2 glow-accent bg-primary">
                Get Started as a Referral Partner
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <p className="mt-6 text-xs text-muted-foreground">
              We&apos;ll respond within 24 hours with program details.
            </p>
            <div className="mt-10">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                ← Back to home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
