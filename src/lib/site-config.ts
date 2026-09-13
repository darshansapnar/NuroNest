export const siteConfig = {
  name: "NuroNest",
  tagline: "AI-powered mental wellness companion",
  description:
    "NuroNest is a calm, private space to talk through how you're feeling, take wellness screenings, relax, and find support — no account required to start.",
} as const;

export type NavLink = {
  label: string;
  href: string;
};

export const mainNavLinks: NavLink[] = [
  { label: "AI Companion", href: "/ai-companion" },
  { label: "Assessment", href: "/assessment" },
  { label: "Relaxation", href: "/relaxation" },
  { label: "Professionals", href: "/professionals" },
  { label: "Resources", href: "/resources" },
];

export const footerLinkGroups: { title: string; links: NavLink[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "AI Companion", href: "/ai-companion" },
      { label: "Mental Health Assessment", href: "/assessment" },
      { label: "Relaxation Hub", href: "/relaxation" },
      { label: "Find a Professional", href: "/professionals" },
      { label: "Wellness Resources", href: "/resources" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];
