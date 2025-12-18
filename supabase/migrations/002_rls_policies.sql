-- Enable Row Level Security
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Restaurants policies
-- Anyone can read restaurant info
CREATE POLICY "Public read access to restaurants" ON restaurants
  FOR SELECT USING (true);

-- Only authenticated users can insert restaurants (will be restricted by profiles)
CREATE POLICY "Authenticated users can insert restaurants" ON restaurants
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Restaurant owners can update their restaurant
CREATE POLICY "Restaurant owners can update restaurants" ON restaurants
  FOR UPDATE USING (
    id IN (
      SELECT restaurant_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Tables policies
-- Anyone can read table info
CREATE POLICY "Public read access to tables" ON tables
  FOR SELECT USING (true);

-- Restaurant staff can manage tables
CREATE POLICY "Restaurant staff can manage tables" ON tables
  FOR ALL USING (
    restaurant_id IN (
      SELECT restaurant_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Menu categories policies
-- Anyone can read menu categories
CREATE POLICY "Public read access to menu categories" ON menu_categories
  FOR SELECT USING (true);

-- Restaurant staff can manage menu categories
CREATE POLICY "Restaurant staff can manage menu categories" ON menu_categories
  FOR ALL USING (
    restaurant_id IN (
      SELECT restaurant_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Menu items policies
-- Anyone can read available menu items
CREATE POLICY "Public read access to available menu items" ON menu_items
  FOR SELECT USING (is_available = true);

-- Restaurant staff can read all menu items for their restaurant
CREATE POLICY "Restaurant staff can read all menu items" ON menu_items
  FOR SELECT USING (
    restaurant_id IN (
      SELECT restaurant_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Restaurant staff can manage menu items
CREATE POLICY "Restaurant staff can manage menu items" ON menu_items
  FOR ALL USING (
    restaurant_id IN (
      SELECT restaurant_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Orders policies
-- Customers can only read their own orders
CREATE POLICY "Customers can read their own orders" ON orders
  FOR SELECT USING (customer_id = current_setting('app.current_customer_id', true));

-- Restaurant staff can read all orders for their restaurant
CREATE POLICY "Restaurant staff can read restaurant orders" ON orders
  FOR SELECT USING (
    restaurant_id IN (
      SELECT restaurant_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Customers can insert their own orders
CREATE POLICY "Customers can insert orders" ON orders
  FOR INSERT WITH CHECK (customer_id = current_setting('app.current_customer_id', true));

-- Restaurant staff can update order status
CREATE POLICY "Restaurant staff can update orders" ON orders
  FOR UPDATE USING (
    restaurant_id IN (
      SELECT restaurant_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Order items policies
-- Customers can read order items for their orders
CREATE POLICY "Customers can read their order items" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE customer_id = current_setting('app.current_customer_id', true)
    )
  );

-- Restaurant staff can read order items for their restaurant
CREATE POLICY "Restaurant staff can read restaurant order items" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE restaurant_id IN (
        SELECT restaurant_id FROM profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'staff')
      )
    )
  );

-- Customers can insert order items for their orders
CREATE POLICY "Customers can insert order items" ON order_items
  FOR INSERT WITH CHECK (
    order_id IN (
      SELECT id FROM orders 
      WHERE customer_id = current_setting('app.current_customer_id', true)
    )
  );

-- Order events policies
-- Customers can read events for their orders
CREATE POLICY "Customers can read their order events" ON order_events
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE customer_id = current_setting('app.current_customer_id', true)
    )
  );

-- Restaurant staff can read events for their restaurant
CREATE POLICY "Restaurant staff can read restaurant order events" ON order_events
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE restaurant_id IN (
        SELECT restaurant_id FROM profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'staff')
      )
    )
  );

-- Restaurant staff can insert order events
CREATE POLICY "Restaurant staff can insert order events" ON order_events
  FOR INSERT WITH CHECK (
    order_id IN (
      SELECT id FROM orders 
      WHERE restaurant_id IN (
        SELECT restaurant_id FROM profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'staff')
      )
    )
  );

-- Profiles policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Admins can read all profiles for their restaurant
CREATE POLICY "Admins can read restaurant profiles" ON profiles
  FOR SELECT USING (
    restaurant_id IN (
      SELECT restaurant_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update profiles for their restaurant
CREATE POLICY "Admins can update restaurant profiles" ON profiles
  FOR UPDATE USING (
    restaurant_id IN (
      SELECT restaurant_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );