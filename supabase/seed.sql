-- Seed Script untuk Toserba WS Pedak
-- Jalankan di Supabase SQL Editor

-- =============================================
-- 1. SAMPLE PRODUCTS
-- =============================================

INSERT INTO products (name, description, price, stock, image_url) VALUES
  ('Beras Premium 5kg', 'Beras putih premium kualitas tinggi, pulen dan wangi.', 75, 50, NULL),
  ('Minyak Goreng 2L', 'Minyak goreng nabati berkualitas, jernih dan tidak cepat hitam.', 35, 100, NULL),
  ('Gula Pasir 1kg', 'Gula pasir putih kristal, manis sempurna.', 15, 80, NULL),
  ('Tepung Terigu 1kg', 'Tepung terigu serbaguna untuk berbagai kebutuhan.', 12, 60, NULL),
  ('Kopi Bubuk 200gr', 'Kopi bubuk asli pilihan, aroma kuat dan rasa nikmat.', 25, 40, NULL),
  ('Teh Celup isi 25', 'Teh celup praktis dengan rasa segar.', 8, 120, NULL),
  ('Susu UHT 1L', 'Susu segar UHT full cream, kaya nutrisi.', 18, 75, NULL),
  ('Mie Instan (5 pack)', 'Mie instan favorit, praktis dan lezat.', 15, 200, NULL),
  ('Sabun Mandi 100gr', 'Sabun mandi dengan wangi segar.', 5, 150, NULL),
  ('Shampo Sachet (12 pcs)', 'Shampo dalam kemasan sachet, praktis.', 12, 100, NULL),
  ('Deterjen Bubuk 1kg', 'Deterjen bubuk untuk mencuci bersih.', 22, 60, NULL),
  ('Telur Ayam 1 Tray', 'Telur ayam segar dari peternak lokal.', 45, 30, NULL);

-- =============================================
-- 2. ADMIN & STAFF ACCOUNTS
-- =============================================
-- LANGKAH:
-- 1. Buka Authentication > Users di Supabase Dashboard
-- 2. Klik "Add User" untuk membuat akun baru
-- 3. Setelah user dibuat, copy user ID nya
-- 4. Jalankan SQL di bawah dengan user ID yang sudah di-copy

-- Contoh: Ganti USER_ID_ADMIN dan USER_ID_STAFF dengan ID asli

-- Admin Account
-- Email: admin@wspedak.com (buat via dashboard)
-- INSERT INTO user_roles (user_id, role) VALUES ('USER_ID_ADMIN', 'admin');

-- Staff Account
-- Email: staff@wspedak.com (buat via dashboard)
-- INSERT INTO user_roles (user_id, role) VALUES ('USER_ID_STAFF', 'staff');

-- =============================================
-- QUICK REFERENCE:
-- =============================================
-- Untuk menambah role setelah user register:
-- 
-- SELECT id, email FROM auth.users;  -- Lihat daftar user dan ID-nya
-- 
-- INSERT INTO user_roles (user_id, role) 
-- VALUES ('paste-user-id-here', 'admin');
