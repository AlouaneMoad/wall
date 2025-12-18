export interface MenuItem {
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

export interface MenuCategory {
  id: string
  restaurant_id: string
  name: string
  sort_order: number
  created_at: string
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
}

export interface Order {
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

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  name_snapshot: string
  price_cents_snapshot: number
  quantity: number
  created_at: string
}

export interface Restaurant {
  id: string
  name: string
  created_at: string
}

export interface Table {
  id: string
  restaurant_id: string
  table_number: string
  qr_url: string
  created_at: string
}

export interface Profile {
  id: string
  restaurant_id: string
  role: 'admin' | 'staff'
  created_at: string
}