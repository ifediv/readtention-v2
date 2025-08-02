
'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../utils/supabaseClient';
import MindMapViewer from '../../../components/MindMapViewer';

export default function BookshelfPage() {
  const { id: bookId } = useParams();
  
  const [mode, setMode] = useState('socratic');
  const [mindmapData, setMindmapData] = useState(null);

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

  const handleBranchAdd = async (parentText, depth) => {
    const newBranch = prompt(`Add a new branch under "${parentText}":`);
    if (newBranch && newBranch.trim()) {
      // Add the new branch to the mindmap
      // This would typically involve updating the mindmap data and re-rendering
      console.log(`Adding "${newBranch}" under "${parentText}" at depth ${depth}`);
      
      // For now, we'll just show an alert
      alert(`Added "${newBranch}" to your mind map!`);
    }
  };

  return (
    <div style={{ 
      padding: '48px 24px', 
      maxWidth: '800px', 
      margin: '0 auto', 
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h1 style={{ 
        fontFamily: 'Georgia, serif', 
        fontSize: '36px', 
        color: '#1a1a1a', 
        marginBottom: '8px',
        fontWeight: '600'
      }}>
        Atomic Habits
      </h1>
      <p style={{ 
        fontSize: '16px', 
        color: '#6b7280', 
        marginBottom: '40px' 
      }}>
        by James Clear
      </p>

      {/* AI Mode Toggle */}
      <div style={{ 
        marginBottom: '40px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        gap: '12px' 
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => setMode('socratic')} 
            style={{ 
              fontSize: '14px', 
              background: mode === 'socratic' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#f3f4f6',
              color: mode === 'socratic' ? '#ffffff' : '#374151',
              border: 'none', 
              padding: '12px 20px', 
              borderRadius: '25px', 
              cursor: 'pointer', 
              boxShadow: mode === 'socratic' ? '0 4px 14px rgba(99, 102, 241, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
          >
            ✨ Socratic Assistant
          </button>
          <button 
            onClick={() => setMode('manual')} 
            style={{ 
              fontSize: '14px', 
              background: mode === 'manual' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#f3f4f6',
              color: mode === 'manual' ? '#ffffff' : '#374151',
              border: 'none', 
              padding: '12px 20px', 
              borderRadius: '25px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              boxShadow: mode === 'manual' ? '0 4px 14px rgba(99, 102, 241, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
          >
            🛠️ Manual Mode
          </button>
        </div>
        <p style={{ 
          fontSize: '13px', 
          color: '#9ca3af',
          fontStyle: 'italic'
        }}>
          *For best experience
        </p>
      </div>

      {mode === 'socratic' ? <SocraticChat bookId={bookId} onMindmapGenerated={setMindmapData} /> : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '32px',
          background: '#f9fafb',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <div>
            <label htmlFor="themes" style={{ 
              fontWeight: '600', 
              fontSize: '16px',
              color: '#374151',
              display: 'block',
              marginBottom: '8px'
            }}>
              Themes
            </label>
            <textarea
              id="themes"
              value={themes}
              onChange={(e) => setThemes(e.target.value)}
              placeholder="e.g. Habit formation, identity, environment design"
              style={{ 
                width: '100%', 
                padding: '16px', 
                border: '2px solid #e5e7eb', 
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                minHeight: '100px',
                transition: 'border-color 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div>
            <label htmlFor="quotes" style={{ 
              fontWeight: '600', 
              fontSize: '16px',
              color: '#374151',
              display: 'block',
              marginBottom: '8px'
            }}>
              Memorable Quotes
            </label>
            <textarea
              id="quotes"
              value={quotes}
              onChange={(e) => setQuotes(e.target.value)}
              placeholder="e.g. 'You do not rise to the level of your goals...'"
              style={{ 
                width: '100%', 
                padding: '16px', 
                border: '2px solid #e5e7eb', 
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                minHeight: '100px',
                transition: 'border-color 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div>
            <label htmlFor="takeaways" style={{ 
              fontWeight: '600', 
              fontSize: '16px',
              color: '#374151',
              display: 'block',
              marginBottom: '8px'
            }}>
              Personal Takeaways
            </label>
            <textarea
              id="takeaways"
              value={takeaways}
              onChange={(e) => setTakeaways(e.target.value)}
              placeholder="What did this book teach you?"
              style={{ 
                width: '100%', 
                padding: '16px', 
                border: '2px solid #e5e7eb', 
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                minHeight: '100px',
                transition: 'border-color 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <button
            onClick={saveNotes}
            style={{ 
              marginTop: '16px', 
              padding: '16px 32px', 
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#ffffff',
              border: 'none', 
              borderRadius: '25px', 
              fontSize: '16px', 
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Save & Generate Map
          </button>
        </div>
      )}

      {mindmapData && (
        <MindMapViewer 
          markdown={mindmapData} 
          onBranchAdd={handleBranchAdd}
        />
      )}
    </div>
  );
}

// SocraticChat 
function SocraticChat({ bookId, onMindmapGenerated }) {
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
          content: `👋 Welcome! I see you're reading this book. Let's build your mind map together.\n\nTo start: What's the central idea or core thesis of this book?`,
          type: 'welcome' // Add type for welcome message
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
        return "Great start! Now let's go one level deeper.\n\nStep 2️⃣: What are the *main branches* of ideas that support this central theme?";
      case 'branches':
        return "Awesome! Let's explore further.\n\nStep 3️⃣: For each main branch, what are some *supporting sub-branches* or specific examples?";
      case 'subbranches':
        return "✅ You've outlined a complete mind map! You can refine it further or move to Markmap.";
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
      book_id: bookId,
      type: 'welcome' // Add type for welcome message
    };

    await supabase.from('messages').insert([welcome]);
    setMessages([welcome]);
    setStage('central');
  }
};

  const handleYesClick = async () => {
    const userMsg = {
      book_id: bookId,
      role: 'user',
      content: 'Yes, I want to build a mind map!'
    };

    await supabase.from('messages').insert([userMsg]);
    setMessages(prev => [...prev, userMsg]);

    // Generate mindmap immediately
    try {
      const response = await fetch('/api/generate-mindmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ book_id: bookId })
      });

      const data = await response.json();

      if (data.success) {
        const mindmapMsg = {
          book_id: bookId,
          role: 'ai',
          content: '🎉 Great! I\'ve generated your mind map based on our conversation. You can see it below the chat area.\n\nWould you like to add more branches or modify anything?',
          type: 'mindmap_generated'
        };

        await supabase.from('messages').insert([mindmapMsg]);
        setMessages(prev => [...prev, mindmapMsg]);

        // Pass mindmap data to parent component
        if (onMindmapGenerated) {
          onMindmapGenerated(data.mindmap);
        }
      } else {
        throw new Error(data.error || 'Failed to generate mindmap');
      }
    } catch (error) {
      console.error('Error generating mindmap:', error);
      const errorMsg = {
        book_id: bookId,
        role: 'ai',
        content: 'I apologize, but I encountered an error while generating your mind map. Let\'s continue our conversation and I\'ll try again later.\n\nWhat\'s the central idea or core thesis of this book?'
      };

      await supabase.from('messages').insert([errorMsg]);
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleNoClick = async () => {
    const userMsg = {
      book_id: bookId,
      role: 'user',
      content: 'No, not right now.'
    };

    await supabase.from('messages').insert([userMsg]);
    setMessages(prev => [...prev, userMsg]);

    const followUpMsg = {
      book_id: bookId,
      role: 'ai',
      content: 'No problem! Come back when you\'re ready to build your mind map. I\'ll be here to help! 😊'
    };

    await supabase.from('messages').insert([followUpMsg]);
    setMessages(prev => [...prev, followUpMsg]);
  };

  return (
    <div style={{
      background: '#f9fafb',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      maxHeight: '500px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '16px',
          color: '#374151',
          margin: '0',
          fontWeight: '600'
        }}>
          Socratic Assistant
        </h3>
        <button
          onClick={handleStartOver}
          style={{
            fontSize: '12px',
            color: '#ef4444',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '6px',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#fef2f2'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          🗑️ Start Over
        </button>
      </div>

      <div style={{
        flex: '1',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <div
              style={{
                background: msg.role === 'user' ? 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)' : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                color: msg.role === 'user' ? '#1e40af' : '#166534',
                padding: '12px 18px',
                borderRadius: '18px',
                maxWidth: '80%',
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                fontSize: '14px',
                lineHeight: '1.5'
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {messages.length > 0 && messages[messages.length - 1].type === 'welcome' && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={handleYesClick}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(167, 139, 250, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Yes, let's build a mind map!
            </button>
            <button
              onClick={handleNoClick}
              style={{
                padding: '8px 16px',
                background: '#e5e7eb',
                color: '#4b5563',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              No, not right now.
            </button>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        paddingTop: '16px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          placeholder="Type your thoughts..."
          style={{
            flex: '1',
            padding: '12px 18px',
            border: '2px solid #e5e7eb',
            borderRadius: '25px',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = '#6366f1'}
          onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
        />
        <button
          onClick={sendMessage}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Send
        </button>
      </div>
    </div>
  );
}


