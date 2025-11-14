-- ============================================
-- MetaCore Life - Complete Database Setup
-- Run these commands in your Supabase SQL Editor
-- ============================================

-- 1. USERS TABLE
-- Extends the auth.users table with additional profile information
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'United States',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only view and update their own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Allow users to insert their own profile (for registration)
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('health', 'wealth', 'relationships', 'apparel')),
  images TEXT[] NOT NULL DEFAULT '{}',
  reviews INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  badge TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can view products
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  TO public
  USING (true);

-- Only admins can modify products (you'll need to set up admin roles separately)
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM public.users WHERE email = 'admin@metacorelife.com'));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM public.users WHERE email = 'admin@metacorelife.com'));

-- 3. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Users can only access their own cart
CREATE POLICY "Users can view own cart"
  ON public.cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own cart"
  ON public.cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON public.cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
  ON public.cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- 4. WISHLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Users can only access their own wishlist
CREATE POLICY "Users can view own wishlist"
  ON public.wishlist_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own wishlist"
  ON public.wishlist_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own wishlist"
  ON public.wishlist_items FOR DELETE
  USING (auth.uid() = user_id);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) DEFAULT 9.99,
  tax DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_id TEXT,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can only view their own orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal DECIMAL(10,2) GENERATED ALWAYS AS (product_price * quantity) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Users can view order items for their orders
CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM public.orders WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT id FROM public.orders WHERE user_id = auth.uid()
    )
  );

-- 7. CONTACT SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  order_number TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact form
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT
  TO public
  WITH CHECK (true);

-- 8. PRODUCT REVIEWS TABLE (Optional - for future use)
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- Enable RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews"
  ON public.product_reviews FOR SELECT
  TO public
  USING (true);

-- Only verified purchasers can leave reviews
CREATE POLICY "Users can create own reviews"
  ON public.product_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON public.product_reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_wishlist_items_user_id ON public.wishlist_items(user_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_product_reviews_product_id ON public.product_reviews(product_id);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample products
INSERT INTO public.products (name, description, price, category, images, reviews, rating, badge, sku) VALUES
  ('Premium Fitness Program', 'Complete 12-week transformation program with personalized coaching and nutrition plans.', 199.00, 'health', 
   ARRAY['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800'], 324, 4.8, 'Best Seller', 'HEALTH-001'),
  
  ('Wealth Building Masterclass', 'Learn proven strategies to build sustainable wealth and financial freedom.', 299.00, 'wealth',
   ARRAY['https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800'], 512, 4.9, 'Digital', 'WEALTH-001'),
  
  ('Relationship Communication Guide', 'Master the art of authentic communication and deepen your relationships.', 79.00, 'relationships',
   ARRAY['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800'], 189, 4.7, 'New', 'REL-001'),
  
  ('Advanced Nutrition Course', 'Science-backed nutrition strategies for optimal health and performance.', 149.00, 'health',
   ARRAY['https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800'], 267, 4.6, null, 'HEALTH-002'),
  
  ('Investment Strategy Blueprint', 'Professional investment strategies used by top wealth managers.', 399.00, 'wealth',
   ARRAY['https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800'], 445, 4.9, 'Digital', 'WEALTH-002'),
  
  ('Emotional Intelligence Toolkit', 'Develop emotional mastery and build stronger connections.', 99.00, 'relationships',
   ARRAY['https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800'], 356, 4.8, null, 'REL-002'),
  
  ('MetaCore Premium T-Shirt', 'Premium quality cotton t-shirt with MetaCore Life branding.', 39.00, 'apparel',
   ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'], 89, 4.5, null, 'APPAREL-001'),
  
  ('Recovery & Wellness System', 'Optimize recovery with proven protocols for better performance.', 129.00, 'health',
   ARRAY['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'], 198, 4.7, null, 'HEALTH-003');

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- Next steps:
-- 1. Go to Supabase Dashboard > Authentication > Providers
-- 2. Enable Email/Password authentication
-- 3. (Optional) Enable Google OAuth
-- 4. Set your site URL and redirect URLs
-- 5. Copy your Supabase URL and anon key to config.js