import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY; 
const ai = new GoogleGenAI({ apiKey });

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { prompt, model, contents, config } = req.body; 
    
    // پارامترها را مستقیماً به API می‌فرستیم
    const response = await ai.models.generateContent({
      model: model || "gemini-2.5-flash", // استفاده از مدل ارسالی یا دیفالت
      contents: contents || [{ role: "user", parts: [{ text: prompt }] }],
      config: config || {}
    });

    res.status(200).json({ text: response.text, candidates: response.candidates });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};