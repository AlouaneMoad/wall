import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, MenuItem } from '@/lib/types'

interface CartStore {
  items: CartItem[]
  addItem: (menuItem: MenuItem) => void
  removeItem: (menuItemId: string) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (menuItem: MenuItem) => {
        set((state) => {
          const existingItem = state.items.find(item => item.menuItem.id === menuItem.id)
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.menuItem.id === menuItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            }
          }
          
          return {
            items: [...state.items, { menuItem, quantity: 1 }]
          }
        })
      },
      
      removeItem: (menuItemId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.menuItem.id !== menuItemId)
        }))
      },
      
      updateQuantity: (menuItemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId)
          return
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.menuItem.id === menuItemId
              ? { ...item, quantity }
              : item
          )
        }))
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.menuItem.price_cents * item.quantity), 0)
      }
    }),
    {
      name: 'wallace-cart',
      partialize: (state) => ({ items: state.items })
    }
  )
)