import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { teamQuery } from "@/lib/queries";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Our Team — Moxie Homes & Properties" },
      { name: "description", content: "Meet the trained and experienced professionals behind Moxie Homes." },
      { property: "og:title", content: "Meet the Moxie Homes Team" },
      { property: "og:description", content: "Trained, experienced, accountable professionals." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(teamQuery),
  component: TeamPage,
});

function TeamPage() {
  const { data: team } = useSuspenseQuery(teamQuery);

  return (
    <SiteLayout>
      <section className="bg-navy text-navy-foreground py-24">
        <div className="container-page">
          <div className="text-xs uppercase tracking-[0.25em] text-gold">Our Team</div>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl max-w-3xl">The professionals behind every deal.</h1>
          <p className="mt-6 max-w-2xl text-white/75 leading-relaxed">
            Trained, experienced, and accountable — meet the people making home ownership accessible for our clients.
          </p>
        </div>
      </section>
      <section className="container-page py-16">
        {team.length === 0 ? (
          <div className="rounded-xl border border-dashed p-16 text-center text-muted-foreground">
            Our team page is being updated. Check back soon.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <div key={m.id} className="rounded-xl border border-border p-6 text-center">
                <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-cream">
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={m.full_name ?? ""} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-14 w-14 text-gold" />
                  )}
                </div>
                <h3 className="mt-5 font-serif text-2xl text-navy">{m.full_name}</h3>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-gold">{m.role}</div>
                {m.bio && <p className="mt-4 text-sm text-muted-foreground">{m.bio}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
