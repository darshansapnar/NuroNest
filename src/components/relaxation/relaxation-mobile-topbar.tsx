"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/layout/logo";
import { RelaxationSidebarNav } from "@/components/relaxation/relaxation-sidebar-nav";

function RelaxationMobileTopbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur-md lg:hidden">
      <Logo />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Open navigation" />
          }
        >
          <Menu aria-hidden="true" />
        </SheetTrigger>
        <SheetContent side="left" className="w-3/4 px-0">
          <SheetHeader className="px-4">
            <SheetTitle render={<Logo />} />
          </SheetHeader>
          <RelaxationSidebarNav
            onNavigate={() => setOpen(false)}
            className="px-4"
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export { RelaxationMobileTopbar };
