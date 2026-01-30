import { Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="liquid-glass rounded-2xl p-8">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-foreground">Check Your Email</h1>
          <p className="mb-6 text-muted-foreground">
            We've sent you a confirmation email. Please click the link in the email to verify your account.
          </p>

          <Link href="/">
            <Button variant="outline" className="w-full bg-transparent">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
