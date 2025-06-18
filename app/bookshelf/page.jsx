'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function BookshelfPage() {
  const [mode, setMode] = useState('socratic');
  const bookId = 'book-1';

  const [themes, setThemes] = useState('');
  const [quotes, setQuotes] = useState('');
  const [takeaways, setTakeaways] = useState('');

  const saveNotes = async () => {
    const { error } = await supabase.from('notes').insert([
      {
        book_id: bookId,
        themes,
        quotes,
        takeaways,
      }
    ]);

    if (error) {
      alert('Error saving notes: ' + error.message);
    } else {
      alert('Notes saved successfully!');
    }
  };

  return (
    <div id="bookshelf" style={{ padding: '48px 16px', maxWidth: '700px', margin: '0 auto', backgroundColor: '#ffffff' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#1d2233', marginBottom: '8px' }}>Atomic Habits</h1>
      <p style={{ fontSize: '14px', color: '#777', marginBottom: '32px' }}>by James Clear</p>

      {/* AI Mode Toggle */}
      <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setMode('socratic')} style={{ fontSize: '13px', background: '#e6e1fa', color: '#5f3dc4', border: 'none', padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer', boxShadow: '0 6px 12px rgba(157, 112, 249, 0.4)' }}>
            ✨ Socratic Assistant
          </button>
          <button onClick={() => setMode('manual')} style={{ fontSize: '13px', background: '#f0f0f0', color: '#333', border: 'none', padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🛠️ Manual Mode <span style={{ fontSize: '16px' }}>⚙️</span>
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#999' }}>*For best experience</p>
      </div>

      {mode === 'socratic' ? <SocraticChat bookId={bookId} /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label htmlFor="themes" style={{ fontWeight: 'bold', fontSize: '14px' }}>Themes</label><br />
            <textarea
              id="themes"
              value={themes}
              onChange={(e) => setThemes(e.target.value)}
              placeholder="e.g. Habit formation, identity, environment design"
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
            />
          </div>
          <div>
            <label htmlFor="quotes" style={{ fontWeight: 'bold', fontSize: '14px' }}>Memorable Quotes</label><br />
            <textarea
              id="quotes"
              value={quotes}
              onChange={(e) => setQuotes(e.target.value)}
              placeholder="e.g. 'You do not rise to the level of your goals...'"
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
            />
          </div>
          <div>
            <label htmlFor="takeaways" style={{ fontWeight: 'bold', fontSize: '14px' }}>Personal Takeaways</label><br />
            <textarea
              id="takeaways"
              value={takeaways}
              onChange={(e) => setTakeaways(e.target.value)}
              placeholder="What did this book teach you?"
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
            />
          </div>
          <button
            onClick={saveNotes}
            style={{ marginTop: '16px', padding: '10px 20px', backgroundColor: '#e5ecfb', color: '#2349b4', border: 'none', borderRadius: '9999px', fontSize: '14px', cursor: 'pointer' }}
          >
            Save & Generate Map
          </button>
        </div>
      )}

      <div id="mindMap" style={{ marginTop: '48px', textAlign: 'left' }}></div>
    </div>
  );
}

// SocraticChat remains unchanged
function SocraticChat({ bookId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const { data: insertedMessages, error } = await supabase
      .from('messages')
      .insert([{ book_id: bookId, role: 'user', content: input }])
      .select();

    if (error) {
      console.error('Insert error:', error);
      return;
    }

    const message = insertedMessages?.[0];
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    const res = await fetch('/api/reflect', {
      method: 'POST',
      body: JSON.stringify({
        message: input,
        book_id: bookId,
        message_id: message.id
      })
    });

    const { ai_response } = await res.json();
    setMessages(prev => [...prev, { role: 'ai', content: ai_response }]);
  };

  return (
    <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-md shadow-inner max-h-[400px] overflow-y-auto">
      <h3 className="text-sm text-gray-500 mb-1">Socratic Assistant</h3>

      {messages.map((msg, i) => (
        <div
          key={i}
          className={`max-w-[80%] px-4 py-2 rounded-md text-sm whitespace-pre-wrap ${
            msg.role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'
          }`}
        >
          {msg.content}
        </div>
      ))}

      <div ref={chatEndRef} />

      <div className="flex gap-2 pt-2">
        <input
          type="text"
          value={input}
          placeholder="Type your thoughts..."
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-3 py-2 rounded-md text-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-[#2349b4] text-white px-4 py-2 rounded-md text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
