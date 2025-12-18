'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Order, OrderItem, MenuItem } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Clock, 
  CheckCircle, 
  ChefHat, 
  Package, 
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-500', nextStatus: 'received' },
  received: { label: 'Received', icon: CheckCircle, color: 'bg-blue-500', nextStatus: 'preparing' },
  preparing: { label: 'Preparing', icon: ChefHat, color: 'bg-orange-500', nextStatus: 'finished' },
  finished: { label: 'Finished', icon: Package, color: 'bg-green-500', nextStatus: null }
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0
  })

  useEffect(() => {
    fetchDashboardData()
    
    // Set up real-time subscription for orders
    const channel = supabase
      .channel('admin-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Admin: Order change:', payload)
          fetchDashboardData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      
      if (ordersError) throw ordersError
      
      if (ordersData) {
        setOrders(ordersData)
        
        // Fetch order items
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', ordersData.map(order => order.id))
        
        if (itemsError) throw itemsError
        setOrderItems(itemsData || [])
        
        // Calculate stats
        const today = new Date().toISOString().split('T')[0]
        const todayOrders = ordersData.filter(order => 
          order.created_at.startsWith(today)
        )
        const activeOrders = ordersData.filter(order => 
          ['pending', 'received', 'preparing'].includes(order.status)
        )
        
        setStats({
          totalOrders: ordersData.length,
          activeOrders: activeOrders.length,
          todayRevenue: todayOrders.reduce((sum, order) => sum + order.total_cents, 0),
          pendingOrders: ordersData.filter(order => order.status === 'pending').length
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
      
      if (error) throw error
      
      // Create order event
      await supabase
        .from('order_events')
        .insert({
          order_id: orderId,
          status: newStatus,
          by_user_id: 'admin' // In real app, this would be the actual user ID
        })
      
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    }
  }

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getOrderItems = (orderId: string) => {
    return orderItems.filter(item => item.order_id === orderId)
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const then = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - then.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div className="flex gap-2">
              <Link href="/admin/menu">
                <Button variant="outline" size="sm">Menu</Button>
              </Link>
              <Link href="/admin/qr">
                <Button variant="outline" size="sm">QR Codes</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                  <p className="text-2xl font-bold">{stats.activeOrders}</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today Revenue</p>
                  <p className="text-2xl font-bold">${formatPrice(stats.todayRevenue)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active Orders</h2>
            <Badge variant="secondary">{stats.activeOrders} orders</Badge>
          </div>
          
          {orders.filter(order => ['pending', 'received', 'preparing'].includes(order.status)).length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No active orders</h3>
                <p className="text-muted-foreground">All orders are completed</p>
              </CardContent>
            </Card>
          ) : (
            orders
              .filter(order => ['pending', 'received', 'preparing'].includes(order.status))
              .map((order) => {
                const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon
                const statusInfo = statusConfig[order.status as keyof typeof statusConfig]
                const orderItemsList = getOrderItems(order.id)
                
                return (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Table {order.table_number} • {formatTimeAgo(order.created_at)}
                          </p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`flex items-center gap-1 ${statusInfo.color} text-white`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-2">
                        {orderItemsList.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">x{item.quantity}</span>
                              <span>{item.name_snapshot}</span>
                            </div>
                            <span className="font-medium">
                              ${formatPrice(item.price_cents_snapshot * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total</span>
                        <span className="text-lg font-bold">
                          ${formatPrice(order.total_cents)}
                        </span>
                      </div>
                      
                      {/* Status Update Buttons */}
                      {statusInfo.nextStatus && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => updateOrderStatus(order.id, statusInfo.nextStatus!)}
                            className="flex-1"
                            size="lg"
                          >
                            Mark as {statusConfig[statusInfo.nextStatus as keyof typeof statusConfig].label}
                            <ArrowUpRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
          )}
        </div>
      </div>
    </div>
  )
}