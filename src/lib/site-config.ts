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
  { label: "Home", href: "/" },
  { label: "Chat with Nuro", href: "/ai-companion" },
  { label: "Assessments", href: "/assessment" },
  { label: "Resources", href: "/resources" },
];

export const footerLinkGroups: { title: string; links: NavLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "AI Companion", href: "/ai-companion" },
      { label: "Assessments", href: "/assessment" },
      { label: "Relaxation Hub", href: "/relaxation" },
      { label: "Professionals", href: "/professionals" },
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const socialLinks = [
  { label: "Instagram", href: "#", icon: "instagram" as const },
  { label: "X", href: "#", icon: "x" as const },
  { label: "LinkedIn", href: "#", icon: "linkedin" as const },
  { label: "YouTube", href: "#", icon: "youtube" as const },
];
