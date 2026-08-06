# Fix: Users page doesn't show other admins

## What's happening

Victoria (victoriajeremiah0@gmail.com) **is** a real admin — the database confirms her account is confirmed and carries the admin role. The problem is only in what the Users page can display:

1. The Users page reads from the profiles table, and the current access rule lets each person see **only their own profile row**. So when you open it, you see yourself and no one else.
2. Profiles store name and phone but not email, so even once other users appear, there's no email column to recognise them by.

## The fix

- Allow admins to view all profile rows (regular users still only see their own).
- Make email visible on the Users page by capturing each account's email into their profile at signup, and backfilling the two existing accounts.
- Users page then lists every account with name, email, and current roles, with the existing promote/revoke controls working across all users.

Role changes stay admin-only, exactly as now.

## Technical notes

- Migration: add `email` column to `public.profiles`; update `handle_new_user()` to write `NEW.email`; backfill existing rows from `auth.users`; add an admin SELECT policy on `profiles` using `has_role(auth.uid(), 'admin')` (keep `profiles_select_own`).
- Frontend: `UsersAdmin` in `src/routes/_authenticated/admin.tsx` — render email alongside full name; no query change needed beyond selecting the new column.
