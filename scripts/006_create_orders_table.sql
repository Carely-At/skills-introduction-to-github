-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  delivery_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled')),
  delivery_address TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Clients can view their own orders
CREATE POLICY "Clients can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = client_id);

-- Vendors can view orders for their restaurant
CREATE POLICY "Vendors can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = vendor_id);

-- Delivery personnel can view their assigned orders
CREATE POLICY "Delivery can view assigned orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = delivery_id);

-- Admin can view all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Clients can insert their own orders
CREATE POLICY "Clients can insert own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- Vendors can update orders for their restaurant
CREATE POLICY "Vendors can update own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = vendor_id);

-- Delivery personnel can update their assigned orders
CREATE POLICY "Delivery can update assigned orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = delivery_id);

-- Create trigger for updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_orders_client_id ON public.orders(client_id);
CREATE INDEX idx_orders_vendor_id ON public.orders(vendor_id);
CREATE INDEX idx_orders_delivery_id ON public.orders(delivery_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
