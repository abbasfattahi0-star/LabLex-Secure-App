import { GoogleGenerativeAI } from '@google/genai';

// This configures the function to run on Vercel's Edge Network for speed
export const config = {
  runtime: 'edge',
};

// This is the main function that handles requests
export default async function handler(req) {
  // Ensure the request is a POST request
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get the user's prompt from the request body
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Initialize Google Gemini with the secret API key from Vercel's environment variables
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Send the prompt to the Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Send the Gemini's response back to the user's browser
    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // If anything goes wrong, send back an error message
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch from Gemini API' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
