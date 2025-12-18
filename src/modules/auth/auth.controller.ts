import { Request, Response, NextFunction } from "express";

export const studentSignup = (
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
