"use client"

import { useState } from "react"
import { 
  generateAppealLetter, 
  suggestNextAction,
  type ViolationDetail 
} from "@/app/actions/agentic"
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
  Bot, 
  FileText, 
  Lightbulb, 
  Download, 
  Copy,
  CheckCircle,
  Clock,
  DollarSign,
  AlertTriangle
} from "lucide-react"

type ResolutionCenterProps = {
  violation: ViolationDetail
  propertyId: string
}

export function ResolutionCenter({ violation, propertyId }: ResolutionCenterProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [appealLetter, setAppealLetter] = useState<string | null>(null)
  const [citations, setCitations] = useState<string[] | null>(null)
  const [nextAction, setNextAction] = useState<any>(null)
  const [isCopied, setIsCopied] = useState(false)

  const handleGenerateAppeal = async () => {
    setIsGenerating(true)
    const result = await generateAppealLetter(violation.id)
    
    if (result.success) {
      setAppealLetter(result.letter || null)
      setCitations(result.citations || null)
    } else {
      alert(`Failed to generate appeal: ${result.error}`)
    }
    
    setIsGenerating(false)
  }

  const handleSuggestAction = async () => {
    setIsGenerating(true)
    const result = await suggestNextAction(propertyId)
    
    if (result.success) {
      setNextAction(result.action)
    } else {
      alert(`Failed to get suggestion: ${result.error}`)
    }
    
    setIsGenerating(false)
  }

  const handleCopy = () => {
    if (appealLetter) {
      navigator.clipboard.writeText(appealLetter)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-secondary'
    }
  }

  return (
    <div className="liquid-glass-glow rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Agent Resolution</h3>
          <p className="text-sm text-muted-foreground">Automated compliance assistance</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Appeal Letter Generator */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-auto flex-col items-start gap-2 p-4 bg-secondary/50 hover:bg-secondary border-border"
              onClick={handleGenerateAppeal}
              disabled={isGenerating}
            >
              <FileText className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold text-foreground">Draft Appeal Letter</p>
                <p className="text-xs text-muted-foreground">Auto-generate formal appeal</p>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="liquid-glass border-border max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Generated Appeal Letter
              </DialogTitle>
              <DialogDescription>
                AI-drafted formal appeal to San Diego City Treasurer
              </DialogDescription>
            </DialogHeader>
            
            {appealLetter && (
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-secondary/30 p-4">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                    {appealLetter}
                  </pre>
                </div>

                {citations && citations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Municipal Code Citations</h4>
                    <ul className="space-y-1">
                      {citations.map((citation, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{citation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={handleCopy}
                    className="gap-2 bg-transparent"
                    variant="outline"
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Letter
                      </>
                    )}
                  </Button>
                  <Button className="gap-2 glow-accent">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                  <p className="text-sm text-muted-foreground">Generating appeal letter...</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Next Best Action */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-auto flex-col items-start gap-2 p-4 bg-secondary/50 hover:bg-secondary border-border"
              onClick={handleSuggestAction}
              disabled={isGenerating}
            >
              <Lightbulb className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold text-foreground">Next Best Action</p>
                <p className="text-xs text-muted-foreground">AI-recommended steps</p>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="liquid-glass border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Recommended Action
              </DialogTitle>
              <DialogDescription>
                AI-analyzed next steps based on violation patterns
              </DialogDescription>
            </DialogHeader>
            
            {nextAction && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(nextAction.priority)}>
                    {nextAction.priority.toUpperCase()} PRIORITY
                  </Badge>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {nextAction.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {nextAction.description}
                  </p>
                </div>

                {nextAction.deadline && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>
                      Deadline: {new Date(nextAction.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {nextAction.estimatedCost && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span>
                      Estimated Cost: ${nextAction.estimatedCost.toFixed(2)}
                    </span>
                  </div>
                )}

                <Button className="w-full glow-accent">
                  Take Action
                </Button>
              </div>
            )}

            {isGenerating && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                  <p className="text-sm text-muted-foreground">Analyzing violation patterns...</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <AlertTriangle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          AI-generated content for informational purposes. Not legal advice. 
          Verify all details before submission to City Treasurer.
        </p>
      </div>
    </div>
  )
}
