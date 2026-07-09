require("dotenv").config();

console.log(
  "Groq API Key loaded:",
  process.env.GROQ_API_KEY ? "YES ✅" : "NO ❌",
);

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const { protect } = require("./middleware/auth");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const userRoutes = require("./routes/userRoutes");
const dialysisSessionRoutes = require("./routes/dialysisSessionRoutes");
const medicationRoutes = require("./routes/medicationRoutes");
const medicationLogRoutes = require("./routes/medicationLogRoutes");
const labResultRoutes = require("./routes/labResultRoutes");
const fluidIntakeRoutes = require("./routes/fluidIntakeRoutes");
const weightLogRoutes = require("./routes/weightLogRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const dietLogRoutes = require("./routes/dietLogRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// --- Existing Groq chat proxy (unchanged, public) ---
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, system } = req.body;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile", // free & fast
        max_tokens: 1000,
        messages: [{ role: "system", content: system }, ...messages],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      },
    );

    // Reformat to match Anthropic's response shape so frontend needs no changes
    const text = response.data.choices[0].message.content;
    res.json({ content: [{ type: "text", text }] });
  } catch (error) {
    const apiError = error.response?.data;
    console.error("Groq API error:", apiError || error.message);
    res
      .status(error.response?.status || 500)
      .json({ error: apiError?.error?.message || error.message });
  }
});

// --- Health check (public) ---
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "RenalEase API is running" });
});

// --- Protected RenalEase routes (Firebase auth required beyond this point) ---
app.use("/api", protect);

app.use("/api/users", userRoutes);
app.use("/api/dialysis-sessions", dialysisSessionRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/medication-logs", medicationLogRoutes);
app.use("/api/lab-results", labResultRoutes);
app.use("/api/fluid-intake", fluidIntakeRoutes);
app.use("/api/weight-logs", weightLogRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/diet-logs", dietLogRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
