import { requireUser } from "@/lib/auth/protect";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

export default async function AiCompanionPage() {
  await requireUser("/login?redirect_url=/ai-companion");

  return (
    <PlaceholderPage
      eyebrow="AI Companion"
      title="Talk to Nuro"
      description="You're signed in — the AI Companion experience is coming soon. This page only exists right now to verify that authenticated-user routes are protected correctly."
    />
  );
}
