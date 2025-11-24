-- Create vendor_images table for storing multiple images
CREATE TABLE IF NOT EXISTS public.vendor_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL CHECK (image_type IN ('location', 'menu')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.vendor_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Vendors can view their own images
CREATE POLICY "Vendors can view own images"
  ON public.vendor_images FOR SELECT
  USING (auth.uid() = vendor_id);

-- Admin can view all images
CREATE POLICY "Admins can view all images"
  ON public.vendor_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Clients can view images of approved vendors
CREATE POLICY "Clients can view approved vendor images"
  ON public.vendor_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.vendor_profiles 
      WHERE user_id = vendor_id AND images_approved = TRUE
    )
  );

-- Vendors can insert their own images
CREATE POLICY "Vendors can insert own images"
  ON public.vendor_images FOR INSERT
  WITH CHECK (auth.uid() = vendor_id);

-- Vendors can delete their own images
CREATE POLICY "Vendors can delete own images"
  ON public.vendor_images FOR DELETE
  USING (auth.uid() = vendor_id);

-- Admin can delete any image
CREATE POLICY "Admins can delete any image"
  ON public.vendor_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create index for faster lookups
CREATE INDEX idx_vendor_images_vendor_id ON public.vendor_images(vendor_id);
CREATE INDEX idx_vendor_images_type ON public.vendor_images(image_type);
