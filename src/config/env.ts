import "dotenv/config";
import { z } from "zod";

/**
 * Environment variable schema using Zod for type-safe validation.
 * Add more variables by extending this schema.
 *
 * Example:
 *   DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
 *   JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3000"),
  FRONT_END_URL: z.string().url().default("http://localhost:3000"),
  MONGO_DB_CONNECTION_STRING: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((err: z.ZodIssue) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");
      throw new Error(`Invalid environment variables:\n${errorMessages}`);
    }
    throw error;
  }
}

export const env = validateEnv();
export type { Env };
