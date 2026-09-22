ALTER VIEW public.team_members_public SET (security_invoker = on);

GRANT SELECT (id, full_name, role, bio, photo_url, sort_order, active, created_at, updated_at)
  ON public.team_members TO anon, authenticated;