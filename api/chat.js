export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message } = req.body;

  // Example dummy response; replace with real AI call logic here
  const reply = `You said: ${message}`;

  res.status(200).json({ reply });
}
