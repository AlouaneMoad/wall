import { supabase } from '@/lib/supabase'
import { Order, OrderItem, MenuItem } from '@/lib/types'

export class RealtimeService {
  private static instance: RealtimeService
  private channels: Map<string, any> = new Map()

  static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService()
    }
    return RealtimeService.instance
  }

  subscribeToOrders(
    restaurantId: string,
    callbacks: {
      onOrderChange?: (order: Order) => void
      onOrderItemChange?: (orderItem: OrderItem) => void
    }
  ) {
    const channelName = `orders-${restaurantId}`
    
    // Remove existing channel if it exists
    if (this.channels.has(channelName)) {
      supabase.removeChannel(this.channels.get(channelName))
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`
        },
        (payload) => {
          console.log('Order change:', payload)
          if (callbacks.onOrderChange && payload.new) {
            callbacks.onOrderChange(payload.new as Order)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_items'
        },
        (payload) => {
          console.log('Order item change:', payload)
          if (callbacks.onOrderItemChange && payload.new) {
            callbacks.onOrderItemChange(payload.new as OrderItem)
          }
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  subscribeToMenuItems(
    restaurantId: string,
    callbacks: {
      onMenuItemChange?: (menuItem: MenuItem) => void
    }
  ) {
    const channelName = `menu-items-${restaurantId}`
    
    // Remove existing channel if it exists
    if (this.channels.has(channelName)) {
      supabase.removeChannel(this.channels.get(channelName))
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_items',
          filter: `restaurant_id=eq.${restaurantId}`
        },
        (payload) => {
          console.log('Menu item change:', payload)
          if (callbacks.onMenuItemChange && payload.new) {
            callbacks.onMenuItemChange(payload.new as MenuItem)
          }
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  subscribeToCustomerOrders(
    customerId: string,
    callbacks: {
      onOrderChange?: (order: Order) => void
    }
  ) {
    const channelName = `customer-orders-${customerId}`
    
    // Remove existing channel if it exists
    if (this.channels.has(channelName)) {
      supabase.removeChannel(this.channels.get(channelName))
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `customer_id=eq.${customerId}`
        },
        (payload) => {
          console.log('Customer order change:', payload)
          if (callbacks.onOrderChange && payload.new) {
            callbacks.onOrderChange(payload.new as Order)
          }
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  unsubscribe(channelName: string) {
    if (this.channels.has(channelName)) {
      supabase.removeChannel(this.channels.get(channelName))
      this.channels.delete(channelName)
    }
  }

  unsubscribeAll() {
    this.channels.forEach((channel, name) => {
      supabase.removeChannel(channel)
    })
    this.channels.clear()
  }
}

export const realtimeService = RealtimeService.getInstance()