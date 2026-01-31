'use server'

import { createClient } from '@/lib/supabase/server'

export interface Property {
  id: string
  address: string
  stro_tier: number
  license_id: string
  reporting_status: string
  risk_score: number
  last_checked: string
  created_at?: string
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

export async function addProperty(propertyData: {
  address: string
  stro_tier: number
  license_id: string
}): Promise<{ success: boolean; error: string | null }> {
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
      address: propertyData.address,
      stro_tier: propertyData.stro_tier,
      license_id: propertyData.license_id,
      reporting_status: 'pending',
      risk_score: 0,
    })

    if (error) {
      console.error('[v0] Error adding property:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('[v0] Unexpected error adding property:', error)
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
