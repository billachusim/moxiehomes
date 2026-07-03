import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/moxie-logo.png.asset.json";
import { SITE } from "@/lib/site";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/listings", label: "Listings" },
  { to: "/about", label: "About" },
  { to: "/team", label: "Team" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo.url} alt={SITE.name} className="h-10 w-auto" />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-serif text-lg text-navy">Moxie Homes</span>
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
              & Properties Ltd
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-foreground/80 hover:text-navy transition-colors"
              activeProps={{ className: "text-navy gold-underline" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {signedIn ? (
            <Link
              to="/admin"
              className="text-sm font-medium text-navy hover:text-gold transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/auth"
              className="text-sm font-medium text-navy hover:text-gold transition-colors"
            >
              Sign in
            </Link>
          )}
          <Link
            to="/contact"
            className="inline-flex items-center rounded-md bg-navy px-4 py-2 text-sm font-medium text-navy-foreground hover:bg-navy/90 transition-colors"
          >
            Book inspection
          </Link>
        </div>

        <button
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-page py-4 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                activeProps={{ className: "bg-secondary text-navy" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {signedIn ? (
                <Link
                  to="/admin"
                  className="flex-1 rounded-md border border-navy px-3 py-2 text-center text-sm font-medium text-navy"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="flex-1 rounded-md border border-navy px-3 py-2 text-center text-sm font-medium text-navy"
                >
                  Sign in
                </Link>
              )}
              <Link
                to="/contact"
                className="flex-1 rounded-md bg-navy px-3 py-2 text-center text-sm font-medium text-navy-foreground"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
