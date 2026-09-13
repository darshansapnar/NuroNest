import { SignIn } from "@clerk/nextjs";

import { Container } from "@/components/layout/container";

export default function AdminLoginPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-muted px-4 py-16">
      <Container className="flex max-w-md flex-col items-center gap-6 px-0">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-sm font-medium tracking-wide text-primary uppercase">
            Admin
          </span>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Sign in to the admin console
          </h1>
          <p className="text-sm text-muted-foreground">
            Admin accounts are provisioned internally. There is no public
            admin registration.
          </p>
        </div>

        <SignIn
          path="/admin/login"
          routing="path"
          fallbackRedirectUrl="/admin"
          appearance={{ elements: { footerAction: { display: "none" } } }}
        />
      </Container>
    </section>
  );
}
