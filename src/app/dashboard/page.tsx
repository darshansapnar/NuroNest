import { requireUser } from "@/lib/auth/protect";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

export default async function DashboardPage() {
  await requireUser("/login?redirect_url=/dashboard");

  return (
    <PlaceholderPage
      eyebrow="Dashboard"
      title="Your wellness dashboard"
      description="You're signed in — your personal dashboard is coming soon. This page only exists right now to verify that authenticated-user routes are protected correctly."
    />
  );
}
