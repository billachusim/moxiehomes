export const SITE = {
  name: "Moxie Homes & Properties",
  fullName: "Moxie Homes And Properties Limited",
  tagline: "Utmost trust and credibility in real estate investment.",
  phone: "0814 390 0780",
  phoneHref: "tel:+2348143900780",
  address: "Suite E1, Victory Plaza, 7 Onitsha Crescent, Off Gimbiya Street, Area 11, Garki, Abuja.",
  domain: "moxiehomesandproperties.com",
  emails: {
    info: "info@moxiehomesandproperties.com",
    inspections: "inspections@moxiehomesandproperties.com",
  },
  emailContacts: [
    { label: "General inquiries", address: "info@moxiehomesandproperties.com" },
    { label: "Site inspections", address: "inspections@moxiehomesandproperties.com" },
  ],
  socials: {
    instagram: "https://instagram.com/moxiehomesandpropertiesltd_",
    facebook: "https://www.facebook.com/share/19dpYR6mvU/?mibextid=wwXIfr",
    tiktok: "https://www.tiktok.com/@moxiehomesandproperties",
  },
  vision:
    "To become the leading and most trusted innovative real estate investment company in Nigeria by deploying highly trained and experienced professionals — making home ownership affordable and accessible to all, and securing a better future for our teeming clients.",
  mission:
    "To be at the forefront in meeting the real estate needs of our clients with utmost trust and credibility, providing genuine, affordable, and exquisite homes, infrastructures, and amenities by deploying highly trained and experienced professionals — helping our investors attain their dream of a secured future through real estate.",
  coreValues: [
    { name: "Trust", desc: "We earn it, then we keep it." },
    { name: "Integrity", desc: "Honest dealings, genuine titles." },
    { name: "Excellence", desc: "Exquisite homes and premium estates." },
    { name: "Accountability", desc: "We own outcomes, not excuses." },
    { name: "Professionalism", desc: "Trained, experienced, disciplined." },
  ],
};

export function youtubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([A-Za-z0-9_-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}
