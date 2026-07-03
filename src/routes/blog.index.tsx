import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { blogPostsQuery } from "@/lib/queries";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Moxie Homes & Properties" },
      { name: "description", content: "News, insights, and updates from Moxie Homes & Properties Ltd." },
      { property: "og:title", content: "Moxie Homes Blog" },
      { property: "og:description", content: "Real estate insights from Moxie Homes." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(blogPostsQuery),
  component: BlogIndex,
});

function BlogIndex() {
  const { data: posts } = useSuspenseQuery(blogPostsQuery);
  return (
    <SiteLayout>
      <section className="bg-cream py-20">
        <div className="container-page">
          <div className="text-xs uppercase tracking-[0.25em] text-gold">Insights</div>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl text-navy">The Moxie Journal</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">Market updates, guides, and stories from the Moxie team.</p>
        </div>
      </section>
      <section className="container-page py-16">
        {posts.length === 0 ? (
          <div className="rounded-xl border border-dashed p-16 text-center text-muted-foreground">
            No posts published yet. Check back soon.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-xl ring-1 ring-border transition-all hover:ring-gold/40 hover:shadow-lg">
                {p.cover_image_url && (
                  <div className="aspect-[16/10] bg-muted" style={{ backgroundImage: `url(${p.cover_image_url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                )}
                <div className="p-6">
                  <h3 className="font-serif text-2xl text-navy group-hover:text-gold transition-colors">{p.title}</h3>
                  {p.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
