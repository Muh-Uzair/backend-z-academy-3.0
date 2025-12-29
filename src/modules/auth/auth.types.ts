import { z } from "zod";
import {
  AuthStudentSignup,
  ZodSchemaSignIn,
  ZodSchemaVerifyOtp,
} from "./auth.zod.schema";

export type AuthStudentSignupType = z.infer<typeof AuthStudentSignup>;
export type ZodSchemaVerifyOtpType = z.infer<typeof ZodSchemaVerifyOtp>;
export type ZodSchemaSignInType = z.infer<typeof ZodSchemaSignIn>;
