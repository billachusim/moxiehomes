# Moxie Homes & Properties — Project Handover

Hello,

Below is a walkthrough of everything we've built for **Moxie Homes & Properties**. The site is live, fully responsive, and built on a modern, fast, and secure foundation designed to grow with the business.

---

## 1. Public Website

A polished, mobile-friendly marketing site that presents Moxie Homes as a trusted, premium brand.

- **Home page** — a strong hero, brand story, featured listings, and clear calls-to-action guiding visitors toward listings, the team, and inspection bookings.
- **About page** — company narrative, values, and positioning built to build trust with buyers, tenants, and partners.
- **Listings**
  - **Listings index** — a browsable catalogue of every property, with imagery, pricing, and quick access to details.
  - **Listing detail pages** — a dedicated shareable page for each property, complete with SEO-friendly titles, descriptions, and social-preview images pulled from the property itself.
- **Blog**
  - **Blog index** — a growing content hub for market insight, tips, and company news.
  - **Article pages** — clean, readable article layouts with proper metadata for search engines and social sharing.
- **Team page** — introduces the people behind Moxie Homes, including roles and photos, managed live from the admin dashboard.
- **Contact page** — clear contact details and enquiry pathways.
- **Book Inspection** — a dedicated flow that lets prospects schedule property inspections, ending in a confirmation page.
- **Global header & footer** — consistent navigation, branding, and quick links across every page.

Every page has its own tailored title, description, and social-share metadata, which means the site looks professional not just in a browser, but also when links are shared on WhatsApp, Facebook, LinkedIn, or search results.

---

## 2. Accounts & Sign-In

A secure account system powered by industry-standard authentication.

- **Email + password sign-up and sign-in.**
- **Sign in with Google** — one-click access, no password to remember.
- **Role-aware experience** — the site knows who's an admin and who isn't, and quietly adapts the interface to match. Regular visitors see a clean public site; admins see the extra tools they need.
- **Secure sessions** — sign-ins are protected with modern token-based sessions, and sign-out is a single click.

---

## 3. Admin Dashboard (`/admin`)

A private control centre for the Moxie Homes team to manage the entire website without touching any code.

- **Central admin hub** — one place to manage everything.
- **Listings management** — create, edit, publish, and remove property listings, including photos, pricing, descriptions, and status.
- **Team / Staff management** — add, edit, or remove staff members, assign roles, and upload their photos. Changes appear on the public Team page immediately.
- **Company pages management** — update content across the site's core pages in one place.
- **Role-based access** — only users with an **admin** (or **editor**) role can even see the dashboard. Everyone else is safely redirected. This is enforced both in the interface *and* at the database level, so it cannot be bypassed.

---

## 4. Security & Data Protection

Security has been built in from the ground up, not bolted on.

- **Row-level security** on every database table — the database itself refuses to release data to anyone who isn't authorised, even if something upstream were misconfigured.
- **Server-side role checks** — admin actions are validated on the server, not just hidden in the browser.
- **Protected admin routes** — unauthenticated users are automatically redirected to sign-in; non-admins are redirected to the home page.
- **Email allow-list for admin access** — only pre-approved email addresses are automatically elevated to admin on sign-up. Everyone else gets a regular account by default.
- **Secure secret handling** — API keys and sensitive credentials are stored server-side and never exposed to the browser.

---

## 5. Performance, SEO & Sharing

- **Server-side rendering** — pages load fast and are fully readable by search engines from the first byte.
- **Per-page SEO metadata** — unique title, description, and Open Graph tags on every route (home, about, listings, individual listing, blog, articles, team, contact).
- **Social preview images** — listings and articles automatically supply their own cover image when shared.
- **Semantic HTML, alt text on images, responsive viewport, canonical tags** — all best practices in place.
- **Mobile-first design** — the site looks and behaves excellently on phones, tablets, and desktops.

---

## 6. Infrastructure

- **Modern React (TanStack Start) + TypeScript** — a fast, type-safe stack used by leading product teams.
- **Cloud database, authentication, and file storage** — managed, backed up, and scalable.
- **Serverless backend functions** — used for admin operations and any logic that must run securely on the server.
- **Continuous deployment** — every change is deployed to a live preview URL, and to the production domain when approved.
- **Custom domain support** — the site is served from `moxiehomesandproperties.com`.

---

## 7. Admin Access Setup

The following admin email address has been pre-approved for this project:

- **onwanku…@…** (CEO)

**How to get in:**

1. Go to the site and click **Sign in**.
2. Either create an account with the pre-approved email address (using email + password), or sign in with Google using that same address.
3. On first successful sign-in, the account is **automatically elevated to admin** — no manual step required from your side.
4. Once signed in as admin, an **Admin** link appears in the header. Clicking it opens the dashboard, where you can manage listings, staff, and site content.

Any other person who signs up will get a normal account. They will **not** see the admin dashboard and will **not** be able to change any content. If you'd like additional team members promoted to admin later, just share their email address with me and I'll add them to the allow-list.

---

## Summary

You now have a fast, secure, professionally designed real-estate platform with:

- A complete public marketing website (home, about, listings, blog, team, contact, inspection booking).
- A secure account system with Google and email sign-in.
- A private admin dashboard for managing listings, staff, and company pages.
- Enterprise-grade security, SEO, and performance baked in.
- Automatic admin access for the two approved email addresses.

Everything is live, everything is yours, and the platform is ready to grow as Moxie Homes & Properties grows.

Thank you for the opportunity to build this with you.
