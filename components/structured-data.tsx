/**
 * JSON-LD structured data for SEO (Organization, WebSite, FAQPage).
 * Rendered as script tag in document head.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://doggybagg.cc"

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DoggyBagg",
  url: siteUrl,
  logo: `${siteUrl}/images/og-image.png`,
  description:
    "Precision ordinance oversight for San Diego investors. Timely updates, portfolio analytics, resolution support.",
  sameAs: ["https://twitter.com/doggybagg_sd", "https://x.com/doggybagg_sd"],
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DoggyBagg",
  url: siteUrl,
  description:
    "High-end ordinance oversight for San Diego investors. Timely municipal intelligence, portfolio analytics, resolution support.",
  publisher: { "@id": `${siteUrl}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
}

export function StructuredData() {
  const orgWithId = { ...organizationSchema, "@id": `${siteUrl}/#organization` }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgWithId),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  )
}

const faqItems = [
  {
    question: "How does DoggyBagg deliver ordinance intelligence?",
    answer:
      "We continuously monitor San Diego municipal databases including Code Enforcement and STRO registries. Our system cross-references property addresses and sends timely updates.",
  },
  {
    question: "Which properties can I monitor?",
    answer:
      "Any residential or commercial property within San Diego County, including short-term rentals (STRs), multifamily units, and ADUs.",
  },
  {
    question: "How quickly will I receive updates?",
    answer:
      "Most filings are reflected within 24 hours. Critical activity triggers immediate notifications via email.",
  },
  {
    question: "What ordinance categories are tracked?",
    answer:
      "Trash/debris, unpermitted construction, noise ordinances, parking, STR compliance, occupancy, overgrown vegetation, and more.",
  },
  {
    question: "Can I cancel at any time?",
    answer:
      "Yes. Cancel anytime with no penalties. Your data remains accessible for 30 days after cancellation.",
  },
]

export function FAQStructuredData() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  )
}
