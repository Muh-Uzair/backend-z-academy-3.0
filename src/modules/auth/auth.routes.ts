import express, { Router } from "express";
import { studentSignup } from "./auth.controller";

const router: Router = express.Router();

// /api/v1/auth

router.route("/signup/student").post(studentSignup);

export default router;
