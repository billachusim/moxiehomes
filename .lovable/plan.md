# Admin management in the Users section

Scope it down: the Users tab becomes an **admin/editor management** screen, not a list of every app user.

## What changes

- The Users tab lists only accounts that hold an admin or editor role — currently you and Victoria.
- Any admin can see that list and promote/revoke admin or editor access (controls already exist, they just have nothing to show today).
- Regular client accounts stay out of this screen entirely.
- Each row shows the person's name, their email, and their roles, so you can tell people apart.

Nothing changes for normal users: they still can only see their own profile.

## Technical notes

- Migration:
  - Add an `email` column to `public.profiles`, update `handle_new_user()` to store `NEW.email`, and backfill the two existing rows from `auth.users`.
  - Add an admin-only SELECT policy on `profiles` restricted to rows whose user has an `admin` or `editor` role (via a security-definer helper), keeping `profiles_select_own` intact.
- Frontend: in `UsersAdmin` (`src/routes/_authenticated/admin.tsx`), filter the list to users with roles, show email next to the name, and relabel the tab "Admins".
