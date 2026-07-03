import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, Play } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { listingBySlugQuery } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { youtubeEmbedUrl } from "@/lib/site";

export const Route = createFileRoute("/listings/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(listingBySlugQuery(params.slug));
    if (!data) throw notFound();
    return { listing: data };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.listing.title} — ${loaderData.listing.location} | Moxie Homes` },
            { name: "description", content: loaderData.listing.description ?? "" },
            { property: "og:title", content: loaderData.listing.title },
            { property: "og:description", content: loaderData.listing.description ?? "" },
            ...(loaderData.listing.cover_image_url
              ? [
                  { property: "og:image", content: loaderData.listing.cover_image_url },
                  { name: "twitter:image", content: loaderData.listing.cover_image_url },
                ]
              : []),
          ],
        }
      : { meta: [{ title: "Property" }, { name: "robots", content: "noindex" }] },
  component: ListingDetail,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-page py-32 text-center">
        <h1 className="font-serif text-4xl text-navy">Property not found</h1>
        <Link to="/listings" className="mt-6 inline-block text-gold hover:underline">← Back to listings</Link>
      </div>
    </SiteLayout>
  ),
});

function ListingDetail() {
  const { slug } = Route.useParams();
  const { data: l } = useSuspenseQuery(listingBySlugQuery(slug));
  if (!l) return null;

  const embed = youtubeEmbedUrl(l.youtube_url);

  return (
    <SiteLayout>
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden bg-navy">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${l.cover_image_url ?? ""})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
        <div className="container-page absolute inset-x-0 bottom-0 pb-10 text-white">
          <Link to="/listings" className="text-sm text-gold hover:underline">← All listings</Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {l.featured && <span className="rounded-full bg-gold px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-gold-foreground">Featured</span>}
            <span className="rounded-full bg-white/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-white">{l.status.replace("_", " ")}</span>
          </div>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl">{l.title}</h1>
          <div className="mt-3 inline-flex items-center gap-2 text-white/85">
            <MapPin className="h-4 w-4 text-gold" /> {l.location}
          </div>
        </div>
      </section>

      <section className="container-page py-16 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="font-serif text-3xl text-navy">About this property</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">
              {l.description ?? "Details coming soon."}
            </p>
          </div>

          {embed && (
            <div>
              <h2 className="font-serif text-3xl text-navy flex items-center gap-2">
                <Play className="h-6 w-6 text-gold" /> Property tour
              </h2>
              <div className="mt-4 aspect-video overflow-hidden rounded-xl bg-black">
                <iframe
                  src={embed}
                  title={`${l.title} video tour`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          )}

          {l.amenities && l.amenities.length > 0 && (
            <div>
              <h2 className="font-serif text-3xl text-navy">Amenities</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {l.amenities.map((a) => (
                  <span key={a} className="rounded-full border border-border px-4 py-1.5 text-sm">{a}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 h-fit">
          <InspectionForm listingId={l.id} listingTitle={l.title} />
        </aside>
      </section>
    </SiteLayout>
  );
}

function InspectionForm({ listingId, listingTitle }: { listingId: string; listingTitle: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", preferred_date: "", notes: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.preferred_date) {
      toast.error("Please fill in name, email, phone, and preferred date.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("inspection_bookings").insert({
      listing_id: listingId,
      name: form.name,
      email: form.email,
      phone: form.phone,
      preferred_date: form.preferred_date,
      notes: form.notes || `Interested in ${listingTitle}`,
    });
    setSubmitting(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Inspection request sent! We'll be in touch shortly.");
      setForm({ name: "", email: "", phone: "", preferred_date: "", notes: "" });
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-border bg-cream p-6">
      <div className="text-xs uppercase tracking-[0.2em] text-gold">Book a site inspection</div>
      <h3 className="mt-2 font-serif text-2xl text-navy">Reserve your visit</h3>
      <div className="mt-5 space-y-3">
        <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-gold" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-gold" />
        <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-gold" />
        <input required type="date" value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-gold" />
        <textarea placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="min-h-24 w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:border-gold" />
      </div>
      <button disabled={submitting} className="mt-5 w-full rounded-md bg-navy px-4 py-3 text-sm font-medium text-navy-foreground hover:bg-navy/90 disabled:opacity-60">
        {submitting ? "Sending..." : "Request Inspection"}
      </button>
    </form>
  );
}
