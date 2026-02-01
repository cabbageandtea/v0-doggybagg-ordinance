"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, LayoutDashboard, Upload, Settings, LogOut, Bell } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Upload Portfolio", href: "/upload", icon: Upload },
]

const supportEmail = "mailto:support@doggybagg.cc?subject=Support%20Request"

function getInitials(user: User | null): string {
  if (!user) return "?"
  const name = user.user_metadata?.full_name || user.user_metadata?.name
  if (name && typeof name === "string") {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    if (parts[0]) return parts[0].slice(0, 2).toUpperCase()
  }
  if (user.email) return user.email[0].toUpperCase()
  return "?"
}

export function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    void (async () => {
      const { data } = await createClient().auth.getUser()
      setUser(data.user)
    })()
  }, [])

  const handleSignOut = async () => {
    await createClient().auth.signOut()
    router.refresh()
    router.push("/")
  }

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Account"

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="liquid-glass mx-4 mt-4 rounded-2xl">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-background/50">
                <Image
                  src="/images/og-image.png"
                  alt="DoggyBagg"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground tracking-tight">
                  DoggyBagg
                </span>
                <span className="text-xs text-muted-foreground">
                  Dashboard
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button 
                      variant={isActive ? "secondary" : "ghost"} 
                      className={`gap-2 transition-all duration-200 ${isActive ? "bg-primary/20 text-primary border-glow" : "text-muted-foreground hover:text-foreground hover:scale-[1.02] hover:bg-primary/10 hover:ring-1 hover:ring-primary/30"}`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>

            {/* User Menu */}
            <div className="hidden items-center gap-2 md:flex">
              <Link href={supportEmail}>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Support
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm">
                        {getInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline truncate max-w-[120px]">{displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 liquid-glass border-border">
                  <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                    <Link href="/dashboard">
                      <Settings className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 md:hidden">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button 
                      variant={isActive ? "secondary" : "ghost"} 
                      className={`w-full justify-start gap-2 transition-all duration-200 active:scale-[0.98] ${isActive ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-primary/5"}`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
              <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-foreground truncate">{displayName}</span>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
