import Link from "next/link";
import { Search } from "lucide-react";
import { Show, UserButton } from "@clerk/nextjs";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { mainNavLinks } from "@/lib/site-config";

function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {mainNavLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              nativeButton={false}
              render={<Link href={link.href} />}
            >
              {link.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="hidden sm:inline-flex"
          >
            <Search aria-hidden="true" />
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
                  className="hidden sm:inline-flex"
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
