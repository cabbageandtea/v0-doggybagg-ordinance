import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, AlertTriangle } from "lucide-react"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-destructive/20 p-6">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
          </div>
          
          <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
          <h2 className="mb-6 text-2xl font-semibold text-foreground">Page Not Found</h2>
          
          <p className="mx-auto mb-8 max-w-md text-muted-foreground">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/">
              <Button className="gap-2 glow-accent bg-primary text-primary-foreground hover:bg-primary/90">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2 border-border text-foreground hover:bg-secondary bg-transparent">
                <Search className="h-4 w-4" />
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
