"use client"

import React from "react"

import { useState, useCallback } from "react"
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Download,
  FileText,
  ArrowRight,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MeshGradientBackground } from "@/components/mesh-gradient-background"
import { DashboardHeader } from "@/components/dashboard-header"

type UploadStatus = "idle" | "uploading" | "processing" | "success" | "error"

interface UploadedFile {
  name: string
  size: number
  status: UploadStatus
  progress: number
  recordCount?: number
  errorMessage?: string
}

const sampleColumns = [
  { name: "address", required: true, description: "Full property address including city and ZIP" },
  { name: "stro_tier", required: true, description: "STRO tier (1-4)" },
  { name: "license_id", required: true, description: "San Diego STR License ID" },
  { name: "owner_name", required: false, description: "Property owner name" },
  { name: "acquisition_date", required: false, description: "Date property was acquired" },
]

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const simulateUpload = (file: File) => {
    setUploadedFile({
      name: file.name,
      size: file.size,
      status: "uploading",
      progress: 0,
    })

    // Simulate upload progress
    let progress = 0
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(uploadInterval)
        setUploadedFile((prev) =>
          prev ? { ...prev, status: "processing", progress: 100 } : null
        )

        // Simulate processing
        setTimeout(() => {
          setUploadedFile((prev) =>
            prev
              ? {
                  ...prev,
                  status: "success",
                  recordCount: Math.floor(Math.random() * 50) + 10,
                }
              : null
          )
        }, 2000)
      } else {
        setUploadedFile((prev) =>
          prev ? { ...prev, progress: Math.min(progress, 100) } : null
        )
      }
    }, 200)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    const csvFile = files.find(
      (f) => f.type === "text/csv" || f.name.endsWith(".csv")
    )
    if (csvFile) {
      simulateUpload(csvFile)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      simulateUpload(files[0])
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const resetUpload = () => {
    setUploadedFile(null)
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
              Import your property portfolio via CSV for automated compliance monitoring
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Upload Section */}
            <div className="liquid-glass-glow rounded-2xl p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Portfolio Ingestion
              </h2>

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
                  
                  <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all ${
                    isDragging ? "bg-primary/20 glow-accent-intense" : "bg-secondary"
                  }`}>
                    <Upload className={`h-8 w-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  
                  <p className="mb-2 text-foreground font-medium">
                    {isDragging ? "Drop your CSV file here" : "Drag & drop your CSV file"}
                  </p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    or click to browse
                  </p>
                  
                  <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-2">
                    <FileSpreadsheet className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      Supports .CSV files up to 10MB
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* File Card */}
                  <div className="rounded-xl border border-border bg-secondary/30 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          uploadedFile.status === "success"
                            ? "bg-green-500/20"
                            : uploadedFile.status === "error"
                            ? "bg-red-500/20"
                            : "bg-primary/20"
                        }`}>
                          {uploadedFile.status === "success" ? (
                            <CheckCircle className="h-6 w-6 text-green-400" />
                          ) : uploadedFile.status === "error" ? (
                            <AlertCircle className="h-6 w-6 text-red-400" />
                          ) : (
                            <FileSpreadsheet className="h-6 w-6 text-primary" />
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

                    {/* Progress */}
                    {(uploadedFile.status === "uploading" || uploadedFile.status === "processing") && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {uploadedFile.status === "uploading" ? "Uploading..." : "Processing..."}
                          </span>
                          <span className="text-foreground">{Math.round(uploadedFile.progress)}%</span>
                        </div>
                        <Progress value={uploadedFile.progress} className="h-2" />
                        {uploadedFile.status === "processing" && (
                          <div className="flex items-center gap-2 text-sm text-primary">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Validating records and checking STRO registry...
                          </div>
                        )}
                      </div>
                    )}

                    {/* Success State */}
                    {uploadedFile.status === "success" && (
                      <div className="mt-4 rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Upload Complete</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Successfully imported {uploadedFile.recordCount} properties
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {uploadedFile.status === "success" && (
                    <div className="flex gap-3">
                      <Button
                        onClick={resetUpload}
                        variant="outline"
                        className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
                      >
                        Upload Another
                      </Button>
                      <Button
                        className="flex-1 gap-2 glow-accent bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => window.location.href = "/dashboard"}
                      >
                        View Dashboard
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Format Guide */}
            <div className="liquid-glass rounded-2xl p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                CSV Format Guide
              </h2>
              
              <p className="mb-6 text-sm text-muted-foreground">
                Your CSV file should include the following columns. Required fields 
                are marked with an asterisk.
              </p>

              <div className="space-y-3">
                {sampleColumns.map((col) => (
                  <div
                    key={col.name}
                    className="flex items-start gap-3 rounded-lg border border-border bg-secondary/20 p-3"
                  >
                    <code className={`rounded px-2 py-1 text-sm ${
                      col.required 
                        ? "bg-primary/20 text-primary" 
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {col.name}{col.required && "*"}
                    </code>
                    <p className="flex-1 text-sm text-muted-foreground">
                      {col.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-border bg-secondary/20 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Sample Template</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Download our sample CSV template to ensure your data is formatted correctly.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-border text-foreground hover:bg-secondary bg-transparent"
                >
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
              </div>

              <div className="mt-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-yellow-400" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Important Note</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      All properties will be validated against the San Diego STRO registry. 
                      Invalid license IDs will be flagged for manual review.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
