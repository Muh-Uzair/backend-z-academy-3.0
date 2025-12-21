import { z } from "zod";

// Enum for roles (jaise student, instructor, academy)
export const UserRoleEnum = z.enum(["student", "instructor", "academy"]);

// Base Zod schema for user input validation (e.g., signup)
export const UserStudentSignup = z.object({
  email: z.string().email({ message: "Invalid email address" }).toLowerCase(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100),
  role: UserRoleEnum, // Required, taake signup pe role specify ho
});

// Infer types for TS
export type UserStudentSignupType = z.infer<typeof UserStudentSignup>;
export type UserRoles = z.infer<typeof UserRoleEnum>;
