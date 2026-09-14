import { requireUser } from "@/lib/auth/protect";
import { NuroApp } from "@/components/nuro/nuro-app";

export default async function AiCompanionPage() {
  await requireUser("/login?redirect_url=/ai-companion");

  return <NuroApp />;
}
