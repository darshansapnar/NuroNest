import "server-only";

import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { DEFAULT_APP_ROLE, type AppRole } from "./roles";

/**
 * Ensures the current request has an authenticated Clerk session.
 * Redirects to `signInPath` when signed out.
 *
 * Use for routes any authenticated user (regardless of role) may access,
 * such as `/ai-companion` or `/dashboard`.
 */
export async function requireUser(signInPath = "/login") {
  const { userId } = await auth();

  if (!userId) {
    redirect(signInPath);
  }

  return userId;
}

/**
 * Ensures the current request is authenticated AND has the given app role.
 *
 * - Signed out -> redirect to `signInPath`.
 * - Signed in but wrong role -> `notFound()` (404), mirroring Clerk's own
 *   `auth.protect()` behavior so an authenticated user can't distinguish
 *   "doesn't exist" from "exists but you're not allowed in".
 *
 * The role itself is read from `sessionClaims.metadata.role`, which is only
 * populated once the Clerk Dashboard session token is configured to include
 * the user's public metadata (see project README / setup notes). Until then,
 * every signed-in user resolves to the default "user" role, so admin/
 * professional areas fail closed rather than open.
 */
export async function requireRole(role: AppRole, signInPath: string) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect(signInPath);
  }

  const currentRole: AppRole = sessionClaims?.metadata?.role ?? DEFAULT_APP_ROLE;

  if (currentRole !== role) {
    notFound();
  }

  return { userId, role: currentRole };
}
