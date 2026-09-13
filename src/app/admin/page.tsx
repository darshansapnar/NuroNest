import { requireRole } from "@/lib/auth/protect";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

export default async function AdminPortalPage() {
  const { userId, role } = await requireRole("admin", "/admin/login");

  return (
    <PlaceholderPage
      eyebrow="Admin"
      title="Admin console"
      description={`Signed in as ${userId} (role: ${role}). The admin console is coming soon. This page only exists right now to verify that admin-only routes are protected correctly.`}
    />
  );
}
