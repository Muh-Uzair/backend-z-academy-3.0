// src/modules/auth/auth.controller.ts

import { Request, Response, NextFunction } from "express";
import { AuthStudentSignup, ZodSchemaVerifyOtp } from "./auth.zod.schema";
import { studentSignupService, verifyOtpService } from "./auth.service";

// FUNCTION
export const studentSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1: Validate input (zod)
    const parsed = AuthStudentSignup.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid data provided",
        errors: parsed.error.issues,
      });
      return;
    }

    // 2: Delegate all business logic to service
    const result = await studentSignupService(parsed.data);

    // 3: Send clean success response
    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete signup.",
      data: { email: result.email },
    });
  } catch (error: any) {
    // Centralized error handling (lib mein AppError use karo ideally)
    if (error.message === "User already exists") {
      res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
      return;
    }

    // Unexpected errors
    console.error("Student signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// FUNCTION
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1 : validate data
    const parsed = ZodSchemaVerifyOtp.safeParse({
      ...req.body,
      otp: Number(req.body.otp),
    });

    // 2 : delegate business logic
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid data provided",
        errors: parsed.error.issues, // optional: detailed errors
      });
      return;
    }

    // 3 : send response
    const result = await verifyOtpService(parsed.data);

    res.status(200).json({
      success: true,
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
