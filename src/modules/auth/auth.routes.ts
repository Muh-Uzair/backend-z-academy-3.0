import express, { NextFunction, Request, Response, Router } from "express";
import {
  rotateToken,
  signIn,
  studentSignup,
  verifyOtp,
  signout
} from "./auth.controller";
import { validate } from "@/utils/validate";
import {
  AuthStudentSignup,
  ZodSchemaSignIn,
  ZodSchemaVerifyOtp,
} from "./auth.zod.schema";

const router: Router = express.Router();

// /api/v1/auth

router
  .route("/signup/student")
  .post(validate(AuthStudentSignup), studentSignup);

router
  .route("/verify-otp")
  .post((req: Request, res: Response, next: NextFunction) => {
    req.body = {
      ...req.body,
      otp: Number(req.body.otp),
    };
    validate(ZodSchemaVerifyOtp);

    next();
  }, verifyOtp);

router.route("/signin").post(validate(ZodSchemaSignIn), signIn);

router.route("/rotate-token").post(rotateToken);

router.route("/").post(signout)

export default router;
