import { SignIn } from "@clerk/nextjs";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const { redirect_url: redirectUrl } = await searchParams;

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-muted px-4 py-16">
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/sign-up"
        fallbackRedirectUrl={redirectUrl || "/dashboard"}
      />
    </section>
  );
}
