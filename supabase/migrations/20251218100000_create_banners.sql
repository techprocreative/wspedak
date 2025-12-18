-- Create banners table for promo carousel
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link_url TEXT,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Public read policy (everyone can view active banners)
CREATE POLICY "Banners are viewable by everyone"
    ON banners FOR SELECT
    USING (is_active = true);

-- Admin full access policy
CREATE POLICY "Admin can manage banners"
    ON banners FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Insert sample banners
INSERT INTO banners (title, image_url, link_url, is_active, order_index) VALUES
('Promo Akhir Tahun', 'https://placehold.co/1200x400/3b82f6/ffffff?text=Promo+Akhir+Tahun+2024', '/products', true, 1),
('Gratis Ongkir', 'https://placehold.co/1200x400/10b981/ffffff?text=Gratis+Ongkir+Area+Pedak', '/products', true, 2),
('Sembako Murah', 'https://placehold.co/1200x400/f59e0b/ffffff?text=Sembako+Harga+Terjangkau', '/products?category=Sembako', true, 3);
