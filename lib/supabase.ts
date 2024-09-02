import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.debug(`lib/supabase.ts: Creating Supabase client for ${supabaseUrl} with anon key ${supabaseAnonKey.slice(0, 15)}...`)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
