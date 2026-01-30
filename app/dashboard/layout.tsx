"use client"

import React from "react"

import { MeshGradientBackground } from "@/components/mesh-gradient-background"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardFooter } from "@/components/dashboard-footer"
import { ADMTModal } from "@/components/admt-modal"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <MeshGradientBackground />
      <DashboardHeader />
      <main className="min-h-screen pt-24 pb-8">
        {children}
      </main>
      <DashboardFooter />
      <ADMTModal />
    </>
  )
}
