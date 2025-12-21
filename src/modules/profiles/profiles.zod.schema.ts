import { z } from "zod";

// Base Zod schema for user input validation (e.g., signup)
export const ProfileStudentSignupType = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(100, { message: "Full name too long" }),
});

// Infer types for TS
export type UserSignupInput = z.infer<typeof ProfileStudentSignupType>;
