"use client"

import { useState } from "react"
import { 
  Building2, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ChevronDown,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight
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

// Sample property data
const properties = [
  {
    id: "1",
    address: "1234 Pacific Beach Dr, San Diego, CA 92109",
    stroTier: 1,
    licenseId: "STR-2024-00142",
    reportingStatus: "compliant",
    riskScore: 12,
    lastChecked: "2 hours ago",
  },
  {
    id: "2",
    address: "5678 La Jolla Shores Dr, San Diego, CA 92037",
    stroTier: 2,
    licenseId: "STR-2024-00891",
    reportingStatus: "warning",
    riskScore: 45,
    lastChecked: "4 hours ago",
  },
  {
    id: "3",
    address: "910 Gaslamp Quarter Way, San Diego, CA 92101",
    stroTier: 3,
    licenseId: "STR-2023-01567",
    reportingStatus: "violation",
    riskScore: 78,
    lastChecked: "1 hour ago",
  },
  {
    id: "4",
    address: "2468 Ocean Front Walk, San Diego, CA 92109",
    stroTier: 1,
    licenseId: "STR-2024-00234",
    reportingStatus: "compliant",
    riskScore: 8,
    lastChecked: "30 minutes ago",
  },
  {
    id: "5",
    address: "1357 North Park Ave, San Diego, CA 92104",
    stroTier: 4,
    licenseId: "STR-2023-02891",
    reportingStatus: "warning",
    riskScore: 52,
    lastChecked: "6 hours ago",
  },
  {
    id: "6",
    address: "8024 Coronado Bay Rd, San Diego, CA 92118",
    stroTier: 2,
    licenseId: "STR-2024-00567",
    reportingStatus: "compliant",
    riskScore: 22,
    lastChecked: "3 hours ago",
  },
]

const stats = [
  {
    label: "Total Properties",
    value: "24",
    change: "+3",
    trend: "up",
    icon: Building2,
  },
  {
    label: "Active Violations",
    value: "2",
    change: "-1",
    trend: "down",
    icon: AlertTriangle,
  },
  {
    label: "Compliant",
    value: "18",
    change: "+2",
    trend: "up",
    icon: CheckCircle,
  },
  {
    label: "Avg Risk Score",
    value: "34",
    change: "-5",
    trend: "down",
    icon: TrendingUp,
  },
]

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
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.licenseId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || property.reportingStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto px-4">
      {/* Stats Bento Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
            <div className="mt-4 flex items-center gap-1">
              {stat.trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-green-400" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-400" />
              )}
              <span className={`text-sm ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                {stat.change}
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last month</span>
            </div>
          </div>
        ))}
      </div>

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
            <Button variant="outline" size="sm" className="gap-2 border-border text-foreground hover:bg-secondary bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="gap-2 glow-accent bg-primary text-primary-foreground hover:bg-primary/90">
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
                        Last checked: {property.lastChecked}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getTierBadge(property.stroTier)}</TableCell>
                  <TableCell>
                    <code className="rounded bg-secondary/50 px-2 py-1 text-sm text-foreground">
                      {property.licenseId}
                    </code>
                  </TableCell>
                  <TableCell>{getStatusBadge(property.reportingStatus)}</TableCell>
                  <TableCell className="text-right">
                    <span className={`font-mono font-bold ${getRiskScoreColor(property.riskScore)}`}>
                      {property.riskScore}
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
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          <ExternalLink className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Risk History
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-destructive">
                          <AlertTriangle className="h-4 w-4" />
                          Report Issue
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredProperties.length === 0 && (
          <div className="py-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No properties found matching your criteria</p>
          </div>
        )}

        {/* Pagination hint */}
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {filteredProperties.length} of {properties.length} properties</p>
          <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary/80">
            View All
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
