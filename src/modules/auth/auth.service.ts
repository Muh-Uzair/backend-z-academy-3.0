// src/modules/auth/auth.service.ts

import bcrypt from "bcrypt";
import UserModel, { IUser } from "../users/users.model";
import ProfileModel from "../profiles/profiles.model";
import { sendOTPEmail } from "@/lib/email.service";
import {
  AuthStudentSignupType,
  ZodSchemaSignInType,
  ZodSchemaVerifyOtpType,
} from "./auth.types"; // ya direct zod type use karo
import {
  generateAccessToken,
  generateOtp,
  generateRefreshToken,
  storeRefreshToken,
} from "@/modules/auth/auth.utils";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";

// FUNCTION
export const studentSignupService = async (reqBody: AuthStudentSignupType) => {
  // 1: Check if user already exists
  const existingUser = await UserModel.findOne({ email: reqBody.email });
  if (existingUser) {
    throw new Error("User already exists"); // ya custom AppError use karo
  }

  // 2: Hash password
  const hashedPassword = await bcrypt.hash(reqBody.password, 12);

  // 3: Generate OTP
  const otp = generateOtp();

  // 4: Create user and profile (you can wrap it in a transaction)
  const newUser = await UserModel.create({
    email: reqBody.email,
    password: hashedPassword,
    role: reqBody.role,
    otp,
    otpExpiry: Date.now() + 10 * 60 * 1000,
  });

  await ProfileModel.create({
    userId: newUser._id,
    fullName: reqBody.fullName,
  });

  // 5: Send OTP email
  await sendOTPEmail({ to: reqBody.email, otp });

  // 6: Return only what controller needs
  return {
    email: newUser.email,
  };
};

// FUNCTION
export const verifyOtpService = async (reqBody: ZodSchemaVerifyOtpType) => {
  const user = await UserModel.findOne({
    email: reqBody.email,
    role: reqBody.role,
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.otpExpiry || new Date(user.otpExpiry) < new Date()) {
    throw new Error("OTP has expired");
  }

  if (user.otp !== reqBody.otp) {
    throw new Error("Invalid OTP");
  }

  user.otp = null;
  user.otpExpiry = null;
  user.isEmailVerified = true;

  await user.save();

  return {};
};

// FUNCTION
export const signInService = async (
  reqBody: ZodSchemaSignInType
): Promise<{ accessToken: string; refreshToken: string; user: IUser }> => {
  // 1 : take data out
  const { email, password } = reqBody;

  // 2 : check if user exists
  const user = await UserModel.findOne({ email, isEmailVerified: true });

  if (!user) {
    throw new Error("User not found");
  }

  // 3: check if the password is correct by comparing
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // 4 : manage generate access and refresh token and saving refresh token to DB
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await storeRefreshToken(user, refreshToken);

  // 5 : return the access token and refresh token
  return {
    accessToken,
    refreshToken,
    user,
  };
};

// FUNCTION
export const rotateTokenService = async (data: {
  refreshToken: string;
}): Promise<{
  newAccessToken: string;
  newRefreshToken: string;
  user: IUser;
}> => {
  // 3 : verify token
  const verified = jwt.verify(data.refreshToken, env.REFRESH_TOKEN_SECRET) as {
    userId: string;
    email: string;
    role: string;
  };

  // 4 : find user
  const user = await UserModel.findById(verified?.userId);
  if (!user) {
    throw new Error("User not found");
  }

  // 5 : check if refresh token exists in db
  const hashedToken = await bcrypt.hash(data.refreshToken, 10);
  const tokenExists = user.refreshTokens?.some((t) => t.token === hashedToken);
  if (!tokenExists) {
    throw new Error("Refresh token not found");
  }

  // 6: manage generate access and refresh token and saving refresh token to DB
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);
  await storeRefreshToken(user, newRefreshToken);

  // 7 : Remove old hashed token
  user.refreshTokens?.filter((t) => t.token !== hashedToken);
  await user.save();

  // 8 : return the response
  return {
    newAccessToken,
    newRefreshToken,
    user,
  };
};

// FUNCTION
export const signoutService = async (data: {
  refreshToken: string;
}): Promise<void> => {
  // 1 : take refresh token out
  const { refreshToken } = data;
  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  // 2 : verify the token
  const decode = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET) as {
    userId: string;
    email: string;
    role: string;
  };
  const user = await UserModel.findById(decode.userId);
  if (!user) {
    throw new Error("User not found");
  }

  // 3 : remove that refresh token from db
  const hashedToken = await bcrypt.hash(refreshToken, 10);
  user.refreshTokens = user.refreshTokens.filter(
    (val) => val.token !== hashedToken
  ) as [{ token: string | null; refreshCreatedAt: Date | null }];
  await user.save();

  return;
};
