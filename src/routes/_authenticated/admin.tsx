import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, LogOut, Plus, Trash2, Edit, Star, Home, Users, MessageSquare, CalendarDays, FileText, Quote, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/moxie-logo.png.asset.json";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

type Tab = "listings" | "team" | "blog" | "testimonials" | "inquiries" | "bookings" | "users";

function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("listings");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setUserEmail(u.user.email ?? "");
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
      const admin = (roles ?? []).some((r) => r.role === "admin" || r.role === "editor");
      setIsAdmin(admin);
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (isAdmin === null) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-gold" /></div>;
  }
  if (!isAdmin) return <NotAdmin email={userEmail} onSignOut={signOut} />;

  const nav: { id: Tab; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "listings", label: "Listings", Icon: Home },
    { id: "team", label: "Team", Icon: Users },
    { id: "blog", label: "Blog", Icon: FileText },
    { id: "testimonials", label: "Testimonials", Icon: Quote },
    { id: "inquiries", label: "Inquiries", Icon: MessageSquare },
    { id: "bookings", label: "Inspections", Icon: CalendarDays },
    { id: "users", label: "Users", Icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-secondary/40 flex">
      <aside className="hidden md:flex w-64 flex-col bg-navy text-navy-foreground">
        <Link to="/" className="flex items-center gap-3 p-6 border-b border-white/10">
          <img src={logo.url} alt="Moxie" className="h-9" />
          <div>
            <div className="font-serif text-sm">Moxie Admin</div>
            <div className="text-[0.6rem] uppercase tracking-widest text-gold">Dashboard</div>
          </div>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                tab === n.id ? "bg-gold text-gold-foreground" : "text-white/80 hover:bg-white/5"
              }`}
            >
              <n.Icon className="h-4 w-4" /> {n.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="px-3 pb-2 text-xs text-white/60 truncate">{userEmail}</div>
          <button onClick={signOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/5">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden bg-navy text-navy-foreground p-4 flex items-center justify-between">
          <div className="font-serif text-lg">Moxie Admin</div>
          <button onClick={signOut}><LogOut className="h-5 w-5" /></button>
        </header>
        <div className="md:hidden overflow-x-auto border-b bg-navy">
          <div className="flex gap-1 p-2">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs ${tab === n.id ? "bg-gold text-gold-foreground" : "text-white/80"}`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        <main className="p-6 md:p-10">
          {tab === "listings" && <ListingsAdmin />}
          {tab === "team" && <TeamAdmin />}
          {tab === "blog" && <BlogAdmin />}
          {tab === "testimonials" && <TestimonialsAdmin />}
          {tab === "inquiries" && <InquiriesAdmin />}
          {tab === "bookings" && <BookingsAdmin />}
          {tab === "users" && <UsersAdmin />}
        </main>
      </div>
    </div>
  );
}

function NotAdmin({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center rounded-xl border border-border p-10">
        <ShieldCheck className="mx-auto h-12 w-12 text-gold" />
        <h1 className="mt-4 font-serif text-3xl text-navy">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You're signed in as <strong>{email}</strong>, but you don't have admin access to this dashboard yet.
          Ask an existing admin to grant you access.
        </p>
        <div className="mt-6 flex gap-2 justify-center">
          <Link to="/" className="rounded-md border border-input px-4 py-2 text-sm">Go home</Link>
          <button onClick={onSignOut} className="rounded-md bg-navy px-4 py-2 text-sm text-navy-foreground">Sign out</button>
        </div>
      </div>
    </div>
  );
}

// ============ LISTINGS ============
function ListingsAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "listings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  const remove = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin", "listings"] });
    qc.invalidateQueries({ queryKey: ["listings"] });
  };

  const toggleFeatured = async (l: any) => {
    const { error } = await supabase.from("listings").update({ featured: !l.featured }).eq("id", l.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "listings"] });
    qc.invalidateQueries({ queryKey: ["listings"] });
  };

  return (
    <div>
      <SectionHeader title="Listings" subtitle="Manage property listings, tours, and status." onAdd={() => { setEditing(null); setShowForm(true); }} />
      {showForm && (
        <ListingForm
          initial={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); qc.invalidateQueries({ queryKey: ["admin", "listings"] }); qc.invalidateQueries({ queryKey: ["listings"] }); }}
        />
      )}
      {isLoading ? <Loading /> : (
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Featured</th>
                <th className="p-3 text-left">Published</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="p-3 font-medium">{l.title}</td>
                  <td className="p-3 text-muted-foreground">{l.location}</td>
                  <td className="p-3"><span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{l.status}</span></td>
                  <td className="p-3">
                    <button onClick={() => toggleFeatured(l)}><Star className={`h-4 w-4 ${l.featured ? "fill-gold text-gold" : "text-muted-foreground"}`} /></button>
                  </td>
                  <td className="p-3">{l.published ? "Yes" : "No"}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => { setEditing(l); setShowForm(true); }} className="mr-2 text-navy hover:text-gold"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => remove(l.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ListingForm({ initial, onClose, onSaved }: { initial: any; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    location: initial?.location ?? "",
    city: initial?.city ?? "Abuja",
    state: initial?.state ?? "FCT",
    description: initial?.description ?? "",
    price_text: initial?.price_text ?? "Price on request",
    cover_image_url: initial?.cover_image_url ?? "",
    youtube_url: initial?.youtube_url ?? "",
    status: initial?.status ?? "available",
    featured: initial?.featured ?? false,
    published: initial?.published ?? true,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = f.slug || f.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const payload = { ...f, slug };
    const { error } = initial
      ? await supabase.from("listings").update(payload).eq("id", initial.id)
      : await supabase.from("listings").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(initial ? "Updated" : "Created");
    onSaved();
  };

  return (
    <FormShell title={initial ? "Edit listing" : "New listing"} onClose={onClose}>
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        <Input label="Title" value={f.title} onChange={(v) => setF({ ...f, title: v })} required />
        <Input label="Slug (auto if blank)" value={f.slug} onChange={(v) => setF({ ...f, slug: v })} />
        <Input label="Location" value={f.location} onChange={(v) => setF({ ...f, location: v })} required />
        <Input label="City" value={f.city} onChange={(v) => setF({ ...f, city: v })} />
        <Input label="Price text" value={f.price_text} onChange={(v) => setF({ ...f, price_text: v })} />
        <Select label="Status" value={f.status} onChange={(v) => setF({ ...f, status: v })} options={["available", "reserved", "sold", "coming_soon"]} />
        <Input label="Cover image URL" value={f.cover_image_url} onChange={(v) => setF({ ...f, cover_image_url: v })} className="md:col-span-2" />
        <Input label="YouTube URL" value={f.youtube_url} onChange={(v) => setF({ ...f, youtube_url: v })} className="md:col-span-2" />
        <Textarea label="Description" value={f.description} onChange={(v) => setF({ ...f, description: v })} className="md:col-span-2" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} /> Featured</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} /> Published</label>
        <div className="md:col-span-2 flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
          <button disabled={saving} className="rounded-md bg-navy px-4 py-2 text-sm text-navy-foreground disabled:opacity-60">{saving ? "Saving..." : "Save"}</button>
        </div>
      </form>
    </FormShell>
  );
}

// ============ TEAM ============
function TeamAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "team"],
    queryFn: async () => (await supabase.from("team_members").select("*").order("sort_order")).data ?? [],
  });
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  const remove = async (id: string) => {
    if (!confirm("Remove team member?")) return;
    await supabase.from("team_members").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "team"] });
    qc.invalidateQueries({ queryKey: ["team"] });
    toast.success("Removed");
  };

  return (
    <div>
      <SectionHeader title="Team" subtitle="Manage staff shown on the public Team page." onAdd={() => { setEditing(null); setShowForm(true); }} />
      {showForm && (
        <TeamForm initial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); qc.invalidateQueries({ queryKey: ["admin", "team"] }); qc.invalidateQueries({ queryKey: ["team"] }); }} />
      )}
      {isLoading ? <Loading /> : (
        <div className="grid gap-4 md:grid-cols-3">
          {data.map((m) => (
            <div key={m.id} className="rounded-xl border bg-background p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-serif text-lg text-navy">{m.full_name}</div>
                  <div className="text-xs uppercase tracking-widest text-gold">{m.role}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(m); setShowForm(true); }}><Edit className="h-4 w-4 text-navy" /></button>
                  <button onClick={() => remove(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></button>
                </div>
              </div>
              {m.bio && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{m.bio}</p>}
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full ${m.active ? "bg-green-100 text-green-800" : "bg-secondary"}`}>{m.active ? "Active" : "Hidden"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TeamForm({ initial, onClose, onSaved }: { initial: any; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({
    full_name: initial?.full_name ?? "",
    role: initial?.role ?? "",
    bio: initial?.bio ?? "",
    photo_url: initial?.photo_url ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    sort_order: initial?.sort_order ?? 0,
    active: initial?.active ?? true,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = initial
      ? await supabase.from("team_members").update(f).eq("id", initial.id)
      : await supabase.from("team_members").insert(f);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    onSaved();
  };

  return (
    <FormShell title={initial ? "Edit member" : "New member"} onClose={onClose}>
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        <Input label="Full name" value={f.full_name} onChange={(v) => setF({ ...f, full_name: v })} required />
        <Input label="Role" value={f.role} onChange={(v) => setF({ ...f, role: v })} required />
        <Input label="Photo URL" value={f.photo_url} onChange={(v) => setF({ ...f, photo_url: v })} className="md:col-span-2" />
        <Input label="Email" value={f.email} onChange={(v) => setF({ ...f, email: v })} />
        <Input label="Phone" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
        <Textarea label="Bio" value={f.bio} onChange={(v) => setF({ ...f, bio: v })} className="md:col-span-2" />
        <Input label="Sort order" value={String(f.sort_order)} onChange={(v) => setF({ ...f, sort_order: parseInt(v) || 0 })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} /> Active</label>
        <div className="md:col-span-2 flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
          <button disabled={saving} className="rounded-md bg-navy px-4 py-2 text-sm text-navy-foreground disabled:opacity-60">{saving ? "Saving..." : "Save"}</button>
        </div>
      </form>
    </FormShell>
  );
}

// ============ BLOG ============
function BlogAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "blog"],
    queryFn: async () => (await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const remove = async (id: string) => {
    if (!confirm("Delete post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "blog"] });
    qc.invalidateQueries({ queryKey: ["blog", "published"] });
  };

  return (
    <div>
      <SectionHeader title="Blog" subtitle="Publish market updates and news." onAdd={() => { setEditing(null); setShowForm(true); }} />
      {showForm && <BlogForm initial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); qc.invalidateQueries({ queryKey: ["admin", "blog"] }); qc.invalidateQueries({ queryKey: ["blog", "published"] }); }} />}
      {isLoading ? <Loading /> : (
        <div className="rounded-xl border bg-background divide-y">
          {data.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No posts yet.</div>}
          {data.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.published ? "Published" : "Draft"} · /{p.slug}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(p); setShowForm(true); }}><Edit className="h-4 w-4 text-navy" /></button>
                <button onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BlogForm({ initial, onClose, onSaved }: { initial: any; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    excerpt: initial?.excerpt ?? "",
    body: initial?.body ?? "",
    cover_image_url: initial?.cover_image_url ?? "",
    author_name: initial?.author_name ?? "Moxie Team",
    published: initial?.published ?? false,
  });
  const [saving, setSaving] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = f.slug || f.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const payload: any = { ...f, slug };
    if (f.published && !initial?.published_at) payload.published_at = new Date().toISOString();
    const { error } = initial
      ? await supabase.from("blog_posts").update(payload).eq("id", initial.id)
      : await supabase.from("blog_posts").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    onSaved();
  };
  return (
    <FormShell title={initial ? "Edit post" : "New post"} onClose={onClose}>
      <form onSubmit={submit} className="grid gap-3">
        <Input label="Title" value={f.title} onChange={(v) => setF({ ...f, title: v })} required />
        <Input label="Slug (auto)" value={f.slug} onChange={(v) => setF({ ...f, slug: v })} />
        <Input label="Author" value={f.author_name} onChange={(v) => setF({ ...f, author_name: v })} />
        <Input label="Cover image URL" value={f.cover_image_url} onChange={(v) => setF({ ...f, cover_image_url: v })} />
        <Textarea label="Excerpt" value={f.excerpt} onChange={(v) => setF({ ...f, excerpt: v })} />
        <Textarea label="Body" value={f.body} onChange={(v) => setF({ ...f, body: v })} className="min-h-64" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} /> Published</label>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
          <button disabled={saving} className="rounded-md bg-navy px-4 py-2 text-sm text-navy-foreground disabled:opacity-60">{saving ? "Saving..." : "Save"}</button>
        </div>
      </form>
    </FormShell>
  );
}

// ============ TESTIMONIALS ============
function TestimonialsAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "testi"],
    queryFn: async () => (await supabase.from("testimonials").select("*").order("sort_order")).data ?? [],
  });
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const remove = async (id: string) => {
    if (!confirm("Delete testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "testi"] });
    qc.invalidateQueries({ queryKey: ["testimonials"] });
  };
  return (
    <div>
      <SectionHeader title="Testimonials" subtitle="Client testimonials shown on the home page." onAdd={() => { setEditing(null); setShowForm(true); }} />
      {showForm && <TestiForm initial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); qc.invalidateQueries({ queryKey: ["admin", "testi"] }); qc.invalidateQueries({ queryKey: ["testimonials"] }); }} />}
      {isLoading ? <Loading /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((t) => (
            <div key={t.id} className="rounded-xl border bg-background p-5">
              <div className="flex items-start justify-between">
                <div className="font-serif text-lg text-navy">{t.client_name}</div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(t); setShowForm(true); }}><Edit className="h-4 w-4 text-navy" /></button>
                  <button onClick={() => remove(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></button>
                </div>
              </div>
              <p className="mt-2 text-sm italic text-muted-foreground">"{t.quote}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function TestiForm({ initial, onClose, onSaved }: { initial: any; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({
    client_name: initial?.client_name ?? "",
    client_title: initial?.client_title ?? "",
    quote: initial?.quote ?? "",
    rating: initial?.rating ?? 5,
    published: initial?.published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = initial
      ? await supabase.from("testimonials").update(f).eq("id", initial.id)
      : await supabase.from("testimonials").insert(f);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    onSaved();
  };
  return (
    <FormShell title={initial ? "Edit testimonial" : "New testimonial"} onClose={onClose}>
      <form onSubmit={submit} className="grid gap-3">
        <Input label="Client name" value={f.client_name} onChange={(v) => setF({ ...f, client_name: v })} required />
        <Input label="Client title / role" value={f.client_title} onChange={(v) => setF({ ...f, client_title: v })} />
        <Textarea label="Quote" value={f.quote} onChange={(v) => setF({ ...f, quote: v })} required />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} /> Published</label>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
          <button disabled={saving} className="rounded-md bg-navy px-4 py-2 text-sm text-navy-foreground disabled:opacity-60">{saving ? "Saving..." : "Save"}</button>
        </div>
      </form>
    </FormShell>
  );
}

// ============ INQUIRIES ============
function InquiriesAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "inquiries"],
    queryFn: async () => (await supabase.from("inquiries").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const setStatus = async (id: string, status: string) => {
    await supabase.from("inquiries").update({ status }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "inquiries"] });
  };
  return (
    <div>
      <SectionHeader title="Inquiries" subtitle="Messages from the contact form." />
      {isLoading ? <Loading /> : (
        <div className="space-y-3">
          {data.length === 0 && <Empty label="No inquiries yet." />}
          {data.map((i) => (
            <div key={i.id} className="rounded-xl border bg-background p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">{i.name} <span className="text-muted-foreground text-sm">· {i.email}</span></div>
                  {i.phone && <div className="text-sm text-muted-foreground">{i.phone}</div>}
                  <div className="text-xs text-muted-foreground mt-1">{new Date(i.created_at).toLocaleString()}</div>
                </div>
                <select value={i.status} onChange={(e) => setStatus(i.id, e.target.value as any)} className="h-9 rounded-md border px-2 text-xs">
                  <option value="new">New</option>
                  <option value="in_progress">In progress</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <p className="mt-3 text-sm whitespace-pre-line">{i.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ BOOKINGS ============
function BookingsAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: async () => (await supabase.from("inspection_bookings").select("*, listings(title,slug)").order("preferred_date", { ascending: true })).data ?? [],
  });
  const setStatus = async (id: string, status: string) => {
    await supabase.from("inspection_bookings").update({ status }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
  };
  return (
    <div>
      <SectionHeader title="Site inspections" subtitle="Inspection bookings from listing pages." />
      {isLoading ? <Loading /> : (
        <div className="overflow-hidden rounded-xl border bg-background">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Property</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No bookings yet.</td></tr>}
              {data.map((b: any) => (
                <tr key={b.id} className="border-t">
                  <td className="p-3">{b.name}</td>
                  <td className="p-3">{b.listings?.title ?? "—"}</td>
                  <td className="p-3">{b.preferred_date}</td>
                  <td className="p-3 text-muted-foreground">{b.phone}<br/><span className="text-xs">{b.email}</span></td>
                  <td className="p-3">
                    <select value={b.status} onChange={(e) => setStatus(b.id, e.target.value as any)} className="h-9 rounded-md border px-2 text-xs">
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============ USERS ============
function UsersAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const [profRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("user_roles").select("*"),
      ]);
      const profiles = profRes.data ?? [];
      const roles = rolesRes.data ?? [];
      return profiles.map((p) => ({ ...p, roles: roles.filter((r) => r.user_id === p.id).map((r) => r.role) }));
    },
  });

  const addRole = async (userId: string, role: "admin" | "editor" | "client") => {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) return toast.error(error.message);
    toast.success(`Granted ${role}`);
    qc.invalidateQueries({ queryKey: ["admin", "users"] });
  };
  const removeRole = async (userId: string, role: string) => {
    await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
    qc.invalidateQueries({ queryKey: ["admin", "users"] });
  };

  return (
    <div>
      <SectionHeader title="Users & roles" subtitle="Promote or revoke admin/editor access." />
      {isLoading ? <Loading /> : (
        <div className="space-y-3">
          {data.length === 0 && <Empty label="No registered users yet." />}
          {data.map((u: any) => (
            <div key={u.id} className="rounded-xl border bg-background p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-medium">{u.full_name || "Unnamed user"}</div>
                <div className="text-xs text-muted-foreground">{u.id}</div>
                <div className="mt-2 flex gap-1 flex-wrap">
                  {u.roles.map((r: string) => (
                    <span key={r} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs">
                      {r}
                      <button onClick={() => removeRole(u.id, r as any)} className="text-destructive">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                {(["admin", "editor", "client"] as const).map((r) => (
                  <button key={r} onClick={() => addRole(u.id, r)} className="rounded-md border px-3 py-1.5 text-xs hover:bg-secondary">+ {r}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ shared ============
function SectionHeader({ title, subtitle, onAdd }: { title: string; subtitle?: string; onAdd?: () => void }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl text-navy">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {onAdd && (
        <button onClick={onAdd} className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm text-navy-foreground hover:bg-navy/90">
          <Plus className="h-4 w-4" /> New
        </button>
      )}
    </div>
  );
}
function Loading() { return <div className="flex justify-center p-10"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>; }
function Empty({ label }: { label: string }) { return <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">{label}</div>; }
function FormShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-xl border bg-background p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-xl text-navy">{title}</h2>
        <button onClick={onClose} className="text-sm text-muted-foreground hover:text-navy">Close</button>
      </div>
      {children}
    </div>
  );
}
function Input({ label, value, onChange, required, className = "" }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}{required && " *"}</span>
      <input required={required} value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-gold" />
    </label>
  );
}
function Textarea({ label, value, onChange, required, className = "" }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}{required && " *"}</span>
      <textarea required={required} value={value} onChange={(e) => onChange(e.target.value)} className={`min-h-24 w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:border-gold ${className}`} />
    </label>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-gold">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
