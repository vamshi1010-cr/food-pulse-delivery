-- ============================================================
-- FoodPulse: Online Food Delivery System
-- Supabase PostgreSQL Schema + Seed Data
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- ─────────────────────────────────────────
-- 1. PROFILES  (extends auth.users)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('customer', 'merchant', 'driver')),
  name        TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  -- Merchant extras
  restaurant_name TEXT,
  fssai_license   TEXT,
  kitchen_address TEXT,
  -- Driver extras
  license_number  TEXT,
  vehicle_type    TEXT,
  vehicle_number  TEXT,
  driver_rating   NUMERIC(2,1) DEFAULT 4.5,
  -- Customer extras
  default_street  TEXT,
  default_area    TEXT,
  default_city    TEXT DEFAULT 'Hyderabad',
  default_zipcode TEXT DEFAULT '500033',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────
-- 2. RESTAURANTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.restaurants (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id      UUID REFERENCES public.profiles(id),
  name          TEXT NOT NULL,
  cuisine       TEXT[] DEFAULT '{}',
  description   TEXT,
  image_url     TEXT,
  rating        NUMERIC(2,1) DEFAULT 4.0,
  review_count  INTEGER DEFAULT 0,
  delivery_time TEXT DEFAULT '30-40 min',
  delivery_fee  NUMERIC(10,2) DEFAULT 35,
  min_order     NUMERIC(10,2) DEFAULT 100,
  is_open       BOOLEAN DEFAULT TRUE,
  is_pure_veg   BOOLEAN DEFAULT FALSE,
  address       TEXT,
  coords_lat    NUMERIC(10,7),
  coords_lng    NUMERIC(10,7),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 3. MENU ITEMS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.menu_items (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id  UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  description    TEXT,
  price          NUMERIC(10,2) NOT NULL,
  image_url      TEXT,
  category       TEXT DEFAULT 'Main Course',
  is_available   BOOLEAN DEFAULT TRUE,
  is_popular     BOOLEAN DEFAULT FALSE,
  is_veg         BOOLEAN DEFAULT FALSE,
  spice_level    TEXT DEFAULT 'medium' CHECK (spice_level IN ('mild','medium','hot','extra_hot')),
  tags           TEXT[] DEFAULT '{}',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 4. ORDERS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id           UUID REFERENCES public.profiles(id),
  restaurant_id         UUID REFERENCES public.restaurants(id),
  driver_id             UUID REFERENCES public.profiles(id),
  status                TEXT DEFAULT 'PLACED'
                        CHECK (status IN ('PLACED','CONFIRMED','PREPARING','READY','OUT_FOR_DELIVERY','DELIVERED','CANCELLED')),
  subtotal              NUMERIC(10,2) NOT NULL,
  delivery_fee          NUMERIC(10,2) DEFAULT 0,
  platform_fee          NUMERIC(10,2) DEFAULT 10,
  tax                   NUMERIC(10,2) DEFAULT 0,
  discount              NUMERIC(10,2) DEFAULT 0,
  total_amount          NUMERIC(10,2) NOT NULL,
  applied_coupon        TEXT,
  delivery_street       TEXT,
  delivery_area         TEXT,
  delivery_city         TEXT DEFAULT 'Hyderabad',
  delivery_zipcode      TEXT DEFAULT '500033',
  delivery_label        TEXT DEFAULT 'Home',
  payment_method        TEXT DEFAULT 'UPI',
  special_instructions  TEXT,
  estimated_delivery    TEXT DEFAULT '30 mins',
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 5. ORDER ITEMS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id             UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id         UUID REFERENCES public.menu_items(id),
  name                 TEXT NOT NULL,
  price                NUMERIC(10,2) NOT NULL,
  quantity             INTEGER NOT NULL DEFAULT 1,
  item_total           NUMERIC(10,2) NOT NULL,
  addons               TEXT[] DEFAULT '{}',
  special_instructions TEXT
);

-- ─────────────────────────────────────────
-- 6. REVIEWS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id   UUID REFERENCES public.profiles(id),
  restaurant_id UUID REFERENCES public.restaurants(id),
  order_id      UUID REFERENCES public.orders(id),
  rating        INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  reviewer_name TEXT DEFAULT 'Anonymous',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 7. DRIVER LOCATIONS (realtime tracking)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.driver_locations (
  driver_id  UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id   UUID REFERENCES public.orders(id),
  lat        NUMERIC(10,7),
  lng        NUMERIC(10,7),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 8. COUPONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupons (
  code         TEXT PRIMARY KEY,
  discount_pct INTEGER NOT NULL,
  max_discount NUMERIC(10,2) DEFAULT 200,
  min_order    NUMERIC(10,2) DEFAULT 0,
  is_active    BOOLEAN DEFAULT TRUE,
  expires_at   TIMESTAMPTZ
);

-- ─────────────────────────────────────────
-- 9. ROW LEVEL SECURITY
-- ─────────────────────────────────────────
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons          ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own profile
CREATE POLICY "Profiles: own read/write" ON public.profiles
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Profiles: anyone can read basic info (for driver/merchant lookup)
CREATE POLICY "Profiles: public read" ON public.profiles
  FOR SELECT USING (true);

-- Restaurants: anyone can read
CREATE POLICY "Restaurants: public read" ON public.restaurants
  FOR SELECT USING (true);

-- Restaurants: merchants can insert/update their own
CREATE POLICY "Restaurants: merchant write" ON public.restaurants
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Menu items: anyone can read
CREATE POLICY "Menu items: public read" ON public.menu_items
  FOR SELECT USING (true);

-- Menu items: restaurant owner can write
CREATE POLICY "Menu items: owner write" ON public.menu_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id AND r.owner_id = auth.uid()
    )
  );

-- Orders: customer can read/insert own orders
CREATE POLICY "Orders: customer own" ON public.orders
  FOR ALL USING (auth.uid() = customer_id) WITH CHECK (auth.uid() = customer_id);

-- Orders: merchant can read orders for their restaurant
CREATE POLICY "Orders: merchant read" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id AND r.owner_id = auth.uid()
    )
  );

-- Orders: merchant can update status of their restaurant's orders
CREATE POLICY "Orders: merchant update" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id AND r.owner_id = auth.uid()
    )
  );

-- Orders: driver can read/update their assigned orders
CREATE POLICY "Orders: driver" ON public.orders
  FOR ALL USING (auth.uid() = driver_id) WITH CHECK (auth.uid() = driver_id);

-- Orders: driver can read unassigned orders to accept
CREATE POLICY "Orders: driver see available" ON public.orders
  FOR SELECT USING (
    status = 'READY' AND driver_id IS NULL
  );

-- Order items: follow parent order access
CREATE POLICY "Order items: customer" ON public.order_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.customer_id = auth.uid())
  );
CREATE POLICY "Order items: merchant read" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.restaurants r ON r.id = o.restaurant_id
      WHERE o.id = order_id AND r.owner_id = auth.uid()
    )
  );
CREATE POLICY "Order items: driver read" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.driver_id = auth.uid())
  );

-- Reviews: public read, customer write own
CREATE POLICY "Reviews: public read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Reviews: customer write" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Driver locations: public read (for tracking), driver write own
CREATE POLICY "Driver loc: public read" ON public.driver_locations FOR SELECT USING (true);
CREATE POLICY "Driver loc: driver write" ON public.driver_locations
  FOR ALL USING (auth.uid() = driver_id) WITH CHECK (auth.uid() = driver_id);

-- Coupons: public read only
CREATE POLICY "Coupons: public read" ON public.coupons FOR SELECT USING (true);

-- ─────────────────────────────────────────
-- 10. REALTIME — enable for order tracking
-- ─────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.driver_locations;

-- ─────────────────────────────────────────
-- 11. SEED DATA — Restaurants & Menu Items
-- ─────────────────────────────────────────

-- Coupons
INSERT INTO public.coupons (code, discount_pct, max_discount, min_order) VALUES
  ('SE2026',    25, 100, 200),
  ('CBITFOOD',  20, 120, 150),
  ('NEWUSER50', 50, 200, 100)
ON CONFLICT (code) DO NOTHING;

-- Restaurants (no owner_id so they are platform-seeded)
INSERT INTO public.restaurants (id, name, cuisine, description, image_url, rating, review_count, delivery_time, delivery_fee, min_order, is_open, is_pure_veg, address, coords_lat, coords_lng) VALUES
(
  'a0000001-0000-0000-0000-000000000001',
  'Paradise Dum Biryani & Kebabs',
  ARRAY['Hyderabadi','North Indian','Mughlai'],
  'Authentic Hyderabadi dum biryani slow-cooked in sealed handi with saffron-infused basmati rice and succulent meat.',
  'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80',
  4.8, 2847, '25-35 min', 0, 150, true, false,
  'Near Cyber Towers, Hitec City, Hyderabad', 17.4483, 78.3808
),
(
  'a0000001-0000-0000-0000-000000000002',
  'Artisan Woodfired Pizza & Pasta',
  ARRAY['Italian','Continental','Pizza'],
  'Neapolitan-style woodfired pizzas with San Marzano tomato base, fresh mozzarella di bufala and house-made pasta.',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
  4.6, 1532, '30-40 min', 35, 200, true, false,
  'Road No 10, Banjara Hills, Hyderabad', 17.4350, 78.4010
),
(
  'a0000001-0000-0000-0000-000000000003',
  'GreenLeaf Vegan Kitchen',
  ARRAY['Vegan','Health','Plant-Based'],
  'Cold-pressed juices, macro bowls, and plant-based proteins. Everything on our menu is 100% vegan and gluten-free.',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
  4.5, 876, '20-30 min', 25, 120, true, true,
  'Film Nagar, Jubilee Hills, Hyderabad', 17.4100, 78.3975
),
(
  'a0000001-0000-0000-0000-000000000004',
  'Coastal Catch — Seafood House',
  ARRAY['Seafood','Coastal','Andhra'],
  'Fresh-catch seafood from the Vizag coast delivered daily. Try our signature Prawn Rava Fry and Royyala Vepudu.',
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80',
  4.7, 1243, '35-45 min', 40, 250, true, false,
  'Gachibowli Stadium Road, Hyderabad', 17.4401, 78.3489
)
ON CONFLICT (id) DO NOTHING;

-- Menu Items for Paradise Biryani
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_popular, is_veg, spice_level, tags) VALUES
('a0000001-0000-0000-0000-000000000001', 'Hyderabadi Dum Biryani', 'Slow-cooked basmati rice with tender mutton pieces in sealed handi with saffron & rose water', 380, 'Biryani', true, false, 'medium', ARRAY['Bestseller','Signature']),
('a0000001-0000-0000-0000-000000000001', 'Chicken Tikka Kebab', 'Tandoor-marinated chicken with mint chutney and sliced onions', 220, 'Kebabs', true, false, 'medium', ARRAY['Grilled']),
('a0000001-0000-0000-0000-000000000001', 'Vegetable Dum Biryani', 'Fragrant basmati with mixed vegetables, dry fruits and caramelized onions', 220, 'Biryani', false, true, 'mild', ARRAY['Veg']),
('a0000001-0000-0000-0000-000000000001', 'Mirchi Ka Salan', 'Traditional Hyderabadi green chilli curry in tamarind-peanut gravy', 120, 'Sides', false, true, 'hot', ARRAY['Traditional','Veg']),
('a0000001-0000-0000-0000-000000000001', 'Haleem', 'Slow-cooked wheat and mutton stew with ginger, lime and fried onions', 280, 'Specials', true, false, 'medium', ARRAY['Seasonal']),
('a0000001-0000-0000-0000-000000000001', 'Double Ka Meetha', 'Hyderabadi bread pudding with condensed milk, dry fruits and saffron', 130, 'Desserts', false, true, 'mild', ARRAY['Dessert']);

-- Menu Items for Pizza
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_popular, is_veg, spice_level, tags) VALUES
('a0000001-0000-0000-0000-000000000002', 'Margherita Woodfired', 'San Marzano tomato, fresh mozzarella di bufala, basil, extra virgin olive oil', 495, 'Pizza', true, true, 'mild', ARRAY['Vegetarian','Wood-fired']),
('a0000001-0000-0000-0000-000000000002', 'Pepperoni Arrabbiata', 'Spicy arrabbiata base, premium pepperoni, caramelized onions, Parmesan shavings', 595, 'Pizza', true, false, 'hot', ARRAY['Bestseller']),
('a0000001-0000-0000-0000-000000000002', 'Truffle Funghi', 'Black truffle cream base, mixed wild mushrooms, fresh thyme, Fontina cheese', 695, 'Pizza', false, true, 'mild', ARRAY['Premium','Vegetarian']),
('a0000001-0000-0000-0000-000000000002', 'Spaghetti Carbonara', 'House-made pasta, guanciale, egg yolk, Pecorino Romano, black pepper', 425, 'Pasta', false, false, 'mild', ARRAY['Italian']),
('a0000001-0000-0000-0000-000000000002', 'Tiramisu', 'Layers of espresso-soaked ladyfingers with mascarpone cream', 280, 'Desserts', false, true, 'mild', ARRAY['Dessert']);

-- Menu Items for Vegan Kitchen
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_popular, is_veg, spice_level, tags) VALUES
('a0000001-0000-0000-0000-000000000003', 'Protein Power Bowl', 'Quinoa, roasted chickpeas, avocado, edamame, brown rice, tahini drizzle', 380, 'Bowls', true, true, 'mild', ARRAY['High-Protein','Vegan','GF']),
('a0000001-0000-0000-0000-000000000003', 'Acai Smoothie Bowl', 'Frozen acai blend with banana, topped with granola, coconut flakes and berries', 320, 'Bowls', true, true, 'mild', ARRAY['Superfood','Vegan']),
('a0000001-0000-0000-0000-000000000003', 'Cold Press Green Juice', 'Spinach, cucumber, celery, ginger, lemon, apple', 180, 'Drinks', false, true, 'mild', ARRAY['Detox','Vegan']),
('a0000001-0000-0000-0000-000000000003', 'Mushroom Tacos', 'Spiced portobello mushroom in corn tortillas, mango salsa, cashew crema', 290, 'Mains', false, true, 'medium', ARRAY['Vegan','GF']),
('a0000001-0000-0000-0000-000000000003', 'Raw Cheesecake', 'Cashew-date base with mixed berry topping. No bake, no refined sugar', 260, 'Desserts', false, true, 'mild', ARRAY['Raw','Vegan','GF']);

-- Menu Items for Seafood
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_popular, is_veg, spice_level, tags) VALUES
('a0000001-0000-0000-0000-000000000004', 'Prawn Rava Fry', 'Tiger prawns coated in semolina, fried crisp with coastal spice blend', 480, 'Starters', true, false, 'hot', ARRAY['Bestseller','Coastal']),
('a0000001-0000-0000-0000-000000000004', 'Bangda Fish Curry', 'Mackerel slow-cooked in tangy coconut-tamarind gravy with kokum', 320, 'Curry', false, false, 'hot', ARRAY['Traditional']),
('a0000001-0000-0000-0000-000000000004', 'Crab Masala', 'Fresh mud crab in thick Andhra masala gravy with crushed pepper and curry leaves', 680, 'Mains', true, false, 'extra_hot', ARRAY['Premium','Spicy']),
('a0000001-0000-0000-0000-000000000004', 'Fish Biryani', 'Aromatic basmati rice layered with marinated kingfish and fried onions', 420, 'Biryani', true, false, 'medium', ARRAY['Coastal']),
('a0000001-0000-0000-0000-000000000004', 'Steamed Modak', 'Coastal sweet dumplings with jaggery-coconut filling', 180, 'Desserts', false, true, 'mild', ARRAY['Dessert']);

-- Sample reviews
INSERT INTO public.reviews (restaurant_id, rating, comment, reviewer_name) VALUES
('a0000001-0000-0000-0000-000000000001', 5, 'Best biryani in Hyderabad! The dum cooking makes all the difference.', 'Priya K.'),
('a0000001-0000-0000-0000-000000000001', 4, 'Authentic taste, generous portions. Delivery was quick too.', 'Ravi S.'),
('a0000001-0000-0000-0000-000000000002', 5, 'The woodfired crust is unreal. Pepperoni Arrabbiata is a must-try.', 'Anjali M.'),
('a0000001-0000-0000-0000-000000000003', 4, 'Love the Protein Power Bowl. Light, healthy and filling.', 'Kiran T.'),
('a0000001-0000-0000-0000-000000000004', 5, 'The Prawn Rava Fry is absolutely divine. Best seafood in HYD.', 'Sai P.');
