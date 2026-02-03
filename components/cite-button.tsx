"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = { title: string; url: string }

export function CiteButton({ title, url }: Props) {
  const [copied, setCopied] = useState(false)

  const citation = `DoggyBagg. "${title}." doggybagg.cc. ${url}. Accessed ${new Date().toLocaleDateString("en-US")}.`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(citation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="text-muted-foreground">
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      <span className="ml-1.5">{copied ? "Copied" : "Cite"}</span>
    </Button>
  )
}
