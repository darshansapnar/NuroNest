"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { mainNavLinks } from "@/lib/site-config";
import { Logo } from "@/components/layout/logo";

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Open menu" className="lg:hidden" />
        }
      >
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="right" className="w-3/4 px-0">
        <SheetHeader className="px-4">
          <SheetTitle render={<Logo />} />
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
          {mainNavLinks.map((link) => (
            <SheetClose
              key={link.href}
              nativeButton={false}
              render={<Link href={link.href} />}
              className="block rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted"
            >
              {link.label}
            </SheetClose>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t border-border px-4 py-4">
          <SheetClose
            render={<Button size="lg" className="w-full" />}
          >
            Get Started
          </SheetClose>
          <SheetClose
            render={<Button variant="outline" size="lg" className="w-full" />}
          >
            Log In
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { MobileNav };
