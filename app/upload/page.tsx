"use client"

import React, { useState, useCallback } from "react"
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  X,
  Download,
  FileText,
  ArrowRight,
  Loader2,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAddProperty, useAddPropertiesBulk, type AddPropertyInput } from "@/lib/hooks/use-properties"
import { trackAddProperty } from "@/lib/analytics"

type UploadStatus = "idle" | "uploading" | "processing" | "success" | "error"

interface UploadedFile {
  name: string
  size: number
  status: UploadStatus
  progress: number
  recordCount?: number
  successCount?: number
  failedCount?: number
  errorMessage?: string
}

const sampleColumns = [
  { name: "address", required: true, description: "Full property address including city and ZIP" },
  { name: "stro_tier", required: true, description: "STRO tier (1-4)" },
  { name: "license_id", required: true, description: "San Diego STR License ID" },
  { name: "owner_name", required: false, description: "Property owner name" },
  { name: "acquisition_date", required: false, description: "Date property was acquired" },
]

const CSV_TEMPLATE = `address,stro_tier,license_id,owner_name
"123 Main St, San Diego, CA 92101",1,STR-2024-001,
"456 Oak Ave, San Diego, CA 92102",2,STR-2024-002,
"789 Pine Rd, San Diego, CA 92103",1,STR-2024-003,`

function parseCSV(text: string): AddPropertyInput[] {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) return []

  const headers = lines[0].toLowerCase().split(",").map((h) => h.trim().replace(/^"|"$/g, ""))
  const addrIdx = headers.findIndex((h) => h.includes("address"))
  const tierIdx = headers.findIndex((h) => h.includes("stro") && h.includes("tier"))
  const licenseIdx = headers.findIndex((h) => h.includes("license"))

  if (addrIdx === -1 || tierIdx === -1 || licenseIdx === -1) return []

  const parseRow = (row: string): string[] => {
    const result: string[] = []
    let current = ""
    let inQuotes = false
    for (let i = 0; i < row.length; i++) {
      const c = row[i]
      if (c === '"') inQuotes = !inQuotes
      else if ((c === "," && !inQuotes) || c === "\n") {
        result.push(current.trim())
        current = ""
      } else current += c
    }
    result.push(current.trim())
    return result
  }

  const properties: AddPropertyInput[] = []
  for (let i = 1; i < lines.length; i++) {
    const cells = parseRow(lines[i])
    const address = (cells[addrIdx] || "").replace(/^"|"$/g, "").trim()
    const stroTier = parseInt(cells[tierIdx] || "1", 10)
    const licenseId = (cells[licenseIdx] || "").replace(/^"|"$/g, "").trim()

    if (!address || !licenseId) continue
    const tier = stroTier >= 1 && stroTier <= 4 ? stroTier : 1
    properties.push({ address, stro_tier: tier, license_id: licenseId })
  }
  return properties
}

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [quickAdd, setQuickAdd] = useState({ address: "", stro_tier: 1, license_id: "" })
  const [quickAddError, setQuickAddError] = useState<string | null>(null)

  const addPropertyMutation = useAddProperty()
  const addBulkMutation = useAddPropertiesBulk()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const MAX_CSV_SIZE = 10 * 1024 * 1024 // 10MB
  const MAX_ROWS = 500

  const processCSVFile = async (file: File) => {
    if (file.size > MAX_CSV_SIZE) {
      setUploadedFile({
        name: file.name,
        size: file.size,
        status: "error",
        progress: 0,
        errorMessage: "File too large. Maximum size is 10MB.",
      })
      return
    }
    setUploadedFile({
      name: file.name,
      size: file.size,
      status: "uploading",
      progress: 0,
    })

    const text = await file.text()
    const properties = parseCSV(text)

    if (properties.length > MAX_ROWS) {
      setUploadedFile((prev) =>
        prev
          ? {
              ...prev,
              status: "error",
              errorMessage: `Too many rows (${properties.length}). Maximum is ${MAX_ROWS}.`,
            }
          : null
      )
      return
    }

    if (properties.length === 0) {
      setUploadedFile((prev) =>
        prev
          ? {
              ...prev,
              status: "error",
              errorMessage: "No valid properties found. Check CSV format (address, stro_tier, license_id).",
            }
          : null
      )
      return
    }

    setUploadedFile((prev) =>
      prev ? { ...prev, status: "processing", progress: 50 } : null
    )

    const result = await addBulkMutation.mutateAsync(properties)
    if (result.success > 0) trackAddProperty({ source: "upload", count: result.success })

    setUploadedFile((prev) =>
      prev
        ? {
            ...prev,
            status: result.failed === properties.length ? "error" : "success",
            progress: 100,
            recordCount: properties.length,
            successCount: result.success,
            failedCount: result.failed,
            errorMessage:
              result.errors.length > 0
                ? result.errors.slice(0, 3).join("; ") + (result.errors.length > 3 ? "..." : "")
                : undefined,
          }
        : null
    )
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    const csvFile = files.find((f) => f.type === "text/csv" || f.name.endsWith(".csv"))
    if (csvFile) processCSVFile(csvFile)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) processCSVFile(files[0])
    e.target.value = ""
  }

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickAdd.address.trim() || !quickAdd.license_id.trim()) return
    setQuickAddError(null)
    const result = await addPropertyMutation.mutateAsync({
      address: quickAdd.address.trim(),
      stro_tier: quickAdd.stro_tier,
      license_id: quickAdd.license_id.trim(),
    })
    if (result.success) {
      setQuickAdd({ address: "", stro_tier: 1, license_id: "" })
      trackAddProperty({ source: "upload" })
    } else {
      setQuickAddError(result.error || "Failed to add property")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const resetUpload = () => setUploadedFile(null)

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "property-portfolio-template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <MeshGradientBackground />
      <DashboardHeader />
      <main className="min-h-screen pt-24 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Upload Portfolio</h1>
            <p className="mt-2 text-muted-foreground">
              Import your property portfolio via CSV or add a single property below
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="liquid-glass-glow rounded-2xl p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Portfolio Ingestion</h2>

              {!uploadedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 ${
                    isDragging
                      ? "border-primary bg-primary/10 scale-[1.02]"
                      : "border-border bg-secondary/20 hover:border-primary/50 hover:bg-secondary/30"
                  }`}
                >
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label="Upload CSV file"
                  />
                  <div
                    className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all ${
                      isDragging ? "bg-primary/20 glow-accent-intense" : "bg-secondary"
                    }`}
                  >
                    <Upload
                      className={`h-8 w-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                  <p className="mb-2 font-medium text-foreground">
                    {isDragging ? "Drop your CSV file here" : "Drag & drop your CSV file"}
                  </p>
                  <p className="mb-4 text-sm text-muted-foreground">or click to browse</p>
                  <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-2">
                    <FileSpreadsheet className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Supports .CSV up to 10MB</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-secondary/30 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                            uploadedFile.status === "success"
                              ? "bg-green-500/20"
                              : uploadedFile.status === "error"
                                ? "bg-red-500/20"
                                : "bg-primary/20"
                          }`}
                        >
                          {uploadedFile.status === "success" ? (
                            <CheckCircle className="h-6 w-6 text-green-400" />
                          ) : uploadedFile.status === "error" ? (
                            <AlertCircle className="h-6 w-6 text-red-400" />
                          ) : (
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{uploadedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(uploadedFile.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={resetUpload}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {(uploadedFile.status === "uploading" ||
                      uploadedFile.status === "processing") && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {uploadedFile.status === "uploading"
                              ? "Reading file..."
                              : "Saving to database..."}
                          </span>
                          <span className="text-foreground">{Math.round(uploadedFile.progress)}%</span>
                        </div>
                        <Progress value={uploadedFile.progress} className="h-2" />
                      </div>
                    )}

                    {uploadedFile.status === "success" && (
                      <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/10 p-3">
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Import Complete</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {uploadedFile.successCount} of {uploadedFile.recordCount} properties added
                          {uploadedFile.failedCount && uploadedFile.failedCount > 0 && (
                            <span className="text-yellow-400">
                              {" "}
                              ({uploadedFile.failedCount} failed)
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    {uploadedFile.status === "error" && (
                      <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                        <div className="flex items-center gap-2 text-red-400">
                          <AlertCircle className="h-4 w-4" />
                          <span className="font-medium">Import Failed</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {uploadedFile.errorMessage}
                        </p>
                      </div>
                    )}
                  </div>

                  {uploadedFile.status === "success" && (
                    <div className="flex gap-3">
                      <Button
                        onClick={resetUpload}
                        variant="outline"
                        className="flex-1 border-border bg-transparent text-foreground hover:bg-secondary"
                      >
                        Upload Another
                      </Button>
                      <Button
                        className="flex-1 gap-2 bg-primary text-primary-foreground glow-accent hover:bg-primary/90"
                        onClick={() => (window.location.href = "/dashboard")}
                      >
                        View Dashboard
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="liquid-glass rounded-2xl p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Add Property</h2>
                <form onSubmit={handleQuickAdd} className="space-y-4">
                  <div>
                    <Label htmlFor="address" className="text-foreground">
                      Address *
                    </Label>
                    <Input
                      id="address"
                      name="street-address"
                      autoComplete="street-address"
                      value={quickAdd.address}
                      onChange={(e) => setQuickAdd((p) => ({ ...p, address: e.target.value }))}
                      placeholder="123 Main St, San Diego, CA 92101"
                      className="mt-1 border-border bg-secondary/50 text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="stro_tier" className="text-foreground">
                      STRO Tier
                    </Label>
                    <Select
                      value={quickAdd.stro_tier.toString()}
                      onValueChange={(v) =>
                        setQuickAdd((p) => ({ ...p, stro_tier: parseInt(v, 10) }))
                      }
                    >
                      <SelectTrigger className="mt-1 border-border bg-secondary/50 text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Tier 1</SelectItem>
                        <SelectItem value="2">Tier 2</SelectItem>
                        <SelectItem value="3">Tier 3</SelectItem>
                        <SelectItem value="4">Tier 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="license_id" className="text-foreground">
                      License ID *
                    </Label>
                    <Input
                      id="license_id"
                      name="license-id"
                      autoComplete="off"
                      value={quickAdd.license_id}
                      onChange={(e) => setQuickAdd((p) => ({ ...p, license_id: e.target.value }))}
                      placeholder="STR-2024-001"
                      className="mt-1 border-border bg-secondary/50 text-foreground"
                      required
                    />
                  </div>
                  {quickAddError && (
                    <p className="text-sm text-red-400">{quickAddError}</p>
                  )}
                  <Button
                    type="submit"
                    disabled={addPropertyMutation.isPending}
                    className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {addPropertyMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {addPropertyMutation.isPending ? "Adding..." : "Add Property"}
                  </Button>
                </form>
              </div>

              <div className="liquid-glass rounded-2xl p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">CSV Format Guide</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Required columns: address, stro_tier, license_id
                </p>
                <div className="space-y-3">
                  {sampleColumns.map((col) => (
                    <div
                      key={col.name}
                      className="flex items-start gap-3 rounded-lg border border-border bg-secondary/20 p-3"
                    >
                      <code
                        className={`rounded px-2 py-1 text-sm ${
                          col.required ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {col.name}
                        {col.required && "*"}
                      </code>
                      <p className="flex-1 text-sm text-muted-foreground">{col.description}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-xl border border-border bg-secondary/20 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">Sample Template</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-border bg-transparent text-foreground hover:bg-secondary"
                    onClick={downloadTemplate}
                  >
                    <Download className="h-4 w-4" />
                    Download Template
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
