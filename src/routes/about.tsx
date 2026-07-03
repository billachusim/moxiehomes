import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Moxie Homes & Properties" },
      { name: "description", content: "Our vision, mission, and core values. Moxie Homes is committed to trust and credibility in Nigeria real estate." },
      { property: "og:title", content: "About Moxie Homes & Properties" },
      { property: "og:description", content: "Vision, mission, and core values driving trusted real estate investment in Nigeria." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="bg-navy text-navy-foreground py-24">
        <div className="container-page">
          <div className="text-xs uppercase tracking-[0.25em] text-gold">About Us</div>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl max-w-3xl">A trusted partner in Nigeria real estate.</h1>
          <p className="mt-6 max-w-2xl text-white/75 leading-relaxed">
            Moxie Homes And Properties Limited is committed to genuine, affordable, and exquisite homes — helping our clients attain their dream of a secured future through real estate.
          </p>
        </div>
      </section>

      <section className="container-page py-16 md:py-24 grid gap-12 md:grid-cols-2">
        <div className="rounded-xl border border-border p-8">
          <div className="text-xs uppercase tracking-[0.25em] text-gold">Vision</div>
          <h2 className="mt-3 font-serif text-3xl text-navy">Leading. Trusted. Innovative.</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{SITE.vision}</p>
        </div>
        <div className="rounded-xl border border-border p-8 bg-cream">
          <div className="text-xs uppercase tracking-[0.25em] text-gold">Mission</div>
          <h2 className="mt-3 font-serif text-3xl text-navy">At the forefront of home ownership.</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{SITE.mission}</p>
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="text-xs uppercase tracking-[0.25em] text-gold">Core Values</div>
        <h2 className="mt-3 font-serif text-4xl text-navy">The principles that guide us.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-5">
          {SITE.coreValues.map((v, i) => (
            <div key={v.name} className="rounded-xl border border-border p-6">
              <div className="font-serif text-3xl text-gold">0{i + 1}</div>
              <div className="mt-4 font-serif text-xl text-navy">{v.name}</div>
              <div className="mt-2 text-sm text-muted-foreground">{v.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
