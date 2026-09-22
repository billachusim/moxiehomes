DROP VIEW IF EXISTS public.team_members_public;

CREATE VIEW public.team_members_public AS
  SELECT id, full_name, role, bio, photo_url, sort_order, active, created_at, updated_at
  FROM public.team_members
  WHERE active = true;

ALTER VIEW public.team_members_public SET (security_invoker = off);

GRANT SELECT ON public.team_members_public TO anon, authenticated;
GRANT ALL ON public.team_members_public TO service_role;