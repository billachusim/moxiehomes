## Scope

You asked for real work email addresses (`info@`, `admin@`, `ceo@`, `inspections@moxiehomesandproperties.com`). Since Lovable doesn't host inboxes, this plan sets up **Zoho Mail free tier** (real mailboxes you can sign into) **and** Lovable Emails on a separate subdomain (so automated inspection emails still send from your brand without conflicting with your inboxes).

Why Zoho: free for up to 5 mailboxes on your own domain, which fits your four addresses perfectly. Google Workspace would cost ~$28/month for the same.

---

### 1. Mailboxes at Zoho Mail (free, up to 5 users)

**What you do at Zoho** (I can't do these from Lovable — they need your login):
1. Sign up at [zoho.com/mail](https://www.zoho.com/mail/zohomail-pricing.html) → pick the **Forever Free Plan** (5 users, 5GB each).
2. Add domain: `moxiehomesandproperties.com`.
3. Zoho gives you 3 DNS records to add at your registrar:
   - 1 TXT (domain verification)
   - 2 MX records (`mx.zoho.com` priority 10, `mx2.zoho.com` priority 20)
   - Optional SPF + DKIM for deliverability (recommended)
4. Create the four mailboxes: `info`, `admin`, `ceo`, `inspections`.
5. Log into each at [mail.zoho.com](https://mail.zoho.com).

**Where to add DNS**: depends on where you bought the domain. If it's through Lovable, I'll show you how; if elsewhere (Namecheap, GoDaddy, Cloudflare, etc.), you'll do it in that provider's DNS panel.

### 2. Lovable Emails on a separate subdomain

Lovable delegates a whole subdomain via NS records, which conflicts with putting MX records on the same name. Standard fix: use a **sending subdomain**.

- Sender subdomain: `notify.moxiehomesandproperties.com`
- Visible From address: `inspections@moxiehomesandproperties.com` (Lovable supports displaying the root domain while sending via the delegated subdomain)
- I'll trigger the Lovable email setup dialog — you complete a one-click DNS step, and Lovable manages SPF/DKIM inside that subdomain automatically.
- Once verified, the automated booking-confirmation + admin-alert emails from the previous turn's plan start sending.

### 3. Forward mailbox replies correctly

When a client replies to a Lovable-sent inspection confirmation, the reply should land in the real `inspections@` Zoho inbox. I'll configure the email templates so the `Reply-To` header is `inspections@moxiehomesandproperties.com` — the mailbox you'll be reading in Zoho.

### 4. Update the app to use the new addresses

- `src/lib/site.ts`: swap the placeholder contact email(s) to `info@moxiehomesandproperties.com`.
- Contact page / footer: display all four addresses with what each is for:
  - `info@` — general inquiries
  - `inspections@` — site inspection bookings
  - `admin@` — operations
  - `ceo@` — leadership
- Auto-grant admin trigger already covers `onwanku@` and `victoriajeremiah@` (personal). If you want anyone signing up with `@moxiehomesandproperties.com` to auto-get an admin role too, say so and I'll add a domain-based trigger (only after email verification, to prevent spoofing).

---

## Order of operations

1. **You**: create the Zoho account, add the domain, get the DNS records.
2. **You**: add Zoho's MX/TXT records at your DNS provider.
3. **Me**: trigger the Lovable email-domain setup dialog for `notify.moxiehomesandproperties.com`.
4. **You**: complete the one-click Lovable DNS step.
5. **Me**: scaffold Lovable email templates + inspection notification triggers (from the previous plan), set `Reply-To: inspections@…`, update the app to display the new addresses.
6. Wait for DNS propagation (usually under an hour, up to 72h max).

## What I can't do

- Sign into Zoho for you or create their account.
- Add DNS records at your registrar automatically (unless the domain is bought through Lovable — say so and I'll walk you through the in-app DNS manager).

## Open question you can answer any time

Where is `moxiehomesandproperties.com` registered (Lovable, Namecheap, GoDaddy, Cloudflare, other)? That determines whether you add DNS in Lovable's UI or at the registrar.
