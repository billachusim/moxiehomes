## 1. Add `nachusim@gmail.com` to the admin allow-list

Update the `grant_admin_for_allowlisted_email` database trigger to include the new email alongside `onwanku@gmail.com` and `victoriajeremiah@gmail.com`. Also insert an `admin` role row for this user immediately if they've already signed up (so they don't need to re-confirm).

After the migration, they sign in at `/auth` and get admin access automatically.

## 2. Stop sending everyone to `/admin` after sign-in

We DO have user features (favorites, inquiries, booking history), so keep sign-in open to everyone and make the admin surface role-aware instead of admin-only.

**`src/routes/auth.tsx`** — after successful sign-in (email/password, Google, and the "already signed in" redirect), check the user's roles:
- If they have `admin` or `editor` → navigate to `/admin`
- Otherwise → navigate to `/` (home)

**`src/components/site-header.tsx`** — currently shows a "Dashboard" link to `/admin` for every signed-in user. Change it so:
- Signed-out: show **Sign in**
- Signed-in non-admin: show **Sign out** (and later we can add a "My favorites" link)
- Signed-in admin/editor: show **Admin** link + **Sign out**

Role check uses the existing `user_roles` table, fetched once on auth-state change and cached in header state. Applies to both desktop and mobile nav.

**`/admin` route itself** already gates non-admins with the "Admin access required" screen, so no change needed there — the header just won't advertise it to non-admins.

### Files touched
- New migration: update `grant_admin_for_allowlisted_email()` + backfill row for `nachusim@gmail.com`
- `src/routes/auth.tsx` — role-based redirect after sign-in
- `src/components/site-header.tsx` — role-aware Admin link + Sign out
