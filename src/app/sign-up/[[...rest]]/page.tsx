import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-muted px-4 py-16">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/login"
        fallbackRedirectUrl="/dashboard"
      />
    </section>
  );
}
