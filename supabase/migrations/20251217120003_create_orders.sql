/*
  # Create Orders and Order Items Tables
  
  ## Overview
  This migration creates the orders system for tracking customer orders.
  Orders are saved to database before redirecting to WhatsApp.
  
  ## Tables Created
  1. `orders` - Main orders table
     - `id` (uuid, primary key)
     - `customer_name` (text, required)
     - `customer_address` (text, required)
     - `customer_phone` (text, optional)
     - `total_amount` (numeric, required)
     - `status` (text, default 'pending')
     - `whatsapp_sent` (boolean, default false)
     - `created_at` (timestamptz)
  
  2. `order_items` - Line items for each order
     - `id` (uuid, primary key)
     - `order_id` (uuid, references orders)
     - `product_id` (uuid, references products, optional - product might be deleted)
     - `product_name` (text, required - stored for history)
     - `quantity` (integer, required)
     - `price` (numeric, required - price at time of order)
  
  ## Security
  - RLS enabled
  - Anyone can create orders (guest checkout)
  - Admins/staff can view and update orders
*/

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_address text NOT NULL,
  customer_phone text,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  whatsapp_sent boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Anyone can create orders (guest checkout)
CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Anyone can view their order by ID (for order confirmation page)
CREATE POLICY "Anyone can view orders"
  ON orders
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admins and staff can update orders
CREATE POLICY "Staff can update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Order items policies
CREATE POLICY "Anyone can create order items"
  ON order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view order items"
  ON order_items
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for faster queries
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for orders updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
