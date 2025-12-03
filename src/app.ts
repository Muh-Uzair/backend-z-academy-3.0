import express from "express";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (_req, res) => {
  res.json({ message: "Hello from Express with ESM!" });
});

// Example route showing req, res, next can be unused without errors
app.get("/test", (req, res, next) => {
  // req, res, next declared but not used - no error
  res.json({ message: "Test route" });
});

// This would cause an error (unused variable)
// const unusedVar = "test";

export default app;
