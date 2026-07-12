import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Instagram, Facebook, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Moxie Homes & Properties" },
      { name: "description", content: `Talk to our team. Call ${SITE.phone} or send us a message.` },
      { property: "og:title", content: "Contact Moxie Homes" },
      { property: "og:description", content: "Talk to our team about property inquiries and site inspections." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("inquiries").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      message: form.message,
    });
    setSubmitting(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Message sent. We'll get back to you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <SiteLayout>
      <section className="bg-cream py-20">
        <div className="container-page">
          <div className="text-xs uppercase tracking-[0.25em] text-gold">Get in touch</div>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl text-navy">Let's talk properties.</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Whether you're ready to invest or want to know more, our team is a call away.
          </p>
        </div>
      </section>

      <section className="container-page py-16 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-border p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-gold">Call us</div>
            <a href={SITE.phoneHref} className="mt-2 flex items-center gap-2 font-serif text-2xl text-navy hover:text-gold">
              <Phone className="h-5 w-5" /> {SITE.phone}
            </a>
          </div>
          <div className="rounded-xl border border-border p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-gold">Email us</div>
            <ul className="mt-3 space-y-2 text-sm">
              {SITE.emailContacts.map((e) => (
                <li key={e.address} className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-1 text-gold shrink-0" />
                  <div>
                    <a href={`mailto:${e.address}`} className="text-navy hover:text-gold break-all">{e.address}</a>
                    <div className="text-xs text-muted-foreground">{e.label}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-gold">Visit us</div>
            <div className="mt-2 flex items-start gap-2 text-navy">
              <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-gold" />
              <span className="leading-relaxed">{SITE.address}</span>
            </div>
          </div>
          <div className="rounded-xl border border-border p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-gold">Follow us</div>
            <div className="mt-4 space-y-2">
              <a href={SITE.socials.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-navy hover:text-gold">
                <Instagram className="h-4 w-4" /> @moxiehomesandpropertiesltd_
              </a>
              <a href={SITE.socials.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-navy hover:text-gold">
                <Facebook className="h-4 w-4" /> Moxie Homes and Properties Ltd
              </a>
              <a href={SITE.socials.tiktok} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-navy hover:text-gold">
                <Mail className="h-4 w-4" /> TikTok · @moxiehomesandproperties
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-2 rounded-xl border border-border p-8 space-y-4">
          <h2 className="font-serif text-3xl text-navy">Send a message</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-gold" />
            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-gold" />
          </div>
          <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-gold" />
          <textarea required placeholder="How can we help?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="min-h-40 w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:border-gold" />
          <button disabled={submitting} className="rounded-md bg-navy px-6 py-3 text-sm font-medium text-navy-foreground hover:bg-navy/90 disabled:opacity-60">
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}
