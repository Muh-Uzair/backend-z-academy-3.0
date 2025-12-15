import { z } from "zod";

// Enum for roles (jaise student, instructor, academy)
export const UserRoleEnum = z.enum(["student", "instructor", "academy"]);

// Base Zod schema for user input validation (e.g., signup)
export const UserSignupSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(100, { message: "Full name too long" }),
  email: z.string().email({ message: "Invalid email address" }).toLowerCase(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100),
  role: UserRoleEnum, // Required, taake signup pe role specify ho
});

// Infer types for TS
export type UserSignupInput = z.infer<typeof UserSignupSchema>;
export type UserRoles = z.infer<typeof UserRoleEnum>;
