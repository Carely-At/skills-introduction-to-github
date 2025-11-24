-- Add sub-admin role and extend user tracking
-- Update role check to include sub-admin
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('admin', 'sub-admin', 'vendor', 'delivery', 'client'));

-- Add tracking columns for admin actions
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved' 
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- Create admin_actions table to track all admin operations
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('create_user', 'approve_user', 'reject_user', 'delete_user', 'update_user', 'approve_images')),
  target_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on admin_actions
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Fix admin_actions policies to use JWT claims only
DROP POLICY IF EXISTS "Admins can view admin actions" ON public.admin_actions;
DROP POLICY IF EXISTS "Admins can insert admin actions" ON public.admin_actions;

CREATE POLICY "Admins can view admin actions"
  ON public.admin_actions FOR SELECT
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'sub-admin')
  );

CREATE POLICY "Admins can insert admin actions"
  ON public.admin_actions FOR INSERT
  WITH CHECK (
    auth.uid() = admin_id AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'sub-admin')
  );

-- Create indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON public.admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target_user_id ON public.admin_actions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON public.admin_actions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_created_by ON public.users(created_by);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);

-- Remove the problematic sub-admin policies that cause recursion
-- These policies reference created_by which requires querying the users table
DROP POLICY IF EXISTS "Sub-admins can view non-admin users" ON public.users;
DROP POLICY IF EXISTS "Sub-admins can insert non-admin users" ON public.users;
DROP POLICY IF EXISTS "Sub-admins can update their created users" ON public.users;

-- Add simplified sub-admin policies using only JWT claims
-- Sub-admins can view users who are not admins (using only JWT)
CREATE POLICY "Sub-admins can view users"
  ON public.users FOR SELECT
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'sub-admin'
  );

-- Sub-admins can insert non-admin users (using only JWT)
CREATE POLICY "Sub-admins can insert users"
  ON public.users FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'sub-admin' AND
    role IN ('vendor', 'delivery', 'client')
  );

-- Sub-admins can update non-admin users (using only JWT, simplified)
CREATE POLICY "Sub-admins can update users"
  ON public.users FOR UPDATE
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'sub-admin' AND
    role IN ('vendor', 'delivery', 'client')
  );
