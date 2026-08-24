const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.port || 10000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/generate", async (req, res) => {
  try {
    const { input, mode } = req.body;

    if (!input || !input.trim()) {
      return res.status(400).json({
        error: "Please enter some text first."
      });
    }

    const instructions = {
      improve:
        "Improve the grammar, clarity, and readability of this text while keeping its original meaning.",

      rewrite:
        "Rewrite this text in a natural and engaging way while keeping its original meaning.",

      shorten:
        "Make this text shorter and clearer while keeping the important information.",

      professional:
        "Rewrite this text in a professional, polished, and clear style."
    };

    const instruction =
      instructions[mode] ||
      "Improve this text while keeping its original meaning.";

    const prompt = String(
    instruction + "\n\nText:\n" + String(input)
);

const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: [
        {
            role: "user",
            parts: [
                {
                    text: prompt
                }
            ]
        }
    ]
});
    res.json({
      result: response.text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});
console.log("about to start server");
app.listen(PORT, "0.0,0,0",() => {
  console.log(`AI Writer server running on port ${PORT}`);
});
