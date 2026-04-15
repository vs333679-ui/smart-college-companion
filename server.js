import express from "express";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ PORT fix for Render
const PORT = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Root route (browser check ke liye)
app.get("/", (req, res) => {
  res.send("AI Backend is running 🚀");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage }
      ],
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.error(error); // ✅ error log
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ use dynamic PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  