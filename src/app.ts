import express from "express";
import authRouter from "./modules/auth/auth.routes";
import cors from "cors";
import { env } from "./config/env";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware – development ke liye
app.use(
  cors({
    origin: env.FRONT_END_URL, // <-- tumhara frontend origin
    credentials: true, // agar cookies/JWT with credentials bhej rahe ho (future auth ke liye important)
  })
);

// Routes
app.get("/", (_req, res) => {
  res.json({ message: "Hello this is zAcademy backend" });
});

app.use("/api/v1/auth", authRouter);

// This would cause an error (unused variable)
// const unusedVar = "test";

export default app;
