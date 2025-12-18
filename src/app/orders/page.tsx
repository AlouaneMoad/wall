'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Order, OrderItem } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Clock, CheckCircle, ChefHat, Package } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-500' },
  received: { label: 'Received', icon: CheckCircle, color: 'bg-blue-500' },
  preparing: { label: 'Preparing', icon: ChefHat, color: 'bg-orange-500' },
  finished: { label: 'Finished', icon: Package, color: 'bg-green-500' }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
    
    // Set up real-time subscription
    const channel = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order change:', payload)
          fetchOrders() // Refetch orders when there's a change
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchOrders = async () => {
    try {
      // Generate customer ID (in a real app, this would come from auth/localStorage)
      const customerId = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Set the customer ID in the session context for RLS
      await supabase.rpc('set_config', { parameter: 'app.current_customer_id', value: customerId })
      
      // For demo purposes, we'll fetch all orders since we don't have proper auth yet
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (ordersError) throw ordersError
      
      if (ordersData) {
        setOrders(ordersData)
        
        // Fetch order items for these orders
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', ordersData.map(order => order.id))
        
        if (itemsError) throw itemsError
        setOrderItems(itemsData || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'received', 'preparing', 'finished']
    return steps.indexOf(status)
  }

  const getOrderItems = (orderId: string) => {
    return orderItems.filter(item => item.order_id === orderId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">My Orders</h1>
          </div>
        </div>
      </header>

      {/* Orders List */}
      <main className="px-4 py-4">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Place your first order to see it here
            </p>
            <Link href="/">
              <Button>Browse Menu</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon
              const statusInfo = statusConfig[order.status as keyof typeof statusConfig]
              const orderItemsList = getOrderItems(order.id)
              const currentStep = getStatusStep(order.status)
              
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Table {order.table_number} • {formatDate(order.created_at)}
                        </p>
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Status Timeline */}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        {Object.entries(statusConfig).map(([status, config], index) => {
                          const Icon = config.icon
                          const isActive = index <= currentStep
                          
                          return (
                            <div key={status} className="flex flex-col items-center flex-1">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isActive ? statusInfo.color : 'bg-muted'
                                }`}
                              >
                                <Icon className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-xs mt-1 text-center">{config.label}</span>
                            </div>
                          )
                        })}
                      </div>
                      <div className="absolute top-4 left-8 right-8 h-0.5 bg-muted -z-10" />
                      <div 
                        className={`absolute top-4 left-8 h-0.5 -z-10 transition-all duration-500 ${statusInfo.color}`}
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                      />
                    </div>
                    
                    <Separator />
                    
                    {/* Order Items */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Items</h4>
                      {orderItemsList.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                            <span>{item.name_snapshot}</span>
                          </div>
                          <span className="font-medium">
                            ${formatPrice(item.price_cents_snapshot * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    {/* Total */}
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total</span>
                      <span className="text-lg font-bold">
                        ${formatPrice(order.total_cents)}
                      </span>
                    </div>
                    
                    {order.comment && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-1">Order Notes</h4>
                          <p className="text-sm text-muted-foreground">{order.comment}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}