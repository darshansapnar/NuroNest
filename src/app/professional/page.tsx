import { requireRole } from "@/lib/auth/protect";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

export default async function ProfessionalPortalPage() {
  const { userId, role } = await requireRole("professional", "/professional/login");

  return (
    <PlaceholderPage
      eyebrow="Professional Portal"
      title="Welcome back"
      description={`Signed in as ${userId} (role: ${role}). The professional dashboard is coming soon. This page only exists right now to verify that professional-only routes are protected correctly.`}
    />
  );
}
