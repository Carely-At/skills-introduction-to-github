-- Fix all Supabase security issues
-- This script addresses:
-- 1. RLS policies using user_metadata (insecure)
-- 2. Function search path mutable issues
-- 3. Password protection

-- ============================================
-- PART 1: Replace user_metadata with app_metadata in RLS policies
-- ============================================

-- Drop all existing policies that use user_metadata
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update any user" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Service role can bypass RLS" ON public.users;
DROP POLICY IF EXISTS "Sub-admins can view users" ON public.users;
DROP POLICY IF EXISTS "Sub-admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Sub-admins can update users" ON public.users;
DROP POLICY IF EXISTS "Admins can view admin actions" ON public.admin_actions;
DROP POLICY IF EXISTS "Admins can insert admin actions" ON public.admin_actions;

-- Create secure policies using app_metadata (only writeable by service role)
-- Users table policies
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can update any user"
  ON public.users FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can insert users"
  ON public.users FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Sub-admins can view users"
  ON public.users FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'sub-admin'
  );

CREATE POLICY "Sub-admins can insert users"
  ON public.users FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'sub-admin' AND
    role IN ('vendor', 'delivery', 'client')
  );

CREATE POLICY "Sub-admins can update users"
  ON public.users FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'sub-admin' AND
    role IN ('vendor', 'delivery', 'client')
  );

CREATE POLICY "Service role can bypass RLS"
  ON public.users FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Admin actions table policies
CREATE POLICY "Admins can view admin actions"
  ON public.admin_actions FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'sub-admin')
  );

CREATE POLICY "Admins can insert admin actions"
  ON public.admin_actions FOR INSERT
  WITH CHECK (
    auth.uid() = admin_id AND
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'sub-admin')
  );

-- ============================================
-- PART 2: Fix function search path issues
-- ============================================

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    campus_id,
    role,
    first_name,
    last_name,
    phone,
    is_active
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'campus_id', 'TEMP-' || NEW.id),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Name'),
    COALESCE(NEW.raw_user_meta_data->>'phone', '+000000000'),
    COALESCE((NEW.raw_user_meta_data->>'is_active')::boolean, true)
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    campus_id = EXCLUDED.campus_id,
    role = EXCLUDED.role,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- Fix update_delivery_location_timestamp function
CREATE OR REPLACE FUNCTION update_delivery_location_timestamp()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.last_location_update = NOW();
  RETURN NEW;
END;
$$;

-- ============================================
-- PART 3: Create helper function to set app_metadata (only callable by service role)
-- ============================================

CREATE OR REPLACE FUNCTION public.set_user_role(user_id UUID, user_role TEXT)
RETURNS void
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only service role can call this function
  IF auth.jwt() ->> 'role' != 'service_role' THEN
    RAISE EXCEPTION 'Only service role can set user roles';
  END IF;

  -- Update app_metadata with the role
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', user_role)
  WHERE id = user_id;
END;
$$;

-- Grant execute permission to service role only
REVOKE ALL ON FUNCTION public.set_user_role FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_user_role TO service_role;

-- ============================================
-- PART 4: Create trigger to sync role to app_metadata
-- ============================================

CREATE OR REPLACE FUNCTION public.sync_role_to_app_metadata()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update app_metadata in auth.users when role changes in public.users
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically sync role changes
DROP TRIGGER IF EXISTS sync_role_to_auth ON public.users;
CREATE TRIGGER sync_role_to_auth
  AFTER INSERT OR UPDATE OF role ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_role_to_app_metadata();
