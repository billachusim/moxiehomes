import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, ShieldCheck, HomeIcon, KeyRound, Award } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { listingsQuery, testimonialsQuery } from "@/lib/queries";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(listingsQuery({ featured: true, limit: 6 }));
    void context.queryClient.ensureQueryData(testimonialsQuery);
  },
  component: HomePage,
});

function HomePage() {
  const { data: featured } = useSuspenseQuery(listingsQuery({ featured: true, limit: 6 }));
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-navy">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/40" />
        <div className="container-page relative py-24 md:py-32">
          <div className="max-w-2xl text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Est. Nigeria
            </div>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] text-white">
              A secured future,<br />
              <span className="text-gold italic">built on trust.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80">
              {SITE.tagline} Genuine, affordable, and exquisite homes and estates across Abuja and beyond.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/listings"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-medium text-gold-foreground hover:bg-gold/90"
              >
                View Properties <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
              >
                Book a site inspection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="container-page py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Genuine Titles", desc: "Every property fully documented and verified." },
            { icon: HomeIcon, title: "Prime Locations", desc: "Abuja, Asaba, and emerging growth corridors." },
            { icon: KeyRound, title: "Affordable Access", desc: "Flexible plans that make ownership possible." },
            { icon: Award, title: "Trusted Team", desc: "Trained, experienced, accountable professionals." },
          ].map((v) => (
            <div key={v.title} className="group rounded-xl border border-border p-6 transition-colors hover:border-gold">
              <v.icon className="h-8 w-8 text-gold" />
              <h3 className="mt-4 text-xl font-serif text-navy">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      <section className="bg-cream py-16 md:py-24">
        <div className="container-page">
          <div className="mb-12 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-gold">Featured Estates</div>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl text-navy">Handpicked properties</h2>
            </div>
            <Link to="/listings" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-gold">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((l) => (
              <Link
                key={l.id}
                to="/listings/$slug"
                params={{ slug: l.slug }}
                className="group overflow-hidden rounded-xl bg-background shadow-sm ring-1 ring-border transition-all hover:shadow-lg hover:ring-gold/40"
              >
                <div
                  className="aspect-[4/3] w-full bg-muted transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${l.cover_image_url ?? ""})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="p-5">
                  <div className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">{l.location}</div>
                  <h3 className="mt-2 font-serif text-2xl text-navy">{l.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{l.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mission strip */}
      <section className="container-page py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-gold">Our Mission</div>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl text-navy">
              Home ownership,<br /><span className="italic">made accessible.</span>
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">{SITE.mission}</p>
            <Link to="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-gold">
              More about us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {SITE.coreValues.map((v) => (
              <div key={v.name} className="rounded-lg border border-border p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-gold">{v.name}</div>
                <div className="mt-2 text-sm text-navy">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-navy py-16 md:py-24 text-navy-foreground">
          <div className="container-page">
            <div className="text-xs uppercase tracking-[0.25em] text-gold">What clients say</div>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">Trusted by our teeming clients.</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {testimonials.map((t) => (
                <figure key={t.id} className="rounded-xl border border-white/10 bg-white/5 p-8">
                  <blockquote className="font-serif text-xl italic leading-relaxed">"{t.quote}"</blockquote>
                  <figcaption className="mt-6 text-sm text-white/70">
                    <div className="font-medium text-gold">{t.client_name}</div>
                    {t.client_title && <div>{t.client_title}</div>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-page py-16 md:py-24">
        <div className="rounded-2xl bg-cream p-10 md:p-16 text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-navy">Ready to invest in your future?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Speak with our team to schedule a site inspection or explore available estates.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/listings" className="rounded-md bg-navy px-6 py-3 text-sm font-medium text-navy-foreground hover:bg-navy/90">Browse Properties</Link>
            <a href={SITE.phoneHref} className="rounded-md border border-navy px-6 py-3 text-sm font-medium text-navy hover:bg-navy hover:text-navy-foreground">Call {SITE.phone}</a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
