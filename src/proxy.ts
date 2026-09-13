import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Next.js 16 renamed the `middleware` file convention to `proxy`; the
 * underlying request handler is unchanged. This only attaches the Clerk
 * session to every request so `auth()` works in Server Components, Route
 * Handlers, and Server Actions.
 *
 * It intentionally does NOT gate any routes by path here — Clerk's own
 * `createRouteMatcher` is deprecated in favor of resource-level checks
 * (see `src/lib/auth/protect.ts`), since path-based matching can drift
 * from how Next.js actually routes a request.
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params.
    "/((?!_next|.*\\..*).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
    // Clerk's Frontend API auto-proxy path (used automatically in production).
    "/__clerk/:path*",
  ],
};
