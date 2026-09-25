import Image from "next/image";
import { Leaf } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { RelaxationSidebarNav } from "@/components/relaxation/relaxation-sidebar-nav";

function RelaxationSidebar() {
  return (
    <aside className="relative hidden h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-border/60 bg-background lg:flex">
      <Image
        src="/images/left-sidebar.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="256px"
        priority
        className="object-cover"
      />

      <div className="relative z-10 flex h-full flex-col gap-6 overflow-y-auto px-5 py-6">
        <Logo />

        <RelaxationSidebarNav />

        <div className="mt-auto flex flex-col gap-2 rounded-2xl bg-white/70 p-4 backdrop-blur-sm">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Leaf className="size-4" aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold text-foreground">
            Take a moment
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            You&apos;re doing great. Keep going.
          </p>
        </div>
      </div>
    </aside>
  );
}

export { RelaxationSidebar };
