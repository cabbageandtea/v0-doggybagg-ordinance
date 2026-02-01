"use client"

import { useState } from "react"
import { useProperties, useDeleteProperty, type Property } from "@/lib/hooks/use-properties"
import { useOnboarding } from "@/providers/onboarding-provider"
import { useOnboardingViewTrigger } from "@/lib/hooks/use-onboarding-view-trigger"
import { updateOnboardingMilestone } from "@/app/actions/onboarding"
import { useRouter } from "next/navigation"
import { GuidedOnboardingTour } from "@/components/guided-onboarding-tour"
import { PhoneVerificationModal } from "@/components/phone-verification-modal"
import {
  Building2,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PropertyDetailDialog } from "@/components/property-detail-dialog"
import { PropertyEditDialog } from "@/components/property-edit-dialog"
import { PropertyCreateDialog } from "@/components/property-create-dialog"
import { useSubscriptionTier, getTierLimit, isPaidTier } from "@/lib/hooks/use-subscription-tier"

// Stats helper - calculate from properties
function calculateStats(properties: Property[]) {
  const compliantCount = properties.filter(p => p.reporting_status === 'compliant').length
  const violationCount = properties.filter(p => p.reporting_status === 'violation').length  
  const avgRisk = properties.length > 0 
    ? Math.round(properties.reduce((sum, p) => sum + (p.risk_score || 0), 0) / properties.length)
    : 0

  return {
    totalProperties: properties.length,
    activeViolations: violationCount,
    compliant: compliantCount,
    avgRiskScore: avgRisk,
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "compliant":
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
          Compliant
        </Badge>
      )
    case "warning":
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30">
          Warning
        </Badge>
      )
    case "violation":
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">
          Violation
        </Badge>
      )
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

function getRiskScoreColor(score: number) {
  if (score <= 25) return "text-green-400"
  if (score <= 50) return "text-yellow-400"
  if (score <= 75) return "text-orange-400"
  return "text-red-400"
}

function getTierBadge(tier: number) {
  const colors: Record<number, string> = {
    1: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    2: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    3: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    4: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  }
  return (
    <Badge className={`${colors[tier] || "bg-secondary"} hover:opacity-80`}>
      Tier {tier}
    </Badge>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [detailProperty, setDetailProperty] = useState<Property | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editProperty, setEditProperty] = useState<Property | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  const { data: properties = [], isLoading, error: queryError } = useProperties()
  const { data: tier = "free" } = useSubscriptionTier()
  const deleteMutation = useDeleteProperty()
  const onboarding = useOnboarding()

  const tierLimit = getTierLimit(tier)
  const showUpgradePrompt = !isPaidTier(tier)

  // Zero-effort: fire has_viewed_risk_score when user scrolls to stats section
  useOnboardingViewTrigger("neighborhood-watch", () => void onboarding.refetch())
  const error = queryError ? String(queryError) : null

  const stats = properties.length > 0 ? calculateStats(properties) : {
    totalProperties: 0,
    activeViolations: 0,
    compliant: 0,
    avgRiskScore: 0,
  }

  const statsDisplay = [
    { label: "Total Properties", value: stats.totalProperties.toString(), icon: Building2 },
    { label: "Active Violations", value: stats.activeViolations.toString(), icon: AlertTriangle },
    { label: "Compliant", value: stats.compliant.toString(), icon: CheckCircle },
    { label: "Avg Risk Score", value: stats.avgRiskScore.toString(), icon: TrendingUp },
  ]

  const exportToCSV = () => {
    const headers = ["Address", "STRO Tier", "License ID", "Status", "Risk Score", "Added"]
    const rows = filteredProperties.map((p) => [
      `"${p.address.replace(/"/g, '""')}"`,
      p.stro_tier ?? 1,
      p.license_id || "",
      p.reporting_status || "pending",
      p.risk_score ?? 0,
      p.created_at ? new Date(p.created_at).toLocaleDateString() : "",
    ])
    const footer = ["", "Exported from DoggyBagg — doggybagg.cc — San Diego property compliance monitoring"]
    const csv = [headers.join(","), ...rows.map((r) => r.join(",")), ...footer].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `doggybagg-properties-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const openDetail = (property: Property) => {
    setDetailProperty(property)
    setDetailOpen(true)
  }

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (property.license_id || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || property.reporting_status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm("Are you sure you want to remove this property from monitoring?")) return
    const result = await deleteMutation.mutateAsync(propertyId)
    if (!result.success) alert(`Failed to delete property: ${result.error}`)
  }

  const handleEdit = (property: Property) => {
    setEditProperty(property)
    setEditOpen(true)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
            <p className="text-muted-foreground">Loading your properties...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4">
        <div className="liquid-glass-glow rounded-2xl p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Properties</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => void router.refresh()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      {/* Guided Onboarding Tour */}
      {showOnboarding && (
        <GuidedOnboardingTour 
          onComplete={() => setShowOnboarding(false)} 
        />
      )}

      {/* Top Actions Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
            {isPaidTier(tier) && (
              <Badge className="bg-primary/20 text-primary border-primary/30 capitalize">
                {tier}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {properties.length > 0
              ? `Your portfolio at a glance · ${properties.length}/${tierLimit} properties`
              : "Add properties to start monitoring"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showUpgradePrompt && (
            <Button variant="outline" size="sm" asChild>
              <a href="/#pricing">Upgrade</a>
            </Button>
          )}
          <PhoneVerificationModal
            highlight={onboarding.primaryCta === "verify_phone"}
            onVerified={async () => {
              await updateOnboardingMilestone("has_verified_phone")
              await onboarding.refetch()
            }}
          />
          <Button
            id="add-property-button"
            className={`gap-2 ${onboarding.primaryCta === "add_property" ? "glow-accent ring-2 ring-primary/50 ring-offset-2 ring-offset-background" : "glow-accent"}`}
            onClick={() => setCreateOpen(true)}
          >
            Add Property
          </Button>
          <Button variant="outline" onClick={() => router.push("/upload")}>
            Upload CSV
          </Button>
        </div>
      </div>

      {/* Stats Bento Grid - id for onboarding "view risk" step */}
      <div id="neighborhood-watch" className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsDisplay.map((stat) => (
          <div
            key={stat.label}
            className="liquid-glass rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <PropertyDetailDialog
        property={detailProperty}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={handleEdit}
      />
      <PropertyEditDialog
        property={editProperty}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditProperty(null)
        }}
      />
      <PropertyCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => void onboarding.refetch()}
      />

      {/* Property Table Card */}
      <div className="liquid-glass-glow rounded-2xl p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Property Portfolio</h2>
            <p className="text-sm text-muted-foreground">
              Monitor compliance status across all your San Diego properties
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border bg-transparent text-foreground hover:bg-secondary"
              onClick={exportToCSV}
              disabled={filteredProperties.length === 0}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button
              size="sm"
              className="gap-2 glow-accent bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setCreateOpen(true)}
            >
              Add Property
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by address or license ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-secondary/50 border-border text-foreground">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="liquid-glass border-border">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="compliant">Compliant</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="violation">Violation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Address</TableHead>
                <TableHead className="text-muted-foreground">STRO Tier</TableHead>
                <TableHead className="text-muted-foreground">License ID</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Risk Score</TableHead>
                <TableHead className="text-muted-foreground w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow 
                  key={property.id} 
                  className="border-border hover:bg-secondary/30 transition-colors"
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{property.address}</p>
                      <p className="text-xs text-muted-foreground">
                        Added: {property.created_at ? new Date(property.created_at).toLocaleDateString() : '—'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getTierBadge(property.stro_tier || 1)}</TableCell>
                  <TableCell>
                    <code className="rounded bg-secondary/50 px-2 py-1 text-sm text-foreground">
                      {property.license_id || 'N/A'}
                    </code>
                  </TableCell>
                  <TableCell>{getStatusBadge(property.reporting_status)}</TableCell>
                  <TableCell className="text-right">
                    <span className={`font-mono font-bold ${getRiskScoreColor(property.risk_score || 0)}`}>
                      {property.risk_score || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="liquid-glass border-border">
                        <DropdownMenuItem
                          className="cursor-pointer gap-2"
                          onClick={() => openDetail(property)}
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer gap-2 text-destructive"
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          <AlertTriangle className="h-4 w-4" />
                          Remove Property
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredProperties.length === 0 && properties.length === 0 && (
          <div className="py-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-foreground font-semibold">No properties yet</p>
            <p className="mt-2 text-sm text-muted-foreground">Add your first property to start monitoring compliance</p>
            <Button className="mt-4 glow-accent" onClick={() => setCreateOpen(true)}>
              Add Your First Property
            </Button>
          </div>
        )}
        
        {filteredProperties.length === 0 && properties.length > 0 && (
          <div className="py-12 text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No properties match your search criteria</p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {filteredProperties.length} of {properties.length} properties</p>
          {(searchQuery || statusFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-primary hover:text-primary/80"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
