CREATE OR REPLACE FUNCTION public.grant_admin_for_allowlisted_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND lower(NEW.email) IN ('onwanku@gmail.com', 'victoriajeremiah@gmail.com', 'nachusim@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$;

-- Backfill: if nachusim@gmail.com already exists and is confirmed, grant admin now
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE lower(email) = 'nachusim@gmail.com'
  AND email_confirmed_at IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;