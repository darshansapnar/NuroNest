import Link from "next/link";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Leaf className="size-5" aria-hidden="true" />
      </span>
      <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
        {siteConfig.name}
      </span>
    </Link>
  );
}

export { Logo };
