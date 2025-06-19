import { useState } from 'react';

export default function Home() {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg = input;
    setChat([...chat, { sender: 'You', text: userMsg }]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg }),
    });
    const data = await res.json();
    setChat((prev) => [...prev, { sender: 'DigiBuddy', text: data.reply }]);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <div
        style={{
          border: '1px solid #ccc',
          padding: 10,
          height: 300,
          overflowY: 'auto',
          marginBottom: 10,
        }}
      >
        {chat.map((msg, i) => (
          <p key={i}>
            <b>{msg.sender}:</b> {msg.text}
          </p>
        ))}
        {loading && <p>DigiBuddy is typing...</p>}
      </div>
      <input
        style={{ width: '100%', padding: 10 }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type your message"
      />
    </div>
  );
}
