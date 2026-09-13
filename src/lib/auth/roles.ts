/**
 * NuroNest's application-level roles. These are independent of Clerk
 * Organizations — every user belongs to exactly one of these roles, stored
 * in their Clerk `publicMetadata.role`.
 */
export type AppRole = "user" | "professional" | "admin";

export const APP_ROLES = {
  USER: "user",
  PROFESSIONAL: "professional",
  ADMIN: "admin",
} as const satisfies Record<string, AppRole>;

export const DEFAULT_APP_ROLE: AppRole = APP_ROLES.USER;
