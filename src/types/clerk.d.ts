export {};

declare global {
  /**
   * Augments Clerk's session claims with our custom `metadata` claim.
   *
   * This claim only appears on `auth().sessionClaims` if the Clerk Dashboard
   * session token is configured to include it — see the "Clerk dashboard
   * steps" note left with the authentication implementation. Until that's
   * configured, `sessionClaims?.metadata` is simply `undefined`, and role
   * checks safely fall back to the default "user" role.
   */
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: import("@/lib/auth/roles").AppRole;
    };
  }
}
