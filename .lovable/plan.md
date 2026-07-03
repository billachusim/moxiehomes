
# Moxie Homes & Properties — Website Plan

A luxury real estate site (navy / gold / white) with public marketing pages, a listings catalog, an admin dashboard, and client accounts.

## Public site

- **Home** — hero with tagline ("Utmost trust and credibility in real estate investment"), featured listings, brief about, core values, CTA.
- **About** — vision, mission, core values (Trust, Integrity, Excellence, Accountability, Professionalism).
- **Listings** — grid of properties with location filter (Abuja/Asaba/etc.), search, cover image, price/location badges.
- **Listing detail** — cover image, gallery, description, embedded YouTube tour (when provided), location, amenities, "Request inspection" CTA.
- **Team** — dynamic staff cards (photo, name, role, bio) pulled from DB.
- **Blog** — news & market updates, list + detail pages.
- **Contact** — phone (0814 390 0780), socials (IG, FB, TikTok), inquiry form, embedded map.
- Global header/footer with logo, nav, socials, phone.

## Client accounts

- Email/password + Google sign-in.
- Save favorite listings, view own inquiries, view own inspection bookings.

## Admin dashboard (`/_authenticated/admin`, role-gated)

- **Listings** — CRUD (title, location, price, description, amenities, cover image, gallery uploads, YouTube URL, status: available/sold/reserved, featured toggle).
- **Team** — CRUD staff (photo upload, name, role, bio, order, active toggle) so team page is fully self-managed.
- **Blog posts** — CRUD (title, slug, cover, body markdown, published toggle).
- **Testimonials** — CRUD (client name, photo, quote, rating, published toggle).
- **Inquiries inbox** — list submissions from contact + listing inquiries, mark read/replied, notes.
- **Site inspection bookings** — list requests (listing, name, phone, preferred date), status workflow (pending → confirmed → completed → cancelled).
- **Users & roles** — invite/promote admins.

## Design

Luxury real estate aesthetic. Navy `#0B1E3F`, gold `#C9A24C`, white `#FFFFFF`, with soft cream and charcoal supports. Serif display (Cormorant / Playfair) for headings, clean sans (Inter / Manrope) for body. Generous whitespace, large imagery, subtle gold accents, elegant hover states.

## Seed content

- All 8 listings from the messages seeded with name, location, YouTube URL.
- Vision, mission, core values, contact details.
- Logo (attached) uploaded as brand asset.
- Flyer images: I'll add placeholders now and swap in your Drive images once shared (either you upload via admin, or share the Drive link and I'll pull them in).

## Technical

- **Backend**: Lovable Cloud (Postgres + Auth + Storage).
- **Tables**: `profiles`, `user_roles` (enum: admin, editor, client) with `has_role()` security-definer, `listings`, `listing_images`, `team_members`, `blog_posts`, `testimonials`, `inquiries`, `inspection_bookings`, `favorites`. All with RLS + explicit GRANTs. Public SELECT on published listings/team/blog/testimonials; owner-scoped reads for favorites/inquiries; admin-only writes.
- **Storage buckets**: `listings` (public), `team` (public), `blog` (public), `brand` (public).
- **Auth**: Email/password + Google (via `supabase--configure_social_auth`); `/_authenticated` layout protects client area; nested admin gate via `has_role(auth.uid(),'admin')` server check + client-side role fetch.
- **Data fetching**: TanStack Query with `ensureQueryData` + `useSuspenseQuery`; server functions via `createServerFn`; public reads via publishable server client; admin writes via `requireSupabaseAuth` + role check.
- **Routes**: `/`, `/about`, `/listings`, `/listings/$slug`, `/team`, `/blog`, `/blog/$slug`, `/contact`, `/auth`, `/_authenticated/favorites`, `/_authenticated/my-inquiries`, `/_authenticated/admin/*` (listings, team, blog, testimonials, inquiries, bookings, users).
- Per-route `head()` metadata; og:image on leaf routes using listing/blog cover.

## Open items you can hand off after approval

- Google Drive link (or drop images into admin once live) for flyer imagery.
- Confirm currency/price display format for listings (₦ vs "Price on request").
- Any additional staff details/photos, or you'll add via admin.
