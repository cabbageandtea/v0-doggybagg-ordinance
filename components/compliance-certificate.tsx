"use client"

import { useState } from "react"
import { generateComplianceCertificate } from "@/app/actions/agentic"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Award, 
  Download, 
  Shield, 
  CheckCircle,
  ExternalLink,
  Copy,
  FileCheck
} from "lucide-react"

type ComplianceCertificateProps = {
  propertyId: string
  propertyAddress: string
}

type CertificateData = {
  certificateId: string
  issuedDate: string
  expiryDate: string
  propertyAddress: string
  blockchainHash: string
  complianceScore: number
  verificationUrl: string
}

export function ComplianceCertificate({ propertyId, propertyAddress }: ComplianceCertificateProps) {
  const [certificate, setCertificate] = useState<CertificateData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    const result = await generateComplianceCertificate(propertyId)
    
    if (result.success && result.certificate) {
      setCertificate(result.certificate)
    } else {
      alert(`Failed to generate certificate: ${result.error}`)
    }
    
    setIsGenerating(false)
  }

  const handleCopyHash = () => {
    if (certificate?.blockchainHash) {
      void navigator.clipboard.writeText(certificate.blockchainHash)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-primary/30 hover:border-primary/50 bg-primary/5 hover:bg-primary/10"
          onClick={handleGenerate}
        >
          <Award className="h-4 w-4" />
          Generate Compliance Certificate
        </Button>
      </DialogTrigger>
      <DialogContent className="liquid-glass border-border max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Certificate of Compliance
          </DialogTitle>
          <DialogDescription>
            Institutional-grade compliance verification for {propertyAddress}
          </DialogDescription>
        </DialogHeader>

        {isGenerating && !certificate && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="text-sm text-muted-foreground">Generating certificate...</p>
            </div>
          </div>
        )}

        {certificate && (
          <div className="space-y-6">
            {/* Certificate Display */}
            <div className="rounded-xl border-2 border-primary/30 bg-gradient-to-br from-secondary/50 to-secondary/30 p-8 relative overflow-hidden">
              {/* Watermark Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5">
                <Shield className="h-64 w-64" />
              </div>

              {/* Certificate Content */}
              <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="text-center border-b border-border pb-4">
                  <div className="flex justify-center mb-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 border-2 border-primary">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    CERTIFICATE OF COMPLIANCE
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    DoggyBagg LLC - Ordinance.ai Platform
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    San Diego Municipal Code Compliance Verification
                  </p>
                </div>

                {/* Certificate Details */}
                <div className="grid gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Certificate ID</p>
                      <p className="font-mono text-sm text-foreground">{certificate.certificateId}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Issue Date</p>
                      <p className="text-sm text-foreground">
                        {new Date(certificate.issuedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Property Address</p>
                    <p className="text-lg font-semibold text-foreground">{certificate.propertyAddress}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Compliance Score</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${getScoreColor(certificate.complianceScore)}`}>
                          {certificate.complianceScore}/100
                        </span>
                        {certificate.complianceScore >= 85 && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            EXCELLENT
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Valid Until</p>
                      <p className="text-sm text-foreground">
                        {new Date(certificate.expiryDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Blockchain Verification */}
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground mb-1">
                        Blockchain Verification
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        This certificate is cryptographically verified for institutional investors
                      </p>
                      <div className="flex items-center gap-2 p-2 rounded bg-secondary/50 border border-border overflow-hidden">
                        <code className="text-xs font-mono text-foreground break-all">
                          {certificate.blockchainHash}
                        </code>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleCopyHash}
                      className="gap-2 bg-transparent"
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy Hash
                        </>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2 bg-transparent"
                      asChild
                    >
                      <a 
                        href={certificate.verificationUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Verify Online
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Certification Statement */}
                <div className="text-center pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">
                    This certificate verifies that the above property has been analyzed for 
                    compliance with San Diego Municipal Code ordinances as of the issue date. 
                    Data sourced from public municipal records.
                  </p>
                </div>

                {/* Footer Signature */}
                <div className="flex justify-between items-end pt-4">
                  <div className="text-left">
                    <div className="border-t-2 border-foreground w-48 mb-1"></div>
                    <p className="text-xs text-muted-foreground">Authorized Signature</p>
                    <p className="text-xs font-semibold text-foreground">DoggyBagg LLC</p>
                  </div>
                  <div className="text-right">
                    <FileCheck className="h-12 w-12 text-primary/30 mb-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button className="flex-1 gap-2 glow-accent">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <ExternalLink className="h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Disclaimer */}
            <div className="rounded-lg border border-border bg-secondary/30 p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> This certificate is generated from public municipal data 
                and is intended for informational purposes. It does not constitute legal advice 
                or guarantee future compliance. Verify all information with San Diego City Treasurer.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
