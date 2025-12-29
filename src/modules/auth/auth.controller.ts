// src/modules/auth/auth.controller.ts

import { Request, Response, NextFunction } from "express";
import {
  rotateTokenService,
  signInService,
  signoutService,
  studentSignupService,
  verifyOtpService,
} from "./auth.service";
import { env } from "@/config/env";

// FUNCTION
export const studentSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 2: Delegate all business logic to service
    const result = await studentSignupService(req.body);

    // 3: Send clean success response
    res.status(200).json({
      status: "success",
      message: "OTP sent to your email. Please verify to complete signup.",
      data: result,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
      return;
    } else {
      res.status(500).json({
        status: "fail",
        message: "Error in sign up",
      });
    }
  }
};

// FUNCTION
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 3 : send response
    const result = await verifyOtpService(req.body);

    res.status(200).json({
      status: "success",
      message: "OTP verified successfully",
      data: result,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
      return;
    } else {
      res.status(500).json({
        status: "fail",
        message: "Error in verifying otp",
      });
    }
  }
};

// FUNCTION
export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1 : send control to service
    const result = await signInService(req.body);

    if (!result.accessToken || !result.refreshToken) {
      throw new Error("Error in sign in");
    }

    // 5 : send cookies
    if (env.NODE_ENV === "production") {
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production", // True in prod for HTTPS
        sameSite: "strict",
        maxAge: env.ACCESS_TOKEN_EXPIRY, // 15 mins
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: env.REFRESH_TOKEN_EXPIRY, // 7 days
      });
    }

    if (env.NODE_ENV === "development") {
      res.cookie("accessToken", result.accessToken, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        maxAge: env.ACCESS_TOKEN_EXPIRY, // 15 mins
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        maxAge: env.REFRESH_TOKEN_EXPIRY, // 7 days
      });
    }

    // 6 : send response
    res.status(200).json({
      status: "success",
      message: "OTP verified successfully",
      data: result.user,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
      return;
    } else {
      res.status(500).json({
        status: "fail",
        message: "Error in verifying otp",
      });
    }
  }
};

// FUNCTION
export const rotateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1 : take refresh token out of cookies
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new Error("Refresh token not found in cookies");
    }

    // 2 : send control to service
    const result = await rotateTokenService({ refreshToken });

    // 9 : send cookies
    if (env.NODE_ENV === "production") {
      res.cookie("accessToken", result.newAccessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production", // True in prod for HTTPS
        sameSite: "strict",
        maxAge: env.ACCESS_TOKEN_EXPIRY, // 15 mins
      });

      res.cookie("refreshToken", result.newRefreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: env.REFRESH_TOKEN_EXPIRY, // 7 days
      });
    }

    if (env.NODE_ENV === "development") {
      res.cookie("accessToken", result.newAccessToken, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        maxAge: env.ACCESS_TOKEN_EXPIRY, // 15 mins
      });

      res.cookie("refreshToken", result.newRefreshToken, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        maxAge: env.REFRESH_TOKEN_EXPIRY, // 7 days
      });
    }

    res.status(200).json({
      status: "success",
      message: "Rotate token successfully",
      data: result.user,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
      return;
    } else {
      res.status(500).json({
        status: "fail",
        message: "Error in verifying otp",
      });
    }
  }
};

// FUNCTION
export const signout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1 : transfer control to service
    await signoutService({
      refreshToken: req.cookies.refreshToken,
    });

    // 4 : clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // 5 : send response
    res.status(200).json({
      status: "success",
      message: "Sign out successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
      return;
    } else {
      res.status(500).json({
        status: "fail",
        message: "Error in sign out",
      });
    }
  }
};
