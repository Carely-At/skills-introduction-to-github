-- Enable leaked password protection in Supabase Auth
-- This prevents users from using passwords that have been leaked in data breaches

-- Note: This requires Supabase CLI or Dashboard access to enable
-- The SQL command to enable it programmatically:

-- Update auth config (requires service_role key)
-- This is typically done through Supabase Dashboard > Authentication > Policies
-- Or through Supabase CLI:
-- supabase secrets set AUTH_PASSWORD_PWNED_ENABLE=true

-- Since we can't directly modify auth config through SQL,
-- we'll create a reminder table for manual configuration

CREATE TABLE IF NOT EXISTS public._security_config_reminders (
  id SERIAL PRIMARY KEY,
  reminder TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public._security_config_reminders (reminder, status)
VALUES (
  'Enable leaked password protection: Go to Supabase Dashboard > Authentication > Auth Policies > Enable "Leaked Password Protection"',
  'pending'
)
ON CONFLICT DO NOTHING;

-- Comment for documentation
COMMENT ON TABLE public._security_config_reminders IS 
  'Reminders for security configurations that must be set through Supabase Dashboard or CLI';
