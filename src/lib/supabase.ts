import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

export type Database = {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      tables: {
        Row: {
          id: string
          restaurant_id: string
          table_number: string
          qr_url: string
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          table_number: string
          qr_url?: string
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          table_number?: string
          qr_url?: string
          created_at?: string
        }
      }
      menu_categories: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          sort_order: number
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          sort_order?: number
          created_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          restaurant_id: string
          category_id: string
          name: string
          description: string
          price_cents: number
          image_url: string
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          category_id: string
          name: string
          description: string
          price_cents: number
          image_url?: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          category_id?: string
          name?: string
          description?: string
          price_cents?: number
          image_url?: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          restaurant_id: string
          table_number: string
          customer_id: string
          status: 'pending' | 'received' | 'preparing' | 'finished'
          comment: string
          subtotal_cents: number
          total_cents: number
          order_number: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          table_number: string
          customer_id: string
          status?: 'pending' | 'received' | 'preparing' | 'finished'
          comment?: string
          subtotal_cents: number
          total_cents: number
          order_number?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          table_number?: string
          customer_id?: string
          status?: 'pending' | 'received' | 'preparing' | 'finished'
          comment?: string
          subtotal_cents?: number
          total_cents?: number
          order_number?: number
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string
          name_snapshot: string
          price_cents_snapshot: number
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id: string
          name_snapshot: string
          price_cents_snapshot: number
          quantity: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          menu_item_id?: string
          name_snapshot?: string
          price_cents_snapshot?: number
          quantity?: number
          created_at?: string
        }
      }
      order_events: {
        Row: {
          id: string
          order_id: string
          status: 'pending' | 'received' | 'preparing' | 'finished'
          by_user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          status: 'pending' | 'received' | 'preparing' | 'finished'
          by_user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          status?: 'pending' | 'received' | 'preparing' | 'finished'
          by_user_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          restaurant_id: string
          role: 'admin' | 'staff'
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          role: 'admin' | 'staff'
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          role?: 'admin' | 'staff'
          created_at?: string
        }
      }
    }
  }
}