import { SignIn } from "@clerk/nextjs";

import { Container } from "@/components/layout/container";

export default function ProfessionalLoginPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-muted px-4 py-16">
      <Container className="flex max-w-md flex-col items-center gap-6 px-0">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-sm font-medium tracking-wide text-primary uppercase">
            Professional Portal
          </span>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Sign in to your professional account
          </h1>
          <p className="text-sm text-muted-foreground">
            Professional accounts are provisioned by the NuroNest team.
            Contact us if you need access.
          </p>
        </div>

        <SignIn
          path="/professional/login"
          routing="path"
          fallbackRedirectUrl="/professional"
          appearance={{ elements: { footerAction: { display: "none" } } }}
        />
      </Container>
    </section>
  );
}
