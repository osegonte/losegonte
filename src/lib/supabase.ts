import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Category = {
  id: string
  name: string
  slug: string
  order: number
  icon: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type LeatherType = {
  id: string
  name: string
  finish: string | null
  price_adjustment: number
  description: string | null
  image_url: string | null
  is_active: boolean
  grain: string | null
  tanning: string | null
  created_at: string
  updated_at: string
}

export type Color = {
  id: string
  name: string
  hex: string
  finish: string | null
  is_active: boolean
  order: number | null
  created_at: string
  updated_at: string
}

export type Size = {
  id: string
  category_id: string | null
  system: string | null
  value: string
  order: number | null
  is_active: boolean
  created_at: string
}

export type Product = {
  id: string
  name: string
  slug: string
  category_id: string | null
  base_price: number
  description: string | null
  images: string[]
  is_customizable: boolean
  in_stock: boolean
  status: string
  created_at: string
  updated_at: string
}