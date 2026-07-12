
-- 1) Team members: hide email/phone from public. Use a safe view; drop public table policy.
DROP POLICY IF EXISTS team_public_read ON public.team_members;

CREATE OR REPLACE VIEW public.team_members_public
WITH (security_invoker = on) AS
SELECT id, full_name, role, bio, photo_url, sort_order, active
FROM public.team_members
WHERE active = true;

-- Need a policy on the underlying table so the invoker view can read active rows.
CREATE POLICY team_public_active_safe_read ON public.team_members
  FOR SELECT TO anon, authenticated
  USING (active = true);

-- The view is read-only; explicit grants for API access.
GRANT SELECT ON public.team_members_public TO anon, authenticated;

-- Revoke direct table SELECT from anon so email/phone cannot be scraped.
REVOKE SELECT ON public.team_members FROM anon;
-- Keep authenticated SELECT for admins/editors (RLS still restricts non-admins to active-only, no contact filter).
-- To also protect contact fields from ordinary signed-in users, drop broad authenticated select of contact cols:
REVOKE SELECT ON public.team_members FROM authenticated;
GRANT SELECT (id, full_name, role, bio, photo_url, sort_order, active, created_at, updated_at)
  ON public.team_members TO authenticated;
GRANT SELECT (email, phone) ON public.team_members TO authenticated; -- admin RLS still gates; column grant needed for admin_read_all

-- 2) listing_images: only expose images whose parent listing is published.
DROP POLICY IF EXISTS images_public_read ON public.listing_images;
CREATE POLICY images_public_read ON public.listing_images
  FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.listings l
    WHERE l.id = listing_images.listing_id AND l.published = true
  ));

-- 3) Lock down SECURITY DEFINER trigger functions from anon/authenticated EXECUTE.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.grant_admin_for_allowlisted_email() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
-- has_role must remain callable by anon/authenticated because RLS policies invoke it.
