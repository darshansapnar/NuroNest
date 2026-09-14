"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Show, UserButton } from "@clerk/nextjs";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { mainNavLinks } from "@/lib/site-config";
import { cn } from "@/lib/utils";

function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav
          className="hidden items-center gap-1.5 lg:flex"
          aria-label="Primary"
        >
          {mainNavLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#E2E6DD] text-[#1C352D] font-medium shadow-xs"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="hidden sm:inline-flex rounded-full text-foreground/80 hover:text-foreground"
          >
            <Search aria-hidden="true" className="size-4" />
          </Button>
          <Show
            when="signed-in"
            fallback={
              <>
                <Button
                  variant="ghost"
                  className="hidden sm:inline-flex"
                  nativeButton={false}
                  render={<Link href="/login" />}
                >
                  Log In
                </Button>
                <Button
                  className="hidden sm:inline-flex rounded-full px-5 bg-[#233E33] hover:bg-[#1A3027] text-white"
                  nativeButton={false}
                  render={<Link href="/sign-up" />}
                >
                  Get Started
                </Button>
              </>
            }
          >
            <Button
              variant="ghost"
              className="hidden sm:inline-flex"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              Dashboard
            </Button>
            <UserButton />
          </Show>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}

export { Navbar };

