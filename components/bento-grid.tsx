"use client"

import { 
  Bell, 
  FileSearch, 
  BarChart3, 
  Clock, 
  MapPin, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

const features = [
  {
    title: "Real-Time Violation Alerts",
    description: "Get instant notifications when a code violation is filed against any property in your portfolio.",
    icon: Bell,
    className: "md:col-span-2 md:row-span-1",
    highlight: true,
  },
  {
    title: "Historical Data Analysis",
    description: "Access complete violation history and identify patterns in municipal enforcement.",
    icon: FileSearch,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Portfolio Analytics",
    description: "Comprehensive dashboards showing risk scores and compliance status across all properties.",
    icon: BarChart3,
    className: "md:col-span-1 md:row-span-2",
  },
  {
    title: "Early Detection",
    description: "Catch violations within 24 hours of filing—before penalties escalate.",
    icon: Clock,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "San Diego Coverage",
    description: "Complete coverage of all San Diego County municipal zones and districts.",
    icon: MapPin,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Trend Forecasting",
    description: "AI-powered predictions for enforcement trends in specific neighborhoods.",
    icon: TrendingUp,
    className: "md:col-span-1 md:row-span-1",
  },
]

export function BentoGrid() {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Enterprise-Grade <span className="text-glow text-primary">Monitoring</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-pretty">
            Stay ahead of municipal code enforcement with AI-powered detection 
            and comprehensive portfolio management tools.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:auto-rows-[200px]">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                feature.highlight ? "liquid-glass-glow" : "liquid-glass"
              } ${feature.className}`}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              </div>
              
              <div className="relative z-10 flex h-full flex-col">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                  feature.highlight 
                    ? "bg-primary/20 text-primary glow-accent" 
                    : "bg-secondary text-foreground"
                }`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-muted-foreground flex-grow">
                  {feature.description}
                </p>

                {feature.highlight && (
                  <div className="mt-4 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 text-red-400">
                      <AlertTriangle className="h-3 w-3" />
                      <span>12 Active Alerts</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      <span>847 Resolved</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
