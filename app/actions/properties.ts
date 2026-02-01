'use server'

import { createClient } from '@/lib/supabase/server'
import { sendEmailNotification } from '@/app/actions/notifications'

export interface Property {
  id: string
  address: string
  stro_tier: number
  license_id: string
  reporting_status: string
  risk_score: number
  last_checked?: string
  created_at: string
}

export async function getUserProperties(): Promise<{ properties: Property[] | null; error: string | null }> {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { properties: null, error: 'User not authenticated' }
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching properties:', error)
      return { properties: null, error: error.message }
    }

    return { properties: data || [], error: null }
  } catch (error) {
    console.error('[v0] Unexpected error fetching properties:', error)
    return { properties: null, error: 'An unexpected error occurred' }
  }
}

export async function getProperty(
  propertyId: string
): Promise<{ property: Property | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { property: null, error: 'User not authenticated' }

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('[v0] Error fetching property:', error)
      return { property: null, error: error.message }
    }
    return { property: data as Property | null, error: null }
  } catch (error) {
    console.error('[v0] Unexpected error fetching property:', error)
    return { property: null, error: 'An unexpected error occurred' }
  }
}

export interface AddPropertyInput {
  address: string
  stro_tier: number
  license_id: string
}

export interface UpdatePropertyInput {
  address?: string
  stro_tier?: number
  license_id?: string
  reporting_status?: string
}

function validatePropertyInput(data: AddPropertyInput): string | null {
  const address = (data.address || "").trim()
  const licenseId = (data.license_id || "").trim()
  if (!address || address.length > 500) return "Address is required and must be under 500 characters"
  if (!licenseId || licenseId.length > 100) return "License ID is required and must be under 100 characters"
  if (data.stro_tier < 1 || data.stro_tier > 4) return "STRO tier must be between 1 and 4"
  return null
}

export async function addProperty(propertyData: AddPropertyInput): Promise<{ success: boolean; error: string | null }> {
  const validationError = validatePropertyInput(propertyData)
  if (validationError) return { success: false, error: validationError }

  try {
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { error } = await supabase.from('properties').insert({
      user_id: user.id,
      address: propertyData.address.trim(),
      stro_tier: propertyData.stro_tier,
      license_id: propertyData.license_id.trim(),
      reporting_status: 'pending',
      risk_score: 0,
    })

    if (error) {
      console.error('[v0] Error adding property:', error)
      return { success: false, error: error.message }
    }

    // Sync onboarding milestone: has_added_property
    await supabase
      .from('user_onboarding')
      .upsert(
        {
          user_id: user.id,
          has_added_property: true,
          first_property_added_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    return { success: true, error: null }
  } catch (error) {
    console.error('[v0] Unexpected error adding property:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function addPropertiesBulk(
  properties: AddPropertyInput[]
): Promise<{ success: number; failed: number; errors: string[] }> {
  let success = 0
  const errors: string[] = []

  for (const prop of properties) {
    const result = await addProperty(prop)
    if (result.success) {
      success++
    } else {
      errors.push(`${prop.address}: ${result.error}`)
    }
  }

  return { success, failed: properties.length - success, errors }
}

export async function updateProperty(
  propertyId: string,
  updates: UpdatePropertyInput
): Promise<{ success: boolean; error: string | null }> {
  const trimmed: Record<string, unknown> = {}
  if (updates.address !== undefined) {
    const a = (updates.address || '').trim()
    if (!a || a.length > 500) return { success: false, error: 'Address is required and must be under 500 characters' }
    trimmed.address = a
  }
  if (updates.license_id !== undefined) {
    const l = (updates.license_id || '').trim()
    if (!l || l.length > 100) return { success: false, error: 'License ID is required and must be under 100 characters' }
    trimmed.license_id = l
  }
  if (updates.stro_tier !== undefined) {
    if (updates.stro_tier < 1 || updates.stro_tier > 4) return { success: false, error: 'STRO tier must be between 1 and 4' }
    trimmed.stro_tier = updates.stro_tier
  }
  if (updates.reporting_status !== undefined) {
    trimmed.reporting_status = updates.reporting_status
  }
  if (Object.keys(trimmed).length === 0) return { success: true, error: null }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'User not authenticated' }

    // If reporting_status is changing to violation, fetch current for notification trigger
    const isNewViolation = updates.reporting_status === 'violation'
    let address: string | undefined
    if (isNewViolation) {
      const { data: existing } = await supabase
        .from('properties')
        .select('address, reporting_status')
        .eq('id', propertyId)
        .eq('user_id', user.id)
        .single()
      if (existing?.reporting_status !== 'violation') {
        address = existing?.address
      } else {
        // Already violation, no new notification
      }
    }

    const { error } = await supabase
      .from('properties')
      .update(trimmed)
      .eq('id', propertyId)
      .eq('user_id', user.id)

    if (error) {
      console.error('[v0] Error updating property:', error)
      return { success: false, error: error.message }
    }

    if (isNewViolation && address) {
      void sendEmailNotification(user.id, { propertyAddress: address })
    }
    return { success: true, error: null }
  } catch (error) {
    console.error('[v0] Unexpected error updating property:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteProperty(propertyId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId)
      .eq('user_id', user.id)

    if (error) {
      console.error('[v0] Error deleting property:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('[v0] Unexpected error deleting property:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
