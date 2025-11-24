-- Add location tracking columns to delivery_profiles table
ALTER TABLE public.delivery_profiles
ADD COLUMN IF NOT EXISTS current_latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS current_longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS last_location_update TIMESTAMPTZ;

-- Add location tracking columns to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS delivery_latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS delivery_longitude DECIMAL(11, 8);

-- Create index for location queries
CREATE INDEX IF NOT EXISTS idx_delivery_profiles_location 
ON public.delivery_profiles(current_latitude, current_longitude) 
WHERE is_available = TRUE;

-- Create function to update location timestamp
CREATE OR REPLACE FUNCTION update_delivery_location_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_location_update = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for location updates
DROP TRIGGER IF EXISTS trigger_update_location_timestamp ON public.delivery_profiles;
CREATE TRIGGER trigger_update_location_timestamp
  BEFORE UPDATE OF current_latitude, current_longitude
  ON public.delivery_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_delivery_location_timestamp();

-- Add RLS policy for delivery location viewing by admins
CREATE POLICY "Admins can view all delivery locations"
  ON public.delivery_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'sub-admin')
    )
  );
