require("dotenv").config();

console.log(
  "Groq API Key loaded:",
  process.env.GROQ_API_KEY ? "YES ✅" : "NO ❌",
);

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(5001, () => console.log("Server running on port 5001"));
