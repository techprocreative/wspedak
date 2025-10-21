/*
  # Create Products Table for Supermarket E-commerce

  ## Overview
  This migration creates the products table and storage bucket for the e-commerce application.

  ## Tables Created
  1. `products` - Stores all product information
     - `id` (uuid, primary key) - Unique identifier for each product
     - `created_at` (timestamptz) - Timestamp when product was created
     - `name` (text, not null) - Product name
     - `description` (text) - Product description
     - `price` (numeric, not null) - Product price
     - `image_url` (text) - URL to product image in storage
     - `stock` (integer, default 0) - Available stock quantity

  ## Security
  1. Enable Row Level Security (RLS) on products table
  2. Public SELECT policy - Anyone can view products
  3. Authenticated users policy - Only authenticated users can INSERT, UPDATE, DELETE

  ## Storage
  - Storage bucket `product_images` will be created separately via Supabase dashboard
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  stock integer DEFAULT 0
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);