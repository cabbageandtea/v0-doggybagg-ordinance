import { z } from "zod"

/** Stripe metadata is string-only; coerce numbers where needed */
export const checkoutSessionMetadataSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().optional(),
  subscriptionTier: z.string().optional(),
  subscription_tier: z.string().optional(),
  searchCredits: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined)),
  search_credits: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined)),
}).passthrough()

export type CheckoutSessionMetadata = z.infer<typeof checkoutSessionMetadataSchema>

function getMetadata(md: Record<string, string> | null | undefined, key: string): string | undefined {
  if (!md) return undefined
  const lower = key.toLowerCase()
  const entry = Object.entries(md).find(([k]) => k.toLowerCase().replace(/_/g, "") === lower.replace(/_/g, ""))
  return entry?.[1]
}

/** Parse metadata with case-insensitive key mapping (Stripe may lowercase keys) */
export function parseCheckoutMetadata(
  md: Record<string, string> | null | undefined
): { success: true; data: CheckoutSessionMetadata } | { success: false; error: z.ZodError } {
  if (!md || typeof md !== "object") {
    return {
      success: false,
      error: new z.ZodError([{
        code: "custom",
        path: [],
        message: "Metadata is null or empty",
      }]),
    }
  }

  const mapped: Record<string, string> = {}
  const userId = getMetadata(md, "userId")
  if (userId) mapped.userId = userId
  const productId = getMetadata(md, "productId")
  if (productId) mapped.productId = productId
  const subTier = getMetadata(md, "subscription_tier") ?? getMetadata(md, "subscriptionTier")
  if (subTier) mapped.subscriptionTier = subTier
  const credits = getMetadata(md, "searchCredits") ?? getMetadata(md, "search_credits")
  if (credits) mapped.searchCredits = credits

  return checkoutSessionMetadataSchema.safeParse(mapped)
}
