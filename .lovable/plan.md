## Rebrand + Admin Access + Address

### 1. Real logo
- Upload the attached logo via `lovable-assets create` from `/mnt/user-uploads/PHOTO-2026-07-11-04-05-24.jpg` → `src/assets/moxie-logo-real.png.asset.json`.
- Replace logo reference in `src/components/site-header.tsx` and `src/components/site-footer.tsx`.
- Remove the CSS `filter` hack currently used to tint the placeholder logo in the footer — the new logo already has navy background + gold/white artwork, so it renders correctly as-is.
- Delete the old `src/assets/moxie-logo.png.asset.json` pointer.

### 2. Navy color
The logo background is a deep navy. Update `--navy` token in `src/styles.css` to match (approx `#0A1A3F` → `oklch(0.20 0.08 265)`), and keep gold `#C9A24C` as-is (matches the logo accent). One-token change propagates everywhere.

### 3. Company address
Add `address` to `src/lib/site.ts`:
> Suite E1, Victory Plaza, 7 Onitsha Crescent, Off Gimbiya Street, Area 11, Garki, Abuja.

Display in:
- `src/components/site-footer.tsx` — replace the "Abuja · Nigeria" line with the full address.
- `src/routes/contact.tsx` — add address line to the contact info block.

### 4. Auto-grant admin to specific emails
Update the existing `handle_new_user()` trigger function (migration) so that when a new auth user is created with a **verified** email in the allow-list, they receive the `admin` role in addition to `client`:

Allow-list: `onwanku@gmail.com`, `victoriajeremiah@gmail.com`.

Also add a second trigger on `auth.users` for updates to `email_confirmed_at` (per email-domain-role-assignment security guidance) so admin is granted only after email verification — protecting against privilege escalation.

Backfill: if either email already exists in `auth.users` and is confirmed, insert the admin row immediately.

### Notes
- Work email/domain setup is deferred until the user buys a domain — no action this turn.
- No changes to listings, business logic, or admin dashboard UI (already exists at `/admin`).
