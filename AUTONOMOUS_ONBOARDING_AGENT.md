# Autonomous Onboarding Agent - Technical Documentation

## Overview
The Autonomous Onboarding Agent is an intelligent, server-side guided tour system that automatically detects first-time users and guides them through key setup actions with a "Ghost Cursor" visual experience.

## Architecture

### Server-Side Intelligence (`/app/actions/agentic.ts`)
All onboarding logic, tier detection, and health check algorithms remain 100% server-side to protect proprietary IP.

**Key Functions:**
1. `getOnboardingStatus()` - Detects user tier and returns appropriate next steps
2. `updateOnboardingProgress()` - Tracks completion of guided steps
3. `generateFirstHealthCheck()` - PROPRIETARY multi-factor compliance analysis

### Client Components

**Ghost Cursor** (`/components/onboarding/ghost-cursor.tsx`)
- Animated cursor with sparkle effects
- Smooth scrolling to target elements
- Pulsing highlight animations
- Contextual message tooltips
- Backdrop overlay for focus

**Onboarding Agent** (`/components/onboarding/onboarding-agent.tsx`)
- Progress tracking card (bottom-right corner)
- Step-by-step checklist
- Tier-based customization
- Setup completion celebration modal
- First Compliance Health Check report

**Phone Verification** (`/components/onboarding/phone-verification.tsx`)
- SMS verification flow
- 6-digit code input
- Onboarding progress integration

## Guided Tour Flow

### Step 1: Add First Property
**Target:** `[data-onboarding="add-property-btn"]`
**Message:** "Click here to add your first property"
**Action:** User clicks button → navigates to upload page
**Completion:** Property successfully added to database

### Step 2: Verify Phone Number
**Target:** `[data-onboarding="verify-phone-btn"]`
**Message:** "Verify your phone for SMS alerts"
**Action:** User enters phone + verification code
**Completion:** `phone_verified` flag set to true

### Step 3: View Risk Assessment
**Free Tier:** `[data-onboarding="neighborhood-watch"]`
- Directs to Neighborhood Watch heat map
- Message: "Explore neighborhood enforcement data"

**Professional Tier:** `[data-onboarding="risk-score"]`
- Directs to Risk Prediction card
- Message: "View your risk prediction"

**Completion:** `viewed_risk_score` flag set to true

## Tier-Based Intelligence

The agent automatically adapts based on user subscription tier:

```typescript
// Free Tier (Community Alert)
- Guide to Neighborhood Watch map
- Emphasize community features
- Single property focus

// Starter/Professional Tier
- Guide to Risk Score analytics
- Suggest bulk upload
- Highlight API integration

// Enterprise Tier
- Advanced compliance features
- Institutional certificate generation
- Multi-portfolio management
```

## Setup Complete Milestone

Upon completing all 3 steps, the agent:

1. **Triggers Health Check Generation**
   - Analyzes all user properties
   - Calculates overall compliance score (0-100)
   - Determines portfolio health rating
   - Assesses neighborhood risk level
   - Generates prioritized recommendations

2. **Displays Celebration Modal**
   - Full-screen overlay
   - Shield icon animation
   - Health Check results visualization
   - Action recommendations
   - CTA to dashboard

3. **Stores Report in Database**
   - `compliance_health_checks` table
   - Timestamped for historical tracking
   - Used for trend analysis

## Health Check Algorithm (PROPRIETARY)

The First Compliance Health Check uses a multi-factor analysis:

```typescript
// Overall Score Calculation
let score = 100
score -= activeViolations * 15          // -15 per violation
score -= min(20, (totalFines/1000) * 5) // Fine impact
score -= neighborhoodRiskPenalty        // Area risk factor

// Portfolio Health Rating
score >= 85 → "Excellent"
score >= 70 → "Good"
score >= 50 → "Fair"
score < 50  → "At Risk"

// Neighborhood Risk Analysis
violations > 10 → "High"
violations > 5  → "Medium"
violations <= 5 → "Low"
```

**Recommendation Engine:**
- High priority: Active violations requiring immediate action
- Medium priority: Elevated enforcement in area
- Low priority: Portfolio expansion opportunities

## Database Schema

### `user_onboarding` Table
```sql
- user_id (uuid, FK to auth.users)
- phone_verified (boolean)
- viewed_risk_score (boolean)
- last_step_completed (text)
- completed_at (timestamp)
```

### `compliance_health_checks` Table
```sql
- id (uuid, PK)
- user_id (uuid, FK)
- overall_score (integer)
- properties_count (integer)
- active_violations (integer)
- neighborhood_risk (text: Low/Medium/High)
- report_data (jsonb)
- created_at (timestamp)
```

### `onboarding_actions` Table
```sql
- id (uuid, PK)
- user_id (uuid, FK)
- action_type (text: add_property, verify_phone, view_risk)
- action_data (jsonb)
- created_at (timestamp)
```

## Visual Design

### Ghost Cursor Animation
- Primary color cursor icon (8x8)
- Rotating sparkle effect (4x4)
- Pulsing ring animation (scale 1 → 2.5)
- Smooth position transitions (0.5s duration)
- Tooltip with arrow indicator

### Highlight Effect
```css
.onboarding-highlight {
  box-shadow: 
    0 0 0 4px rgba(primary, 0.5),
    0 0 32px 8px rgba(primary, 0.3);
  animation: highlight-pulse 2s infinite;
}
```

### Progress Card
- Fixed position: bottom-right (bottom-6 right-6)
- Max width: 384px (sm breakpoint)
- Glass morphism background
- Real-time progress bar
- Step checklist with icons

## Implementation Checklist

✅ Server-side onboarding logic in `agentic.ts`
✅ Ghost cursor component with animations
✅ Onboarding agent wrapper component
✅ Phone verification dialog
✅ Database schema migrations
✅ Dashboard integration with data attributes
✅ Tier-based route customization
✅ Health check celebration modal
✅ Mobile-responsive design

## Security Considerations

**Protected Server-Side:**
- All scoring algorithms
- Tier detection logic
- Health check calculations
- Recommendation engine
- Analytics tracking

**Client-Side Only:**
- UI animations
- Progress tracking display
- Ghost cursor positioning
- Modal interactions

## Usage

The Onboarding Agent automatically activates when:
1. User logs in for the first time
2. `isComplete` flag is false in `user_onboarding`
3. User has not completed all 3 steps

To manually trigger:
```typescript
const status = await getOnboardingStatus()
if (!status.status?.isComplete) {
  // Show onboarding agent
}
```

To complete a step programmatically:
```typescript
await updateOnboardingProgress('add_property')
await updateOnboardingProgress('verify_phone')
await updateOnboardingProgress('view_risk')
```

## Analytics & Insights

Track onboarding effectiveness:
- Time to complete each step
- Drop-off points
- Tier-based completion rates
- Health check score distribution

Query example:
```sql
SELECT 
  user_tier,
  AVG(EXTRACT(EPOCH FROM (completed_at - created_at))) as avg_time,
  COUNT(*) as completions
FROM user_onboarding
WHERE completed_at IS NOT NULL
GROUP BY user_tier;
```

## Future Enhancements

1. **Contextual Hints**
   - Tooltip hints on hover
   - Progressive disclosure of features

2. **Gamification**
   - Achievement badges
   - Completion rewards
   - Leaderboard for compliance scores

3. **A/B Testing**
   - Test different tour sequences
   - Optimize conversion rates

4. **Voice Guidance**
   - Optional audio narration
   - Accessibility improvements

5. **Video Walkthroughs**
   - Embedded tutorial videos
   - Screen recording for support

## Conclusion

The Autonomous Onboarding Agent provides an intelligent, tier-aware guided experience that maximizes user activation while keeping all proprietary logic secure on the server. The ghost cursor and celebration modal create a delightful first-time user experience that drives engagement and compliance monitoring adoption.
