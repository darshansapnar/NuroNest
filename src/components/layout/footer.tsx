"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartHandshake, Leaf } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { SocialLinks } from "@/components/layout/social-links";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { Separator } from "@/components/ui/separator";
import { footerLinkGroups, siteConfig } from "@/lib/site-config";

function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/relaxation")) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-muted/50">
      <Container className="py-12 sm:py-16">
        <div className="relative mb-12 overflow-hidden rounded-3xl border border-border/60 shadow-sm sm:mb-16">
          <Image
            src="/images/professional.png"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover object-right"
          />
          <div className="relative flex max-w-[70%] flex-col items-start gap-3 px-6 py-10 sm:max-w-[60%] sm:px-10 sm:py-14 lg:max-w-[55%]">
            <h3 className="font-heading max-w-sm text-balance text-2xl font-semibold text-foreground sm:text-3xl">
              A different kind of care, starts with the right people.
            </h3>
            <p className="text-base font-bold text-foreground sm:text-lg">
              Are you a mental health professional?
            </p>
            <Link
              href="/professional"
              className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline sm:text-base"
            >
              Join the NuroNest network →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              A calmer mind for a brighter you.
            </p>
            <SocialLinks />
          </div>

          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-heading text-sm font-semibold text-foreground">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground">
              Stay in touch
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Get wellness tips and updates.
            </p>
            <div className="mt-3">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        <p className="flex items-start justify-center gap-2 text-center text-xs text-muted-foreground">
          <HeartHandshake
            className="mt-0.5 size-3.5 shrink-0 text-primary"
            aria-hidden="true"
          />
          In crisis? Please contact local emergency services or a crisis
          helpline right away.
        </p>

        <div className="mt-6 flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Made for a kinder tomorrow.
            <Leaf className="size-3.5 text-primary" aria-hidden="true" />
          </p>
        </div>
      </Container>
    </footer>
  );
}

export { Footer };
