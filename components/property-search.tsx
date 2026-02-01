"use client"

import { useState } from "react"
import Link from "next/link"
import { trackPropertySearch, trackCtaClick } from "@/lib/analytics"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, CheckCircle, AlertCircle, Clock } from "lucide-react"

const mockResults = [
  {
    address: "1234 Ocean View Dr",
    status: "clear",
    lastChecked: "2 hours ago",
  },
  {
    address: "5678 Harbor Blvd",
    status: "violation",
    lastChecked: "1 day ago",
    violationType: "Unpermitted ADU",
  },
  {
    address: "9101 Palm Ave",
    status: "pending",
    lastChecked: "3 days ago",
  },
]

const SEARCH_COOLDOWN_MS = 3000 // Rate limit: 1 search per 3 seconds

export function PropertySearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSearchAt, setLastSearchAt] = useState(0)

  /** Basic San Diego address validation: at least a street number and street name */
  const isValidAddress = (q: string) => {
    const t = q.trim()
    if (t.length < 5) return false
    const hasNumber = /\d/.test(t)
    const hasLetter = /[a-zA-Z]/.test(t)
    return hasNumber && hasLetter
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    if (!isValidAddress(searchQuery)) {
      setError("Enter a valid San Diego address (e.g., 123 Main St)")
      return
    }
    const now = Date.now()
    if (now - lastSearchAt < SEARCH_COOLDOWN_MS) {
      setError(`Please wait ${Math.ceil((SEARCH_COOLDOWN_MS - (now - lastSearchAt)) / 1000)}s before searching again`)
      return
    }
    setLastSearchAt(now)
    setIsSearching(true)
    setError(null)
    setShowResults(false)
    try {
      // Mock: replace with real API when backend is wired
      await new Promise((r) => setTimeout(r, 1500))
      setShowResults(true)
      trackPropertySearch({ queryLength: searchQuery.trim().length, hasResults: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "clear":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "violation":
        return <AlertCircle className="h-5 w-5 text-red-400" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-400" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "clear":
        return "No Violations"
      case "violation":
        return "Active Violation"
      case "pending":
        return "Review Pending"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="liquid-glass-glow rounded-2xl p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary glow-accent">
          <MapPin className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Property Status</h3>
          <p className="text-sm text-muted-foreground">Check San Diego property compliance</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search Bar with Glow */}
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl" />
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                autoComplete="street-address"
                placeholder="Enter San Diego property address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="h-14 border-primary/30 bg-input pl-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary border-glow"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="h-14 px-6 glow-accent bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Searching
                </span>
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/50 bg-destructive/10 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Sample results for <span className="font-medium text-foreground">&quot;{searchQuery}&quot;</span> — demo mode.
            </p>
            {mockResults.map((result) => (
              <div
                key={result.address}
                className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-4 transition-colors hover:bg-secondary"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <p className="font-medium text-foreground">{result.address}</p>
                    <p className="text-xs text-muted-foreground">
                      Last checked: {result.lastChecked}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    result.status === "clear" ? "text-green-400" :
                    result.status === "violation" ? "text-red-400" :
                    "text-yellow-400"
                  }`}>
                    {getStatusText(result.status)}
                  </p>
                  {result.violationType && (
                    <p className="text-xs text-muted-foreground">{result.violationType}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Placeholder State */}
        {!showResults && (
          <div className="rounded-xl border border-dashed border-border bg-secondary/20 p-8 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Enter an address to check for active violations
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Covers all San Diego County municipalities
            </p>
          </div>
        )}

        {/* Auth Placeholder */}
        <Link href="/auth/sign-up" onClick={() => trackCtaClick({ cta: "sign_up", location: "property_search" })}>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 transition-all hover:bg-primary/10 cursor-pointer">
            <p className="text-center text-sm text-muted-foreground">
              <span className="font-medium text-primary">Sign up now</span> to save properties 
              and receive real-time violation alerts
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
