import { cn } from "@/lib/utils";
import { socialLinks } from "@/lib/site-config";

type IconName = (typeof socialLinks)[number]["icon"];

function SocialIcon({ name, className }: { name: IconName; className?: string }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "x":
      return (
        <svg {...props}>
          <path d="M18.24 3h3.05l-6.66 7.62L22.5 21h-6.13l-4.8-6.28L5.9 21H2.85l7.12-8.14L1.5 3h6.28l4.34 5.74L18.24 3Zm-1.07 16.17h1.69L7.02 4.74H5.2l11.97 14.43Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...props} fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...props}>
          <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3.25a1.97 1.97 0 1 0 0 3.94 1.97 1.97 0 0 0 0-3.94ZM20.5 20h-3.37v-5.9c0-1.4-.03-3.2-1.95-3.2-1.96 0-2.26 1.53-2.26 3.1V20H9.55V8.5h3.24v1.57h.05c.45-.85 1.56-1.75 3.2-1.75 3.42 0 4.46 2.25 4.46 5.18V20Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...props}>
          <path d="M22 12s0-3.18-.4-4.72a2.78 2.78 0 0 0-1.96-1.97C18.1 5 12 5 12 5s-6.1 0-7.64.31a2.78 2.78 0 0 0-1.96 1.97C2 8.82 2 12 2 12s0 3.18.4 4.72a2.78 2.78 0 0 0 1.96 1.97C5.9 19 12 19 12 19s6.1 0 7.64-.31a2.78 2.78 0 0 0 1.96-1.97C22 15.18 22 12 22 12Zm-12 2.73V9.27L15.27 12 10 14.73Z" />
        </svg>
      );
  }
}

function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          aria-label={link.label}
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground ring-1 ring-border transition-colors hover:bg-muted hover:text-foreground"
        >
          <SocialIcon name={link.icon} className="size-4" />
        </a>
      ))}
    </div>
  );
}

export { SocialLinks };
