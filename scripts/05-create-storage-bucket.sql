-- Create Supabase Storage bucket for vendor images
INSERT INTO storage.buckets (id, name, public)
VALUES ('vendor-images', 'vendor-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for vendor images
CREATE POLICY "Vendors can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vendor-images' AND
  (storage.foldername(name))[1] = 'vendors' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

CREATE POLICY "Public can view vendor images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vendor-images');

CREATE POLICY "Vendors can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vendor-images' AND
  (storage.foldername(name))[1] = 'vendors' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

CREATE POLICY "Vendors can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'vendor-images' AND
  (storage.foldername(name))[1] = 'vendors' AND
  (storage.foldername(name))[2] = auth.uid()::text
);
