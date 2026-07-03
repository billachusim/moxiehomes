import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { listingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/listings/")({
  head: () => ({
    meta: [
      { title: "Property Listings — Moxie Homes & Properties" },
      { name: "description", content: "Explore land and estate opportunities across Abuja and Nigeria. Genuine titles, prime locations, affordable access." },
      { property: "og:title", content: "Property Listings — Moxie Homes" },
      { property: "og:description", content: "Land and estate opportunities across Abuja and Nigeria." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(listingsQuery()),
  component: ListingsPage,
});

function ListingsPage() {
  const { data } = useSuspenseQuery(listingsQuery());
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState<string>("all");

  const locations = useMemo(
    () => Array.from(new Set(data.map((l) => l.city ?? l.location))).sort(),
    [data],
  );
  const filtered = useMemo(() => {
    return data.filter((l) => {
      const matchesQ = !q ||
        l.title.toLowerCase().includes(q.toLowerCase()) ||
        l.location.toLowerCase().includes(q.toLowerCase());
      const matchesLoc = loc === "all" || (l.city ?? l.location) === loc;
      return matchesQ && matchesLoc;
    });
  }, [data, q, loc]);

  return (
    <SiteLayout>
      <section className="bg-cream py-16">
        <div className="container-page">
          <div className="text-xs uppercase tracking-[0.25em] text-gold">Portfolio</div>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl text-navy">Available properties</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Curated estates and land opportunities across Abuja and beyond.
          </p>

          <div className="mt-8 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search title or location..."
                className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-gold"
              />
            </div>
            <select
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-gold"
            >
              <option value="all">All locations</option>
              {locations.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed p-16 text-center text-muted-foreground">
            No properties match your search.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l) => (
              <Link
                key={l.id}
                to="/listings/$slug"
                params={{ slug: l.slug }}
                className="group overflow-hidden rounded-xl bg-background ring-1 ring-border shadow-sm transition-all hover:shadow-lg hover:ring-gold/40"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-muted transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${l.cover_image_url ?? ""})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  {l.featured && (
                    <div className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-gold-foreground">
                      Featured
                    </div>
                  )}
                  <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[0.65rem] uppercase tracking-[0.15em] text-navy">
                    {l.status.replace("_", " ")}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">{l.location}</div>
                  <h3 className="mt-2 font-serif text-2xl text-navy">{l.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{l.description}</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-navy font-medium">{l.price_text ?? "Price on request"}</span>
                    <span className="text-gold group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
