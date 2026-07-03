
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "inquiries_anyone_insert" ON public.inquiries;
CREATE POLICY "inquiries_anyone_insert" ON public.inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(name) BETWEEN 1 AND 200 AND char_length(email) BETWEEN 3 AND 320 AND char_length(message) BETWEEN 1 AND 5000);

DROP POLICY IF EXISTS "bookings_anyone_insert" ON public.inspection_bookings;
CREATE POLICY "bookings_anyone_insert" ON public.inspection_bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(name) BETWEEN 1 AND 200 AND char_length(email) BETWEEN 3 AND 320 AND char_length(phone) BETWEEN 3 AND 40);
