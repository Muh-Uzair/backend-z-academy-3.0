import express, { Router } from "express";
import { studentSignup, verifyOtp } from "./auth.controller";

const router: Router = express.Router();

// /api/v1/auth

router.route("/signup/student").post(studentSignup);
router.route("/verify-otp").post(verifyOtp);

export default router;
