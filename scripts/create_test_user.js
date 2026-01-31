#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const TEST_EMAIL = process.env.PW_TEST_EMAIL
const TEST_PASSWORD = process.env.PW_TEST_PASSWORD

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
  process.exit(1)
}
if (!TEST_EMAIL || !TEST_PASSWORD) {
  console.error('PW_TEST_EMAIL and PW_TEST_PASSWORD must be set')
  process.exit(1)
}

const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function main() {
  try {
    // Try to create user
    console.log(`Creating test user ${TEST_EMAIL} ...`)
    const res = await supabase.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
    })

    if (res.error) {
      console.warn('Create user returned error:', res.error.message)
      // Try to find existing user via admin.listUsers if available
      if (typeof supabase.auth.admin.listUsers === 'function') {
        const list = await supabase.auth.admin.listUsers()
        const existing = list.data?.users?.find(u => u.email === TEST_EMAIL) || list.data?.find?.(u => u.email === TEST_EMAIL)
        if (existing) {
          const id = existing.id
          fs.writeFileSync(path.resolve(__dirname, '.test_user.json'), JSON.stringify({ id, email: TEST_EMAIL }))
          console.log('Found existing user via admin.listUsers, wrote .test_user.json')
          return
        }
      }

      // Fallback: query the `users` table directly using the service role key
      try {
        const { data, error } = await supabase.from('users').select('id,email').eq('email', TEST_EMAIL).limit(1)
        if (error) console.warn('Fallback query to users table returned error:', error.message)
        const row = (data && data[0])
        if (row && row.id) {
          fs.writeFileSync(path.resolve(__dirname, '.test_user.json'), JSON.stringify({ id: row.id, email: TEST_EMAIL }))
          console.log('Found existing user via users table, wrote .test_user.json')
          return
        }
      } catch (e) {
        console.warn('Error querying users table as fallback:', e.message || e)
      }

      throw new Error('Failed to create or find test user')
    }

    const user = res.user || res.data || res
    const id = user.id || (user.user && user.user.id)
    fs.writeFileSync(path.resolve(__dirname, '.test_user.json'), JSON.stringify({ id, email: TEST_EMAIL }))
    console.log('Test user created, id:', id)
  } catch (err) {
    console.error('Error creating test user:', err.message || err)
    process.exit(1)
  }
}

main()
