"use client"

import { useEffect, useRef } from "react"

export function MeshGradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    const gradientColors = [
      { r: 205, g: 133, b: 63, a: 0.15 },   // Copper
      { r: 218, g: 165, b: 32, a: 0.1 },    // Golden
      { r: 184, g: 115, b: 51, a: 0.12 },   // Bronze
    ]

    class GradientOrb {
      x: number
      y: number
      radius: number
      color: typeof gradientColors[0]
      speedX: number
      speedY: number
      phase: number

      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.radius = Math.random() * 400 + 200
        this.color = gradientColors[Math.floor(Math.random() * gradientColors.length)]
        this.speedX = (Math.random() - 0.5) * 0.03
        this.speedY = (Math.random() - 0.5) * 0.03
        this.phase = Math.random() * Math.PI * 2
      }

      update(canvas: HTMLCanvasElement, time: number) {
        this.x += this.speedX + Math.sin(time * 0.0003 + this.phase) * 0.05
        this.y += this.speedY + Math.cos(time * 0.0003 + this.phase) * 0.05

        if (this.x < -this.radius) this.x = canvas.width + this.radius
        if (this.x > canvas.width + this.radius) this.x = -this.radius
        if (this.y < -this.radius) this.y = canvas.height + this.radius
        if (this.y > canvas.height + this.radius) this.y = -this.radius
      }

      draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius
        )
        gradient.addColorStop(
          0,
          `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`
        )
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      }
    }

    const orbs = Array.from({ length: 5 }, () => new GradientOrb(canvas))

    const animate = () => {
      time++
      ctx.fillStyle = "rgba(18, 18, 35, 1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (const orb of orbs) {
        orb.update(canvas, time)
        orb.draw(ctx)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ background: "oklch(0.12 0.01 250)" }}
      aria-hidden="true"
    />
  )
}
