-- Create delivery_profiles table for delivery personnel data
CREATE TABLE IF NOT EXISTS public.delivery_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  vehicle_type TEXT,
  is_available BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.delivery_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Delivery personnel can view their own profile
CREATE POLICY "Delivery can view own profile"
  ON public.delivery_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Admin can view all delivery profiles
CREATE POLICY "Admins can view all delivery profiles"
  ON public.delivery_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Delivery personnel can insert their own profile
CREATE POLICY "Delivery can insert own profile"
  ON public.delivery_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Delivery personnel can update their own profile
CREATE POLICY "Delivery can update own profile"
  ON public.delivery_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin can update any delivery profile
CREATE POLICY "Admins can update delivery profiles"
  ON public.delivery_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_delivery_profiles_updated_at
  BEFORE UPDATE ON public.delivery_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
