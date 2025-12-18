-- Insert sample restaurant
INSERT INTO restaurants (name) VALUES ('Wallace Restaurant');

-- Insert sample tables
INSERT INTO tables (restaurant_id, table_number, qr_url) VALUES 
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), '1', 'https://wallace.app/order?t=1'),
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), '2', 'https://wallace.app/order?t=2'),
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), '3', 'https://wallace.app/order?t=3'),
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), '4', 'https://wallace.app/order?t=4'),
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), '5', 'https://wallace.app/order?t=5');

-- Insert sample menu categories
INSERT INTO menu_categories (restaurant_id, name, sort_order) VALUES 
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), 'Appetizers', 1),
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), 'Main Courses', 2),
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), 'Desserts', 3),
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), 'Beverages', 4);

-- Insert sample menu items
INSERT INTO menu_items (restaurant_id, category_id, name, description, price_cents, image_url, is_available) VALUES 
-- Appetizers
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), 
   (SELECT id FROM menu_categories WHERE name = 'Appetizers' AND restaurant_id = (SELECT id FROM restaurants WHERE name = 'Wallace Restaurant')),
   'Garlic Bread', 'Freshly baked bread with garlic butter and herbs', 699, '/images/garlic-bread.jpg', true),
   
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), 
   (SELECT id FROM menu_categories WHERE name = 'Appetizers' AND restaurant_id = (SELECT id FROM restaurants WHERE name = 'Wallace Restaurant')),
   'Caesar Salad', 'Crisp romaine lettuce with parmesan cheese and croutons', 899, '/images/caesar-salad.jpg', true),

-- Main Courses
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), 
   (SELECT id FROM menu_categories WHERE name = 'Main Courses' AND restaurant_id = (SELECT id FROM restaurants WHERE name = 'Wallace Restaurant')),
   'Grilled Salmon', 'Fresh Atlantic salmon with lemon butter sauce', 1899, '/images/grilled-salmon.jpg', true),
   
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), 
   (SELECT id FROM menu_categories WHERE name = 'Main Courses' AND restaurant_id = (SELECT id FROM restaurants WHERE name = 'Wallace Restaurant')),
   'Ribeye Steak', '12oz ribeye with mashed potatoes and vegetables', 2499, '/images/ribeye-steak.jpg', true),
   
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), 
   (SELECT id FROM menu_categories WHERE name = 'Main Courses' AND restaurant_id = (SELECT id FROM restaurants WHERE name = 'Wallace Restaurant')),
   'Margherita Pizza', 'Fresh mozzarella, tomatoes, and basil on thin crust', 1499, '/images/margherita-pizza.jpg', true),

-- Desserts
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), 
   (SELECT id FROM menu_categories WHERE name = 'Desserts' AND restaurant_id = (SELECT id FROM restaurants WHERE name = 'Wallace Restaurant')),
   'Chocolate Cake', 'Rich chocolate layer cake with ganache', 799, '/images/chocolate-cake.jpg', true),
   
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), 
   (SELECT id FROM menu_categories WHERE name = 'Desserts' AND restaurant_id = (SELECT id FROM restaurants WHERE name = 'Wallace Restaurant')),
   'Tiramisu', 'Classic Italian coffee-flavored dessert', 899, '/images/tiramisu.jpg', true),

-- Beverages
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), 
   (SELECT id FROM menu_categories WHERE name = 'Beverages' AND restaurant_id = (SELECT id FROM restaurants WHERE name = 'Wallace Restaurant')),
   'Coffee', 'Freshly brewed coffee', 299, '/images/coffee.jpg', true),
   
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), 
   (SELECT id FROM menu_categories WHERE name = 'Beverages' AND restaurant_id = (SELECT id FROM restaurants WHERE name = 'Wallace Restaurant')),
   'Fresh Orange Juice', 'Freshly squeezed orange juice', 399, '/images/orange-juice.jpg', true),
   
  ((SELECT id FROM restaurants WHERE name = 'Wallace Restaurant'), 
   (SELECT id FROM menu_categories WHERE name = 'Beverages' AND restaurant_id = (SELECT id FROM restaurants WHERE name = 'Wallace Restaurant')),
   'Soft Drink', 'Coca-Cola, Sprite, or Fanta', 249, '/images/soft-drink.jpg', true);