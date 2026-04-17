import express from "express";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ CORS (important)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// ✅ OpenAI setup
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Test route (browser check ke liye)
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ Chat route
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful college assistant." },
        { role: "user", content: userMessage }
      ],
    });

    // ✅ safe response
    const reply = response.choices?.[0]?.message?.content || "No reply";

    res.json({ reply });

  } catch (error) {
    console.error("ERROR:", error.message);

    res.status(500).json({
      error: "AI error",
      details: error.message
    });
  }
});

// ✅ PORT fix (Render ke liye)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});