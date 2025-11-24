-- Create Supabase Storage bucket for menu images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow vendors to upload menu images
CREATE POLICY "Vendors can upload menu images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'menu-images' AND
    auth.uid()::text = (storage.foldername(name))[2]
  );

-- Create policy to allow vendors to update their menu images
CREATE POLICY "Vendors can update own menu images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'menu-images' AND
    auth.uid()::text = (storage.foldername(name))[2]
  );

-- Create policy to allow vendors to delete their menu images
CREATE POLICY "Vendors can delete own menu images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'menu-images' AND
    auth.uid()::text = (storage.foldername(name))[2]
  );

-- Create policy to allow public read access
CREATE POLICY "Public can view menu images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');
