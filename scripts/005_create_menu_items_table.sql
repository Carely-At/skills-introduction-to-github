-- Create menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Everyone can view available menu items from approved vendors
CREATE POLICY "Anyone can view available menu items"
  ON public.menu_items FOR SELECT
  USING (
    is_available = TRUE AND
    EXISTS (
      SELECT 1 FROM public.vendor_profiles 
      WHERE user_id = vendor_id AND images_approved = TRUE
    )
  );

-- Vendors can view their own menu items
CREATE POLICY "Vendors can view own menu items"
  ON public.menu_items FOR SELECT
  USING (auth.uid() = vendor_id);

-- Vendors can insert their own menu items
CREATE POLICY "Vendors can insert own menu items"
  ON public.menu_items FOR INSERT
  WITH CHECK (auth.uid() = vendor_id);

-- Vendors can update their own menu items
CREATE POLICY "Vendors can update own menu items"
  ON public.menu_items FOR UPDATE
  USING (auth.uid() = vendor_id);

-- Vendors can delete their own menu items
CREATE POLICY "Vendors can delete own menu items"
  ON public.menu_items FOR DELETE
  USING (auth.uid() = vendor_id);

-- Create trigger for updated_at
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_menu_items_vendor_id ON public.menu_items(vendor_id);
CREATE INDEX idx_menu_items_category ON public.menu_items(category);
CREATE INDEX idx_menu_items_available ON public.menu_items(is_available);
