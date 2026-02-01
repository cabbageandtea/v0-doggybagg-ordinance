# Page Design Debate — DoggyBagg Landing

## Research Summary

**Current structure:** Header (fixed) → Trust Bar → Bento Hero → Why DoggyBagg → Calculator + Property Search → Neighborhood Watch → Testimonials → Pricing → FAQ → Footer. Sticky CTA (mobile), Feedback Trigger, Cookie Consent.

**Design system:** Dark theme, copper/amber primary, liquid-glass cards, bento grid, Framer Motion tilt/shine. Mesh gradient canvas (5 animated orbs).

---

## Debate Outcomes

### 1. Layout: Header Overlap
**Issue:** Fixed header overlaps Trust Bar on load. No spacer.
**Verdict:** Add `pt-[88px]` to main wrapper so content clears the header.
**Executed:** ✓

### 2. Trust Bar: "47 joined this week"
**Issue:** Hardcoded, unverifiable. Legal/credibility risk.
**Verdict:** Replace with "Join 12,000+ protected investors" — defensible, ties to existing stat.
**Executed:** ✓

### 3. Scarcity: "Limited spots this week"
**Issue:** No mechanism to enforce; feels manipulative.
**Verdict:** Remove until we can back it with real limits.
**Executed:** ✓

### 4. Brand Consistency: Ordinance.ai vs DoggyBagg
**Issue:** FAQ, testimonials, sign-in, footer, feedback, ADMT modal still say "Ordinance.ai".
**Verdict:** Primary brand is DoggyBagg. Update all user-facing copy.
**Executed:** ✓ (sign-in, footer, dashboard-footer, feedback, admt-modal, compliance-certificate, faq, testimonials, header test)

### 5. Hero Section (unused)
**Issue:** `hero-section.tsx` exists but is not imported. Dead code.
**Verdict:** Leave for now — may be useful for A/B tests or alternate layouts. No action.

### 6. Redundancy: Trust Bar vs Hero Stats
**Issue:** Stats appear in both. Trust Bar: $2.4M+, 24/7, 12K+. Hero: same three in mini-cards.
**Verdict:** Acceptable — Trust Bar is social proof strip; hero stats reinforce value. Different contexts.
**Executed:** No change.

### 7. Section Order
**Issue:** Could we improve conversion by reordering? (e.g. Pricing before Testimonials?)
**Verdict:** Current order (value → proof → tools → pricing) aligns with research. Value prop above fold is solid. No change.

### 8. Property Search (mock)
**Issue:** Returns fake results. Could mislead.
**Verdict:** Add subtle "Demo" or "Sample" label, or wire to real API. Deferred — out of scope for this pass.
**Executed:** No change.

---

## Summary

- Fixed layout overlap
- Removed unverifiable social proof and scarcity
- Unified brand to DoggyBagg across user-facing surfaces
- Left section order, hero density, and property search as-is for future iteration
