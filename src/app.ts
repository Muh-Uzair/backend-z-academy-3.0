import express from "express";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (_req, res) => {
  res.json({ message: "Hello from Express with ESM!" });
});

// This would cause an error (unused variable)
// const unusedVar = "test";

export default app;
