/**
 * Supabase database types for alosha-web.
 *
 * Wired into @nuxtjs/supabase via `supabase.types` in nuxt.config.ts, which
 * makes `serverSupabaseServiceRole(event)` / `useSupabaseClient()` return a
 * typed `SupabaseClient<Database>` instead of the `unknown` default (where
 * every table infers to `never` and inserts fail typecheck).
 *
 * Shape mirrors the output of `supabase gen types typescript`. Keep in sync
 * with supabase/migrations/*. Currently only `public.contact_messages` is
 * modelled — it's the sole table the app touches through the Supabase client
 * (the PixSqueeze `Customer`/`ApiKey` tables are Prisma-managed and reached
 * only via the Railway API, never this client — see migration 0002).
 */
export type Json
  = | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
  public: {
    Tables: {
      contact_messages: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          topic: string | null
          product: string | null
          message: string
          user_agent: string | null
          ip: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          topic?: string | null
          product?: string | null
          message: string
          user_agent?: string | null
          ip?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          topic?: string | null
          product?: string | null
          message?: string
          user_agent?: string | null
          ip?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
