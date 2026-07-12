import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Calendar, Home, Mail } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";

type Search = {
  listing?: string;
  slug?: string;
  date?: string;
  email?: string;
};

export const Route = createFileRoute("/inspection-confirmed")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    listing: typeof search.listing === "string" ? search.listing : undefined,
    slug: typeof search.slug === "string" ? search.slug : undefined,
    date: typeof search.date === "string" ? search.date : undefined,
    email: typeof search.email === "string" ? search.email : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Inspection request received | Moxie Homes" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmedPage,
});

function ConfirmedPage() {
  const { listing, slug, date, email } = Route.useSearch();

  return (
    <SiteLayout>
      <section className="container-page py-20 md:py-28">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-cream p-8 md:p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15">
            <CheckCircle2 className="h-9 w-9 text-gold" />
          </div>
          <div className="mt-6 text-xs uppercase tracking-[0.25em] text-gold">Request received</div>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl text-navy">
            Your inspection is booked
          </h1>
          <p className="mt-4 text-muted-foreground">
            Thank you{listing ? "" : ""} — we've logged your request and our team will call you
            within 24 hours to confirm the exact time.
          </p>

          {(listing || date || email) && (
            <div className="mt-8 grid gap-3 text-left rounded-xl border border-border bg-background p-5">
              {listing && (
                <div className="flex items-start gap-3">
                  <Home className="mt-0.5 h-4 w-4 text-gold" />
                  <div>
                    <div className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">Property</div>
                    <div className="text-sm font-medium text-navy">{listing}</div>
                  </div>
                </div>
              )}
              {date && (
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-gold" />
                  <div>
                    <div className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">Preferred date</div>
                    <div className="text-sm font-medium text-navy">{date}</div>
                  </div>
                </div>
              )}
              {email && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-gold" />
                  <div>
                    <div className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">Confirmation to</div>
                    <div className="text-sm font-medium text-navy">{email}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {slug ? (
              <Link to="/listings/$slug" params={{ slug }} className="rounded-md border border-input px-5 py-2.5 text-sm hover:bg-secondary">
                Back to property
              </Link>
            ) : null}
            <Link to="/listings" className="rounded-md bg-navy px-5 py-2.5 text-sm text-navy-foreground hover:bg-navy/90">
              Browse more properties
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
