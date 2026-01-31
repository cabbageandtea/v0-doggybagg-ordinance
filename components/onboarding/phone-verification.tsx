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
import { updateOnboardingProgress } from "@/app/actions/agentic"
import { Phone, CheckCircle, Loader2 } from "lucide-react"

export function PhoneVerification() {
  const [isOpen, setIsOpen] = useState(false)
  const [phone, setPhone] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [step, setStep] = useState<'input' | 'verify' | 'success'>('input')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSendCode() {
    if (!phone || phone.length < 10) {
      alert('Please enter a valid phone number')
      return
    }

    setIsLoading(true)
    // Simulate sending SMS
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setStep('verify')
  }

  async function handleVerify() {
    if (verificationCode.length !== 6) {
      alert('Please enter the 6-digit code')
      return
    }

    setIsLoading(true)
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update onboarding progress
    await updateOnboardingProgress('verify_phone')
    
    setIsLoading(false)
    setStep('success')
    
    // Close dialog after success
    setTimeout(() => {
      setIsOpen(false)
      setStep('input')
      setPhone("")
      setVerificationCode("")
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 bg-transparent"
          data-onboarding="verify-phone-btn"
        >
          <Phone className="h-4 w-4" />
          Verify Phone
        </Button>
      </DialogTrigger>
      <DialogContent className="liquid-glass">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {step === 'input' && 'Verify Your Phone Number'}
            {step === 'verify' && 'Enter Verification Code'}
            {step === 'success' && 'Phone Verified!'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === 'input' && 'Receive instant SMS alerts for property violations'}
            {step === 'verify' && `We sent a 6-digit code to ${phone}`}
            {step === 'success' && 'You will now receive SMS alerts for violations'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'input' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              <Button 
                onClick={handleSendCode} 
                disabled={isLoading}
                className="w-full glow-accent"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            </>
          )}

          {step === 'verify' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="bg-secondary/50 text-center text-2xl tracking-widest"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('input')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleVerify} 
                  disabled={isLoading}
                  className="flex-1 glow-accent"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify'
                  )}
                </Button>
              </div>
            </>
          )}

          {step === 'success' && (
            <div className="text-center py-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-lg font-semibold text-foreground">Phone Verified!</p>
              <p className="text-sm text-muted-foreground mt-2">
                You're all set to receive SMS alerts
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
