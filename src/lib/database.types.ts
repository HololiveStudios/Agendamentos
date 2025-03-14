export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string
          business_id: string
          service_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string | null
          start_time: string
          end_time: string
          status: Database['public']['Enums']['appointment_status']
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          service_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          start_time: string
          end_time: string
          status?: Database['public']['Enums']['appointment_status']
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          service_id?: string | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          start_time?: string
          end_time?: string
          status?: Database['public']['Enums']['appointment_status']
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      business_profiles: {
        Row: {
          id: string
          owner_id: string
          slug: string
          business_name: string
          description: string | null
          timezone: string
          contact_email: string
          contact_phone: string | null
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          slug: string
          business_name: string
          description?: string | null
          timezone?: string
          contact_email: string
          contact_phone?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          slug?: string
          business_name?: string
          description?: string | null
          timezone?: string
          contact_email?: string
          contact_phone?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      schedules: {
        Row: {
          id: string
          business_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          business_id: string
          name: string
          description: string | null
          duration: number
          price: number
          image_url: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          description?: string | null
          duration: number
          price: number
          image_url?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          description?: string | null
          duration?: number
          price?: number
          image_url?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          business_id: string
          stripe_subscription_id: string | null
          tier: Database['public']['Enums']['subscription_tier']
          status: string
          current_period_start: string
          current_period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          stripe_subscription_id?: string | null
          tier: Database['public']['Enums']['subscription_tier']
          status: string
          current_period_start: string
          current_period_end: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          stripe_subscription_id?: string | null
          tier?: Database['public']['Enums']['subscription_tier']
          status?: string
          current_period_start?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Enums: {
      appointment_status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
      subscription_tier: 'silver' | 'gold' | 'platinum'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}