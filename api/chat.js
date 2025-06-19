import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'google-genai';

const client = new Client({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  try {
    // Customize prompt for clear, friendly, helpful responses
    const prompt = `
You are DigiBuddy, a friendly chatbot helping parents and elderly users navigate digital technology simply and clearly.
Respond in short, jargon-free sentences with examples or analogies.
Use a warm, encouraging tone.
User says: "${message}"
DigiBuddy replies:
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      temperature: 0.7,
      maxOutputTokens: 256,
    });

    res.status(200).json({ reply: response.text.trim() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate response' });
  }
}
