-- Migration: Create settings table for storing knowledge base and other settings
-- Run this migration on Supabase

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default knowledge base from the file
INSERT INTO settings (key, value) VALUES ('knowledge_base', '# Knowledge Base - Toserba WS Pedak
## Untuk Integrasi LLM Customer Service

---

## INFORMASI TOKO

### Identitas
- **Nama Toko**: Toserba WS Pedak
- **Tagline**: Murah • Lengkap • Luas
- **Jenis Usaha**: Toko serba ada / Supermarket mini
- **Website**: https://wstoserba.my.id

### Kontak
- **WhatsApp**: +62 812-3960-2221
- **Telepon**: +62 812-3960-2221
- **Email**: nedhms@gmail.com

### Lokasi
- **Alamat**: Jalan Kaliurang No.KM.11, Pedak, Sinduharjo, Ngaglik, Sleman, Daerah Istimewa Yogyakarta 55581
- **Area Layanan**: Pedak dan sekitarnya (Ngaglik, Sleman, Yogyakarta)

### Jam Operasional
- **Buka Setiap Hari**: 08:00 - 21:30 WIB
- **Hari Libur Nasional**: Buka dengan jam terbatas

---

## KATEGORI PRODUK

Toserba WS Pedak menyediakan berbagai produk kebutuhan sehari-hari:
1. **Makanan & Minuman** - Sembako, snack, minuman kemasan
2. **Perawatan Tubuh** - Sabun, shampoo, skincare
3. **Kebutuhan Rumah Tangga** - Alat kebersihan, perlengkapan dapur
4. **Produk Bayi** - Susu, popok, perlengkapan bayi
5. **Obat & Kesehatan** - Obat bebas, vitamin, suplemen
6. **Frozen Food** - Makanan beku siap saji
7. **Elektronik Kecil** - Baterai, charger, aksesoris
8. **ATK** - Alat tulis dan perlengkapan kantor

---

## FAQ (Pertanyaan yang Sering Diajukan)

### Pemesanan
- **Q: Bagaimana cara memesan produk?**
  A: Pesan melalui website wstoserba.my.id, pilih produk, checkout via WhatsApp.

- **Q: Apakah bisa pesan via WhatsApp langsung?**
  A: Bisa! Hubungi +62 812-3960-2221.

- **Q: Berapa minimum pembelian untuk pengiriman?**
  A: Minimum Rp 50.000.

### Pengiriman
- **Q: Apakah ada ongkos kirim?**
  A: GRATIS ongkir untuk min Rp 50.000 di area Pedak.

- **Q: Berapa lama pengiriman?**
  A: Area Pedak 1-3 jam setelah konfirmasi pembayaran.

### Pembayaran
- Tunai (bayar di tempat)
- Transfer Bank
- QRIS

---

## KEUNGGULAN TOSERBA WS PEDAK

1. Harga Murah
2. Produk Lengkap
3. Pelayanan Ramah
4. Gratis Ongkir (min Rp 50.000)
5. Pengiriman Cepat
6. 100% Original
') ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy for reading (anyone can read)
CREATE POLICY "Anyone can read settings" ON settings
  FOR SELECT USING (true);

-- Policy for writing (only authenticated users can write)
CREATE POLICY "Authenticated users can update settings" ON settings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert settings" ON settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
