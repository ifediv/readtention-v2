'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../utils/supabaseClient';

export default function BookshelfPage() {
  const { id: bookId } = useParams();
  
  const [mode, setMode] = useState('socratic');


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

// SocraticChat 
function SocraticChat({ bookId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const [stage, setStage] = useState('central');


  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('book_id', bookId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        if (data.length > 0) {
        setMessages(data);
      } else {
        const welcome = {
          role: 'ai',
          content: `👋 Welcome! I see you're reading this book. Let's build your mind map together.\n\nTo start: What's the central idea or core thesis of this book?`
        };
        setMessages([welcome]);
        setStage('central')

        await supabase.from('messages').insert([{ ...welcome, book_id: bookId }]);
      }
    }
  };
  loadMessages();
}, [bookId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getFollowUpPrompt = (currentStage) => {
    switch (currentStage) {
      case 'central':
        return "Great start! Now let’s go one level deeper.\n\nStep 2️⃣: What are the *main branches* of ideas that support this central theme?";
      case 'branches':
        return "Awesome! Let's explore further.\n\nStep 3️⃣: For each main branch, what are some *supporting sub-branches* or specific examples?";
      case 'subbranches':
        return "✅ You’ve outlined a complete mind map! You can refine it further or move to Markmap.";
      default:
        return "Anything else you'd like to add?";
    }
  };

  const getNextStage = (currentStage) => {
  switch (currentStage) {
    case 'central':
      return 'branches';
    case 'branches':
      return 'subbranches';
    case 'subbranches':
      return 'subbranches'; // stays here unless you build extra stages
    default:
      return currentStage;
  }
};

const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = {
    book_id: bookId,
    role: 'user',
    content: input
  };

  const { data: insertedMessages, error } = await supabase
    .from('messages')
    .insert([userMsg])
    .select();

  if (error) {
    console.error('Insert error:', error);
    return;
  }

  setMessages(prev => [...prev, userMsg]);
  setInput('');

  const res = await fetch('/api/reflect', {
    method: 'POST',
    body: JSON.stringify({
      message: input,
      book_id: bookId,
      message_id: insertedMessages[0].id
    })
  });

  const { ai_response } = await res.json();

  const reflectionMsg = {
    book_id: bookId,
    role: 'ai',
    content: ai_response
  };

  await supabase.from('messages').insert([reflectionMsg]);
  setMessages(prev => [...prev, reflectionMsg]);

  // 🔁 Now follow up with next prompt
  const followUp = getFollowUpPrompt(stage);
  const promptMsg = {
    book_id: bookId,
    role: 'ai',
    content: followUp
  };

  await supabase.from('messages').insert([promptMsg]);
  setMessages(prev => [...prev, promptMsg]);
  };
  const handleStartOver = async () => {
    const confirmed = confirm(
      'Are you sure you want to start over? This will delete all your previous messages.'
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('book_id', bookId);

    if (error) {
      console.error('❌ Failed to delete messages:', error.message);
    } else {
    // Reset to welcome state
    const welcome = {
      role: 'ai',
      content: `🔁 Let's start fresh!\n\nWhat's the central idea or core thesis of this book?`,
      book_id: bookId
    };

    await supabase.from('messages').insert([welcome]);
    setMessages([welcome]);
    setStage('central');
  }
};

  return (
    <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-md shadow-inner max-h-[400px] overflow-y-auto">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm text-gray-500">Socratic Assistant</h3>
        <button
          onClick={handleStartOver}
          className="text-xs text-red-500 hover:underline"
        >
          🗑️ Start Over
        </button>
      </div>

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
