"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="liquid-glass mx-4 mt-4 rounded-2xl">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-background/50">
                <Image
                  src="/images/og-image.png"
                  alt="DoggyBagg"
                  fill
                  className="object-contain p-0.5"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground tracking-tight">
                  DoggyBagg
                </span>
                <span className="text-xs text-muted-foreground">
                  Take it with you
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-8 md:flex">
              <Link
                href="/#features"
                className="nav-link-hover pb-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </Link>
              <Link
                href="/#calculator"
                className="nav-link-hover pb-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Calculator
              </Link>
              <Link
                href="/#pricing"
                className="nav-link-hover pb-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Pricing
              </Link>
              <Link
                href="mailto:hello@doggybagg.cc?subject=General%20Inquiry"
                className="nav-link-hover pb-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden items-center gap-4 md:flex">
              <Link href="/auth/sign-in">
                <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="glow-accent bg-primary text-primary-foreground hover:bg-primary/90">
                  Start Free
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="p-2 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4 md:hidden">
              <Link
                href="/#features"
                className="min-h-[44px] flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#calculator"
                className="min-h-[44px] flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Calculator
              </Link>
              <Link
                href="/#pricing"
                className="min-h-[44px] flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="mailto:hello@doggybagg.cc?subject=General%20Inquiry"
                className="min-h-[44px] flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/auth/sign-in" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="h-11 w-full justify-start text-muted-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up" onClick={() => setIsMenuOpen(false)}>
                  <Button className="h-11 w-full glow-accent bg-primary text-primary-foreground">
                    Start Free
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
