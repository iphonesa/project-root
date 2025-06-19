import { useState, useEffect, useRef } from 'react';

export default function ChatPopup() {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    setChat((prev) => [...prev, { sender: 'You', text: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      setChat((prev) => [...prev, { sender: 'DigiBuddy', text: data.reply }]);
    } catch {
      setChat((prev) => [...prev, { sender: 'DigiBuddy', text: 'Oops! Something went wrong.' }]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Chat Icon Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: '#0078d7',
          color: 'white',
          borderRadius: '50%',
          width: 56,
          height: 56,
          fontSize: 28,
          border: 'none',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        }}
        aria-label="Toggle Chat"
      >
        💬
      </button>

      {/* Chat Popup */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 90,
            right: 20,
            width: 320,
            height: 440,
            background: 'white',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
          }}
          role="dialog"
          aria-modal="true"
          aria-label="DigiBuddy Chatbot"
        >
          {/* Chat Messages */}
          <div
            style={{
              flex: 1,
              padding: 12,
              overflowY: 'auto',
              fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
              fontSize: 14,
              lineHeight: 1.4,
              color: '#333',
            }}
          >
            {chat.map((m, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 12,
                  textAlign: m.sender === 'You' ? 'right' : 'left',
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    padding: '8px 14px',
                    borderRadius: 18,
                    backgroundColor: m.sender === 'You' ? '#0078d7' : '#e1e1e1',
                    color: m.sender === 'You' ? 'white' : '#111',
                    maxWidth: '75%',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    cursor: 'default',
                  }}
                >
                  <strong>{m.sender}:</strong> {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            style={{
              borderTop: '1px solid #ddd',
              padding: 8,
              display: 'flex',
              gap: 8,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 20,
                border: '1px solid #ccc',
                outline: 'none',
                fontSize: 15,
              }}
              spellCheck={false}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#0078d7',
                color: 'white',
                border: 'none',
                borderRadius: 20,
                padding: '0 16px',
                cursor: loading ? 'default' : 'pointer',
                fontWeight: 'bold',
              }}
            >
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
