-- Add profile_photo column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS profile_photo TEXT;

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for profile photos
-- Allow authenticated users to upload their own profile photo
CREATE POLICY "Users can upload own profile photo"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own profile photo
CREATE POLICY "Users can update own profile photo"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own profile photo
CREATE POLICY "Users can delete own profile photo"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public to view profile photos
CREATE POLICY "Anyone can view profile photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Add comment to explain the column
COMMENT ON COLUMN public.users.profile_photo IS 'URL to the user profile photo stored in Supabase Storage';
