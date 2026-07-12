## Scope

Three connected pieces on top of the existing "Book a site inspection" form and admin dashboard. Booking statuses stay as-is: **pending / confirmed / completed / cancelled**.

---

### 1. On-screen confirmation after submitting

- After a successful submit on the listing detail page, navigate to a new route `/inspection-confirmed` (query params: `listing`, `date`, `time`).
- The page shows a large success card: check icon, "Your inspection is booked", a summary of what they submitted (property, date, preferred time, contact email), what to expect next ("our team will call you within 24 hours to confirm"), and CTAs back to the listing and to browse more properties.
- The inline booking form on the listing page keeps a small inline success state as a fallback for users who dismiss the redirect.

### 2. Email notifications (Lovable Emails)

Prerequisite: Lovable Emails needs a verified sender domain. Since one isn't set up yet, the plan will:

1. Prompt the email-domain setup dialog first (one-click; you complete DNS with the registrar afterwards).
2. Once the domain is registered in the project (even before DNS fully verifies), scaffold email infrastructure + transactional templates.
3. Two branded templates:
   - **Client confirmation** — "We've received your inspection request for {property}" with date/time and contact info.
   - **Admin alert** — sent to `onwanku@gmail.com` and `victoriajeremiah@gmail.com` with all booking details and a link into the admin dashboard.
4. A trigger: when a row is inserted into `inspection_bookings`, a server function enqueues both emails using the booking's id as the idempotency key (so retries don't duplicate).

Emails start sending automatically once your domain's DNS is verified — no code changes needed after that. Until then, the form + confirmation page + admin dashboard still work; emails just queue.

No SMS, per your choice.

### 3. Admin actions on bookings

Enhance the "Inspections" tab in the admin dashboard (currently a read-only table with a status dropdown):

- **Row → detail drawer** with everything the client submitted (name, email, phone, property + link, preferred date/time, client notes, created date).
- **Status dropdown** stays inline in the row and in the drawer — same four values as today (pending / confirmed / completed / cancelled), color-coded badges.
- **Admin notes**: textarea in the drawer, "Save notes" button, writes to the existing `admin_notes` column. Shows last-updated timestamp.
- **Quick filters** above the table: All / Pending / Confirmed / Completed / Cancelled, plus a search box (name/email/phone).
- **Quick actions** in the drawer: "Copy phone", "Copy email", "Open in mail client" (mailto).

---

## Technical notes

- New route file: `src/routes/inspection-confirmed.tsx` (public, no auth gate).
- Update `InspectionForm` in `src/routes/listings.$slug.tsx` to `navigate({ to: "/inspection-confirmed", search: {...} })` on success.
- New server function `src/lib/bookings.functions.ts` → `notifyBookingCreated({ bookingId })`; enqueues two `sendTransactionalEmail` calls. Called from the client right after the insert succeeds (public — no auth required, but validates that the booking id exists and hasn't already been notified via idempotency key).
- Templates land under `src/lib/email-templates/booking-client-confirmation.tsx` and `booking-admin-alert.tsx`; both registered in `registry.ts`.
- Admin dashboard changes are scoped to `BookingsAdmin` in `src/routes/_authenticated/admin.tsx`: new drawer component, filter/search state, notes mutation via `supabase.from("inspection_bookings").update(...)`.
- No schema changes required — `admin_notes` and `status` already exist.

## What happens on your end

1. When I set up email domain, you'll see a dialog to pick your sender subdomain (e.g. `notify.moxiehomes.com`) and get DNS records to paste at your registrar.
2. After DNS verifies (usually minutes to a few hours), queued emails start sending automatically.
3. Everything else (confirmation page, admin drawer, notes, filters) works immediately.
