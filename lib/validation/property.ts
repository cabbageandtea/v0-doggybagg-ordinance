import { z } from "zod"

export const addPropertyInputSchema = z.object({
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(500, "Address must be under 500 characters"),
  stro_tier: z.number().int().min(1).max(4),
  license_id: z
    .string()
    .trim()
    .min(1, "License ID is required")
    .max(100, "License ID must be under 100 characters"),
})

export type AddPropertyInput = z.infer<typeof addPropertyInputSchema>

export const csvRowSchema = z.object({
  address: z.string().trim().min(1),
  stro_tier: z.number().int().min(1).max(4),
  license_id: z.string().trim().min(1).max(100),
})
