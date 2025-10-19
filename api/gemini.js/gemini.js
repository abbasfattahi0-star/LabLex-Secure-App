const { GoogleGenerativeAI } = require('@google/genai');

module.exports = async (req, res) => {
  // Ensure the request is a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the user's prompt from the request body
    // Note: Vercel's Node.js runtime uses req.body
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Initialize Google Gemini with the secret API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Send the prompt to the Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Send the Gemini's response back to the user's browser
    return res.status(200).json({ text: text });

  } catch (error) {
    // If anything goes wrong, send back an error message
    console.error("Error in API function:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
