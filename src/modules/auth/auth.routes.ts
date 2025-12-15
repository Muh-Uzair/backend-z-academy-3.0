import express, { Router } from "express";
import { studentSignup } from "./auth.controller";

const router: Router = express.Router();

// /api/v1/auth

router.post("/signup/student", studentSignup);

export default router;
