import { env } from "@/config/env";
import { IUser } from "@/modules/users/users.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};

export const generateAccessToken = (user: IUser): string => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role }, // Payload: keep minimal
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRY }
  );
};

export const generateRefreshToken = (user: IUser): string => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Function to hash and store refresh token in DB
export const storeRefreshToken = async (
  user: IUser,
  refreshToken: string
): Promise<void> => {
  const hashedToken: string = await bcrypt.hash(refreshToken, 10); // Hash for security
  user.refreshTokens?.push({
    token: hashedToken,
    refreshCreatedAt: new Date(Date.now()),
  });
  await user.save();
};
