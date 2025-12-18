import { sendOTPEmail } from "@/lib/email.service";
import { Request, Response, NextFunction } from "express";

export const studentSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(
      "request body ----------------------------------------------------\n",
      req.body
    );
    console.log("Student Signup route accessed");

    await sendOTPEmail({ to: req.body.email, otp: 123456 });

    res.status(200).json({ message: "Student Signup" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = "Internal Server Error";
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
