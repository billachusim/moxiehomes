import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Phone } from "lucide-react";
import logo from "@/assets/moxie-logo-real.jpg.asset.json";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-navy text-navy-foreground">
      <div className="container-page grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logo.url} alt="" className="h-14 w-auto rounded" />
            <div>
              <div className="font-serif text-xl">Moxie Homes & Properties</div>
              <div className="text-[0.65rem] uppercase tracking-[0.25em] text-gold">
                Trust · Integrity · Excellence
              </div>
            </div>
          </div>
          <p className="mt-6 max-w-md text-sm text-white/70">
            {SITE.tagline} Genuine, affordable, and exquisite homes across Nigeria.
          </p>
          <a
            href={SITE.phoneHref}
            className="mt-6 inline-flex items-center gap-2 text-gold hover:text-white transition-colors"
          >
            <Phone className="h-4 w-4" /> {SITE.phone}
          </a>
        </div>

        <div>
          <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">Explore</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/listings" className="hover:text-gold">Listings</Link></li>
            <li><Link to="/about" className="hover:text-gold">About</Link></li>
            <li><Link to="/team" className="hover:text-gold">Team</Link></li>
            <li><Link to="/blog" className="hover:text-gold">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">Connect</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <a href={SITE.socials.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-gold">
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            </li>
            <li>
              <a href={SITE.socials.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-gold">
                <Facebook className="h-4 w-4" /> Facebook
              </a>
            </li>
            <li>
              <a href={SITE.socials.tiktok} target="_blank" rel="noreferrer" className="hover:text-gold">
                TikTok
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col md:flex-row items-center justify-between gap-3 py-5 text-xs text-white/50">
          <div>© {new Date().getFullYear()} {SITE.fullName}. All rights reserved.</div>
          <div className="md:text-right md:max-w-md">{SITE.address}</div>
        </div>
      </div>
    </footer>
  );
}
