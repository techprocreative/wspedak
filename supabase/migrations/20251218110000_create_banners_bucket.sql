-- Create banners storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Public can view banner images
CREATE POLICY "Public can view banner images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'banners' );

-- Policy: Admin can upload banner images
CREATE POLICY "Admin can upload banner images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'banners' AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND role = 'admin'
    )
);

-- Policy: Admin can update banner images
CREATE POLICY "Admin can update banner images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'banners' AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND role = 'admin'
    )
);

-- Policy: Admin can delete banner images
CREATE POLICY "Admin can delete banner images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'banners' AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND role = 'admin'
    )
);
