#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
  process.exit(1)
}

const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function main() {
  try {
    const fpath = path.resolve(__dirname, '.test_user.json')
    if (!fs.existsSync(fpath)) {
      console.log('.test_user.json not found; skipping delete')
      return
    }
    const { id, email } = JSON.parse(fs.readFileSync(fpath, 'utf8'))
    if (!id) {
      console.log('No id in .test_user.json; skipping')
      return
    }

    console.log('Deleting test user', email, id)
    if (typeof supabase.auth.admin.deleteUser === 'function') {
      await supabase.auth.admin.deleteUser(id)
      console.log('Deleted user')
      fs.unlinkSync(fpath)
      return
    }

    // Fallback: attempt to list users and delete by id using REST as last resort
    console.warn('admin.deleteUser not available; ensure you clean up test users manually')
  } catch (err) {
    console.error('Error deleting test user:', err.message || err)
    process.exit(1)
  }
}

main()
