-- Create vendor_profiles table for vendor-specific data
CREATE TABLE IF NOT EXISTS public.vendor_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  description TEXT,
  canteen_image TEXT,
  images_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Vendors can view their own profile
CREATE POLICY "Vendors can view own profile"
  ON public.vendor_profiles FOR SELECT
  USING (
    auth.uid() = user_id
  );

-- Admin can view all vendor profiles
CREATE POLICY "Admins can view all vendor profiles"
  ON public.vendor_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Clients can view approved vendor profiles
CREATE POLICY "Clients can view approved vendors"
  ON public.vendor_profiles FOR SELECT
  USING (images_approved = TRUE);

-- Vendors can insert their own profile
CREATE POLICY "Vendors can insert own profile"
  ON public.vendor_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Vendors can update their own profile
CREATE POLICY "Vendors can update own profile"
  ON public.vendor_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin can update any vendor profile
CREATE POLICY "Admins can update vendor profiles"
  ON public.vendor_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_vendor_profiles_updated_at
  BEFORE UPDATE ON public.vendor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
