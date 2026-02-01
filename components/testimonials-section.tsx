"use client"

import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Michael Chen",
    role: "Real Estate Investor",
    company: "Pacific Properties",
    content:
      "DoggyBagg caught a $15,000 STR violation on one of my La Jolla properties within 12 hours of filing. That early detection saved me from escalating penalties. Worth every penny.",
    rating: 5,
  },
  {
    name: "Sarah Martinez",
    role: "Property Manager",
    company: "Coastal Management Group",
    content:
      "Managing 40+ properties across San Diego, I was drowning in compliance tracking. DoggyBagg automated everything and gives me peace of mind that nothing slips through the cracks.",
    rating: 5,
  },
  {
    name: "David Thompson",
    role: "Landlord",
    company: "North Park Rentals",
    content:
      "The portfolio analytics dashboard is incredible. I can see risk scores across all my properties at a glance and prioritize which ones need attention. Game changer for multi-property owners.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Trusted by San Diego <span className="text-glow text-primary">Property Owners</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-pretty">
            Join hundreds of investors protecting their portfolios from unexpected violations
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="liquid-glass rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <div className="relative mb-4">
                <Quote className="absolute -left-2 -top-2 h-8 w-8 text-primary/20" />
                <p className="relative text-muted-foreground pl-6">
                  {testimonial.content}
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                <p className="text-xs text-primary">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-6 py-3">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">
              <span className="font-bold text-foreground">4.9/5</span>
              <span className="text-muted-foreground"> from 200+ reviews</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
