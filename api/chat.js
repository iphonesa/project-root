import { Client } from 'google-genai';

const client = new Client({
  apiKey: process.env.GEMINI_API_KEY,
});

const MAX_TOKENS = 2048;

function buildPrompt(history, userMessage) {
  let convo = `You are DigiBuddy, a friendly chatbot helping parents and elderly users navigate digital technology simply and clearly. Respond warmly with examples and simple language.\n\n`;

  let tokenCount = convo.length;
  const historyToInclude = [];

  for (let i = history.length - 1; i >= 0; i--) {
    const line = `${history[i].sender}: ${history[i].text}\n`;
    tokenCount += line.length;
    if (tokenCount > MAX_TOKENS - 500) break;
    historyToInclude.unshift(line);
  }

  convo += historyToInclude.join('');
  convo += `You: ${userMessage}\nDigiBuddy:`;

  return convo;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  try {
    const prompt = buildPrompt(history || [], message);

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      temperature: 0.7,
      maxOutputTokens: 256,
    });

    res.status(200).json({ reply: response.text.trim() });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}
