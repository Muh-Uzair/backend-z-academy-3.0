import { z } from "zod";

// Enum for roles (jaise student, instructor, academy)
export const UserRoleEnum = z.enum(["student", "instructor", "academy"]);

// Base Zod schema for user input validation (e.g., signup)
export const AuthStudentSignup = z
  .object({
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
  })
  .strict();

export const ZodSchemaVerifyOtp = z
  .object({
    email: z.string().email({ message: "Invalid email address" }).toLowerCase(),
    role: UserRoleEnum,
    otp: z.number().min(100000).max(999999),
  })
  .strict();
