// src/modules/auth/auth.service.ts

import bcrypt from "bcrypt";
import UserModel from "../users/users.model";
import ProfileModel from "../profiles/profiles.model";
import { sendOTPEmail } from "@/lib/email.service";
import { AuthStudentSignupType, ZodSchemaVerifyOtpType } from "./auth.types"; // ya direct zod type use karo
import { generateOtp } from "@/utils/otp.utils";

export const studentSignupService = async (data: AuthStudentSignupType) => {
  // 1: Check if user already exists
  const existingUser = await UserModel.findOne({ email: data.email });
  if (existingUser) {
    throw new Error("User already exists"); // ya custom AppError use karo
  }

  // 2: Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // 3: Generate OTP
  const otp = generateOtp();

  // 4: Create user and profile (you can wrap it in a transaction)
  const newUser = await UserModel.create({
    email: data.email,
    password: hashedPassword,
    role: data.role,
    otp,
    otpExpiry: Date.now() + 10 * 60 * 1000,
  });

  await ProfileModel.create({
    userId: newUser._id,
    fullName: data.fullName,
  });

  // 5: Send OTP email
  await sendOTPEmail({ to: data.email, otp });

  // 6: Return only what controller needs
  return {
    email: newUser.email,
  };
};

export const verifyOtpService = async (data: ZodSchemaVerifyOtpType) => {
  const user = await UserModel.findOne({ email: data.email, role: data.role });

  if (!user) {
    throw new Error("User not found");
  }

  if (
    user.otp !== data.otp &&
    new Date(user.otpExpiry as Date) < new Date(Date.now())
  ) {
    throw new Error("Invalid OTP or OTP expired");
  }

  user.otp = null;
  user.isEmailVerified = true;
  user.otpExpiry = null;
  await user.save();

  return {};
};
