'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MenuItem, MenuCategory, Restaurant } from '@/lib/types'
import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Plus, Minus, ShoppingCart, Clock, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function OrderPage() {
  const searchParams = useSearchParams()
  const tableNumber = searchParams.get('t')
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  const { items, addItem, removeItem, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCartStore()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // For now, fetch all categories and items without restaurant filtering
      // This will help us debug the RLS issues
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .order('sort_order')
      
      if (categoriesError) {
        console.error('Categories error:', categoriesError)
      }
      
      if (categoriesData) {
        setCategories(categoriesData)
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].id)
        }
      }
      
      // Fetch menu items
      const { data: menuItemsData, error: menuItemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('name')
      
      if (menuItemsError) {
        console.error('Menu items error:', menuItemsError)
      }
      
      if (menuItemsData) {
        setMenuItems(menuItemsData)
      }
      
      // Set a default restaurant name
      setRestaurant({ name: 'Wallace Restaurant', id: 'default', created_at: new Date().toISOString() })
      
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category_id === selectedCategory)
    : menuItems

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2)
  }

  const handleCheckout = async () => {
    if (!tableNumber || items.length === 0) return
    
    try {
      // Generate customer ID (in a real app, this would come from auth)
      const customerId = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Set the customer ID in the session context for RLS
      await supabase.rpc('set_config', { parameter: 'app.current_customer_id', value: customerId })
      
      const subtotal = getTotalPrice()
      const total = subtotal // Add tax, delivery, etc. if needed
      
      // Get the first restaurant ID from the database
      const { data: restaurantData } = await supabase
        .from('restaurants')
        .select('id')
        .limit(1)
        .single()
      
      const restaurantId = restaurantData?.id || 'default'
      
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          restaurant_id: restaurantId,
          table_number: tableNumber,
          customer_id: customerId,
          status: 'pending',
          subtotal_cents: subtotal,
          total_cents: total,
          order_number: Math.floor(Math.random() * 90000) + 10000
        })
        .select()
        .single()
      
      if (orderError) throw orderError
      
      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        menu_item_id: item.menuItem.id,
        name_snapshot: item.menuItem.name,
        price_cents_snapshot: item.menuItem.price_cents,
        quantity: item.quantity
      }))
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
      
      if (itemsError) throw itemsError
      
      // Clear cart and show success
      clearCart()
      setIsCartOpen(false)
      alert(`Order placed! Order #${orderData.order_number}`)
      
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">{restaurant?.name || 'Wallace'}</h1>
              {tableNumber && (
                <Badge variant="secondary" className="mt-1">
                  Table {tableNumber}
                </Badge>
              )}
            </div>
            <Link href="/orders">
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                My Orders
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Category Selector */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="px-4 py-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap flex-shrink-0"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <main className="px-4 py-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items available in this category</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative">
                  <Image
                    src={item.image_url || '/placeholder-food.jpg'}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
                    <span className="text-lg font-bold text-primary">
                      ${formatPrice(item.price_cents)}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <Button
                    onClick={() => addItem(item)}
                    className="w-full"
                    size="lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Cart Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="px-4 py-3 safe-area-inset-bottom">
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button 
                className="w-full h-14 text-lg font-semibold"
                disabled={items.length === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {items.length > 0 ? (
                  <>
                    {getTotalItems()} items • ${formatPrice(getTotalPrice())}
                  </>
                ) : (
                  'Your cart is empty'
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] max-h-[600px]">
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
              </SheetHeader>
              <div className="mt-6 overflow-y-auto max-h-[50vh]">
                {items.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.menuItem.id} className="flex items-center gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.menuItem.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            ${formatPrice(item.menuItem.price_cents)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {items.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-bold">${formatPrice(getTotalPrice())}</span>
                  </div>
                  <Button 
                    onClick={handleCheckout}
                    className="w-full h-14 text-lg font-semibold"
                    disabled={!tableNumber}
                  >
                    {tableNumber ? 'Place Order' : 'Select a table first'}
                  </Button>
                  {!tableNumber && (
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      Scan a QR code at your table to place an order
                    </p>
                  )}
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}