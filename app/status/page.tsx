import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"
import { CheckCircle } from "lucide-react"

export const metadata = {
  title: "System Status",
  description: "DoggyBagg system status and uptime.",
}

export default function StatusPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="liquid-glass-glow mx-auto max-w-3xl rounded-2xl border border-primary/10 p-8 md:p-12">
            <h1 className="mb-8 text-3xl font-bold text-foreground">System Status</h1>
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <div>
                <p className="font-medium text-foreground">All Systems Operational</p>
                <p className="text-sm text-muted-foreground">Monitoring, API, and dashboard are running normally.</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              For urgent issues, contact{" "}
              <a href="mailto:support@doggybagg.cc?subject=System%20Status%20Inquiry" className="text-primary hover:underline">
                support@doggybagg.cc
              </a>
              .
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
