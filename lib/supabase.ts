import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  email: string
  display_name: string
  created_at: string
}

export type Message = {
  id: string
  user_id: string
  content: string
  created_at: string
  profiles?: {
    email: string
    display_name: string
  }
}

export type BlockchainBlock = {
  index: number
  timestamp: string
  messageHash: string
  previousHash: string
  message: string
}
