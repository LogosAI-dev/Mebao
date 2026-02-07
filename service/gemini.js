import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, 
});

app.post("/generate", async (req, res) => {
  const { prompt, profile } = req.body;

  const systemInstruction = `
You are MeBao, an AI tutor for trading education specialized for kids and young adults.
Experience: ${profile.experience}
Interests: ${profile.instruments.join(", ")}
Goal: ${profile.goal}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { systemInstruction, temperature: 0.8 },
    });

    res.json({ text: response.text ?? "I'm having trouble thinking right now." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ text: "Oops! My brain froze. Let's try again!" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Gemini server running on port ${PORT}`));
