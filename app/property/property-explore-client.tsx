"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, MapPin, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ZoneEntry = readonly [string, { readonly count: number; readonly sample: { Address: string }; readonly slug: string }]

type Props = { zoneEntries: ZoneEntry[] }

export function PropertyExploreClient({ zoneEntries }: Props) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Array<{ address: string; slug: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (q.length < 2) return
    setIsLoading(true)
    setResults([])
    try {
      const res = await fetch(`/api/property-search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results ?? [])
    } finally {
      setIsLoading(false)
    }
  }

  const handleResultClick = (slug: string) => {
    router.push(`/property/${slug}`)
  }

  return (
    <div className="mx-auto mt-12 max-w-2xl space-y-10">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="123 Main St, San Diego..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Searching…" : "Search"}
        </Button>
      </form>

      {results.length > 0 && (
        <div className="liquid-glass rounded-2xl border border-primary/10 p-4">
          <p className="mb-3 text-sm font-medium text-muted-foreground">Matches</p>
          <ul className="space-y-2">
            {results.map(({ address, slug }) => (
              <li key={slug}>
                <button
                  type="button"
                  onClick={() => handleResultClick(slug)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-primary/5"
                >
                  <MapPin className="size-4 shrink-0 text-primary" />
                  <span className="flex-1 truncate">{address}</span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length === 0 && query.length >= 2 && !isLoading && (
        <p className="text-center text-sm text-muted-foreground">
          No matches. Try a different address or browse by zone below.
        </p>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold">Explore by Neighborhood</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {zoneEntries.map(([zone, { count, slug }]) => (
            <Link
              key={zone}
              href={slug ? `/property/${slug}` : "/property"}
              className="liquid-glass flex items-center justify-between rounded-xl border border-primary/10 p-4 transition-colors hover:border-primary/20"
            >
              <div>
                <p className="font-medium">{zone}</p>
                <p className="text-sm text-muted-foreground">{count} properties</p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
