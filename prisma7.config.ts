import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

loadEnv({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations need a direct (non-pooled) connection; the pooled
    // DATABASE_URL is used by the Prisma Client runtime instead.
    url: process.env.DATABASE_URL_UNPOOLED,
  },
});
