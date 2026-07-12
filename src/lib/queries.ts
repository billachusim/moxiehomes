import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const listingsQuery = (opts?: { featured?: boolean; limit?: number }) =>
  queryOptions({
    queryKey: ["listings", opts ?? {}],
    queryFn: async () => {
      let q = supabase
        .from("listings")
        .select("*")
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      if (opts?.featured) q = q.eq("featured", true);
      if (opts?.limit) q = q.limit(opts.limit);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

export const listingBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["listing", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const teamQuery = queryOptions({
  queryKey: ["team"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("team_members_public")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const blogPostsQuery = queryOptions({
  queryKey: ["blog", "published"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false });
    if (error) throw error;
    return data ?? [];
  },
});
