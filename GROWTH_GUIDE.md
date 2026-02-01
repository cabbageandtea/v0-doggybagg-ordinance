# Growth Guide — AIO, SEO, Ads & Support

How to position DoggyBagg, get found in search, run ads, and support customers.

---

## 1. AIO (All-In-One) Positioning

**What it means:** DoggyBagg is the single solution for San Diego property compliance — monitoring, alerts, risk scores, and fine estimation in one place.

**Where it's used:**
- Meta description: "All-in-one San Diego property compliance monitoring" (in JSON-LD)
- Landing copy: "Take it with you" tagline
- Value props: Portfolio analytics, violation tracking, STRO coverage

**To strengthen:**
- Add "All-in-one" to hero subhead if you want it more prominent
- Use in ad copy: "The all-in-one compliance tool for San Diego property owners"

---

## 2. SEO

### What's implemented

| Item | Status |
|------|--------|
| JSON-LD (Organization, WebSite, FAQPage) | ✅ `components/structured-data.tsx` |
| Meta title, description, OG images | ✅ `app/layout.tsx` |
| Sitemap | ✅ `app/sitemap.ts` |
| robots.txt | ✅ `app/robots.ts` |
| Learn content | ✅ `/learn/str-compliance-san-diego` |

### Next steps

1. **Google Search Console**  
   Add property, verify, submit sitemap: `https://doggybagg.cc/sitemap.xml`

2. **More /learn pages**  
   Add pages for: STRO registration steps, fine appeal process, common violations by type.

3. **Internal links**  
   Link from blog, pricing, and footer to `/learn/*` pages.

---

## 3. Ads (Google & Meta)

### Setup

1. **Google Ads**
   - Create a Google Ads account
   - Add the gtag to the site (already wired via `NEXT_PUBLIC_GOOGLE_ADS_ID`)
   - Create conversion actions: Sign Up, Purchase, Lead
   - Add these to Vercel:
     - `NEXT_PUBLIC_GOOGLE_ADS_ID` = your tag ID (e.g. `AW-123456789`)
     - `NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_CONVERSION` = `AW-XXX/ConversionLabel` (from conversion action)
     - `NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_CONVERSION` = `AW-XXX/PurchaseLabel`
     - `NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION` = `AW-XXX/LeadLabel`

2. **Meta Pixel**
   - Create a Pixel in Meta Events Manager
   - Add to Vercel: `NEXT_PUBLIC_META_PIXEL_ID` = your Pixel ID

### Events fired automatically

| Action | PostHog | Google Ads | Meta Pixel |
|--------|---------|------------|------------|
| Sign up | `signed_up` | CompleteRegistration | CompleteRegistration |
| Checkout completed | `checkout_completed` | Purchase (if conversion set) | Purchase |
| Portfolio audit lead | `portfolio_audit_lead` | Lead (if conversion set) | Lead |

---

## 4. Support

### Channels

| Channel | Use |
|---------|-----|
| **Help Center** | `/help` — Getting Started, Billing, Property Search, Common Issues |
| **Email** | support@doggybagg.cc |
| **Feedback** | Floating Feedback button (dashboard, footer) → mailto |

### Help page sections

- Getting Started
- Billing & Plans
- Property Search
- Common Issues
- Quick links (Docs, Privacy, Contact)
- Contact support block

### To improve

- Add live chat (Intercom, Crisp) when volume justifies it
- Build a simple support ticket flow if email becomes overwhelming
