import Link from "next/link";
import { HeartHandshake } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { Separator } from "@/components/ui/separator";
import { footerLinkGroups, siteConfig } from "@/lib/site-config";

function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <Container className="py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2">
            {footerLinkGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-medium text-foreground">
                  {group.title}
                </h3>
                <ul className="mt-3 flex flex-col gap-2">
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
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <div className="flex items-start gap-2 rounded-lg bg-background px-3 py-2 text-xs text-muted-foreground ring-1 ring-border">
            <HeartHandshake
              className="mt-0.5 size-3.5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span>
              If you&apos;re in crisis or thinking about harming yourself,
              please contact your local emergency services or a crisis
              helpline right away.
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export { Footer };
