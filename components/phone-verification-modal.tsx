"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Smartphone, CheckCircle, AlertCircle } from "lucide-react"
import { trackPhoneVerified } from "@/lib/analytics"

type PhoneVerificationModalProps = {
  onVerified?: () => void | Promise<void>
  highlight?: boolean
}

export function PhoneVerificationModal({ onVerified, highlight }: PhoneVerificationModalProps) {
  const [open, setOpen] = useState(false)
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<'phone' | 'code' | 'verified'>('phone')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSendCode() {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate SMS sending (in production, integrate with Twilio/SNS)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setStep('code')
    setIsLoading(false)
  }

  async function handleVerifyCode() {
    if (!code || code.length !== 6) {
      setError("Please enter the 6-digit code")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate verification (in production, verify with backend)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setStep('verified')
    setIsLoading(false)
    trackPhoneVerified()

    // Call parent callback
    setTimeout(() => {
      if (onVerified) onVerified()
      setOpen(false)
      // Reset after close
      setTimeout(() => {
        setStep('phone')
        setPhone("")
        setCode("")
      }, 300)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          id="verify-phone-button"
          variant="outline"
          className={`gap-2 border-primary/30 bg-transparent ${highlight ? "ring-2 ring-primary/50 ring-offset-2 ring-offset-background" : ""}`}
        >
          <Smartphone className="h-4 w-4" />
          Verify Phone
        </Button>
      </DialogTrigger>
      <DialogContent className="liquid-glass sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            Phone Verification
          </DialogTitle>
          <DialogDescription>
            {step === 'phone' && "Enter your phone number to receive SMS alerts"}
            {step === 'code' && "Enter the verification code we sent"}
            {step === 'verified' && "Your phone has been verified!"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'phone' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button
                className="w-full glow-accent"
                onClick={handleSendCode}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </>
          )}

          {step === 'code' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="bg-background/50 text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-muted-foreground">
                  Code sent to {phone}
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Button
                  className="w-full glow-accent"
                  onClick={handleVerifyCode}
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep('phone')}
                >
                  Change Phone Number
                </Button>
              </div>
            </>
          )}

          {step === 'verified' && (
            <div className="py-8 text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 mb-4">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Phone Verified!
              </h3>
              <p className="text-sm text-muted-foreground">
                You'll now receive SMS alerts for violations
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
