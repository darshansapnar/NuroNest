"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { relaxationSidebarLinks } from "@/data/relaxation";
import { cn } from "@/lib/utils";

function RelaxationSidebarNav({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Relaxation Hub"
      className={cn("flex flex-col gap-1", className)}
    >
      {relaxationSidebarLinks.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname?.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
            )}
          >
            <link.icon className="size-4.5 shrink-0" aria-hidden="true" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export { RelaxationSidebarNav };
