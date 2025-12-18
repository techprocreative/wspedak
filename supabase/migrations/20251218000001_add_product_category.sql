-- Add category field to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Lainnya';

-- Update existing products with default category if null
UPDATE products SET category = 'Lainnya' WHERE category IS NULL;
