import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";

const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!data) throw notFound();
    return { post: data };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.post.title} — Moxie Homes Blog` },
            { name: "description", content: loaderData.post.excerpt ?? "" },
            { property: "og:title", content: loaderData.post.title },
            { property: "og:description", content: loaderData.post.excerpt ?? "" },
            ...(loaderData.post.cover_image_url
              ? [{ property: "og:image", content: loaderData.post.cover_image_url }]
              : []),
          ],
        }
      : { meta: [{ title: "Post" }, { name: "robots", content: "noindex" }] },
  component: BlogPost,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-page py-32 text-center">
        <h1 className="font-serif text-4xl text-navy">Post not found</h1>
        <Link to="/blog" className="mt-6 inline-block text-gold hover:underline">← Back to blog</Link>
      </div>
    </SiteLayout>
  ),
});

function BlogPost() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(postQuery(slug));
  if (!p) return null;
  return (
    <SiteLayout>
      <article className="container-page py-16 max-w-3xl">
        <Link to="/blog" className="text-sm text-gold hover:underline">← All posts</Link>
        <h1 className="mt-4 font-serif text-5xl text-navy">{p.title}</h1>
        {p.author_name && <div className="mt-2 text-sm text-muted-foreground">By {p.author_name}</div>}
        {p.cover_image_url && <img src={p.cover_image_url} alt="" className="mt-8 aspect-[16/9] w-full rounded-xl object-cover" />}
        <div className="prose prose-neutral mt-8 whitespace-pre-line leading-relaxed text-foreground">{p.body}</div>
      </article>
    </SiteLayout>
  );
}
