# Remove Victoria Jeremiah from the platform

Assumption: "Jennifer" refers to Victoria Jeremiah — she is the only person on the platform matching, and there is no other person by that name in the accounts or team list. Tell me if you meant someone else.

## What changes

- Victoria's admin access is revoked, and her account is deleted from the platform entirely (she can no longer sign in).
- Her email is removed from the auto-admin allow list, so creating a new account would not re-grant admin.
- Her Team page entry ("Victoria Jeremiah — Admin/ICT") is removed, so she no longer appears publicly.
- You (nachusim@gmail.com) remain the only admin. When you send me the next admin's email, I'll add it to the allow list.

## Technical notes

- Update `grant_admin_for_allowlisted_email()` to drop `victoriajeremiah@gmail.com`, `victoriajeremiah0@gmail.com`, and `onwanku@gmail.com`? — only the two Victoria addresses are removed; `onwanku@gmail.com` stays unless you say otherwise.
- Delete her rows: `user_roles`, `profiles`, `team_members` entry, then the `auth.users` record (cascades favorites/inquiries links).
- Any inquiries or bookings she is linked to keep their data; the `user_id` reference nulls out or is detached rather than deleting customer records.
