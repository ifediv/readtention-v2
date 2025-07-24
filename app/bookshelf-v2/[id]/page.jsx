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
  const [mapData, setMapData] = useState('');
  const [mindmapMarkdown, setMindmapMarkdown] = useState('');




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
function SocraticChat({ bookId, setMapData, setMindmapMarkdown }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [stage, setStage] = useState('central');
  const [centralIdea, setCentralIdea] = useState('');
  const [branches, setBranches] = useState([]); 
  const [subBranches, setSubBranches] = useState({});
  const [welcomeAnswered, setWelcomeAnswered] = useState(false);
  const chatEndRef = useRef(null);

  const handleAcceptMindmap = async () => {
    setWelcomeAnswered(true);
    // Example placeholder mind map generation
    const central = 'Atomic Habits';
    const branches = ['Identity-Based Habits', 'Cue → Routine → Reward', 'Environment Design'];
    const subBranches = {
      'Identity-Based Habits': ['Act like the person you want to become'],
      'Cue → Routine → Reward': ['Trigger', 'Behavior', 'Benefit'],
      'Environment Design': ['Make good habits obvious', 'Make bad habits invisible']
  };

  const handleDeclineMindmap = () => {
    setWelcomeAnswered(true);
    const skipPrompt = {
      book_id: bookId,
      role: 'ai',
      content: `No worries! You can start typing anytime when you're ready to build your mind map.`,
    };
    supabase.from('messages').insert([skipPrompt]);
    setMessages(prev => [...prev, skipPrompt]);
  };

  useEffect(() => {
  if (!bookId) return; // ✅ Exit early if bookId is not yet defined

  const loadMessages = async () => {
    console.log("📥 Loading messages for bookId:", bookId, typeof bookId);

    const { data, error } = await supabase
      .from('messages')
      .select('id, role, content, book_id, created_at, type')
      .eq('book_id', bookId)
      .order('created_at', { ascending: true });

    if (data && data.length > 0) {
      setMessages(data);  // should now contain `type` property
    }

    if (error) {
      console.error('❌ Error fetching messages:', error);
      return;
    }

    console.log("📦 Fetched messages:", data);

    if (data.length > 0) {
      const hasOldWelcome = data[0].content?.includes("Let's build your mind map together");
      console.log("📌 Has old welcome?", hasOldWelcome);

      if (hasOldWelcome) {
        console.log("🧹 Deleting old messages...");
        await supabase.from('messages').delete().eq('book_id', bookId);

        const welcome = {
          role: 'ai',
          type: 'welcome',
          content: `👋 Welcome! Ready to generate your mind map for *Atomic Habits*?`,
          book_id: bookId,
          created_at: new Date().toISOString() // ✅ Required if Supabase table has created_at field
        };

        console.log("💬 Inserting new welcome message:", welcome);
        setMessages([welcome]);
        setStage('welcome');

        const { error: insertError, data: insertData } = await supabase.from('messages').insert([welcome]);
        console.log("🔐 Welcome message insert result:", insertData);
        if (insertError) {
          console.error('❌ Error inserting welcome message:', insertError);
        } else {
          console.log("🧾 Successfully inserted welcome message:", insertData);
        }
      } else {
        console.log("✅ Existing messages found. Setting messages...");
        setMessages(data);
        setStage('refinement');
      }
    } else {
      console.log("🆕 No messages found. Creating new welcome message...");

      const welcome = {
        role: 'ai',
        type: 'welcome',
        content: `👋 Welcome! Ready to generate your mind map for *Atomic Habits*?`,
        book_id: bookId,
        created_at: new Date().toISOString()
      };

      setMessages([welcome]);
      setStage('welcome');

      const { error: insertError, data: insertData } = await supabase.from('messages').insert([welcome]);
      if (insertError) {
        console.error('❌ Error inserting welcome message:', insertError);
      } else {
        console.log("🧾 Successfully inserted welcome message:", insertData);
      }
    }
  };

  loadMessages();
}, [bookId]);


  // Update state
  setCentralIdea(central);
  setBranches(branches);
  setSubBranches(subBranches);

  // Generate markdown
  const lines = [`# ${central}`];
  for (const branch of branches) {
    lines.push(`- ${branch}`);
    const subs = subBranches[branch] || [];
    for (const sub of subs) {
      lines.push(`  - ${sub}`);
    }
  }
  setMindmapMarkdown(lines.join('\n'));

  


  // Add follow-up message
  const refinePrompt = {
    book_id: bookId,
    role: 'ai',
    content: `Here's your mind map draft. Want to add or edit any part of it?`,
  };
  await supabase.from('messages').insert([refinePrompt]);
  setMessages(prev => [...prev, refinePrompt]);
  setStage('refinement');
};


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

  // ✅ Step 1: Get AI response
  const res = await fetch('/api/reflect', {
    method: 'POST',
    body: JSON.stringify({
      message: input,
      book_id: bookId,
      message_id: insertedMessages[0].id
    })
  });

  const { ai_response } = await res.json();

  // ✅ Step 2: Save + show AI reflection
  const reflectionMsg = {
    book_id: bookId,
    role: 'ai',
    content: ai_response
  };

  await supabase.from('messages').insert([reflectionMsg]);
  setMessages(prev => [...prev, reflectionMsg]);

  // ✅ Step 3: Update mind map based on stage

  if (stage === 'central') {
  setCentralIdea(ai_response);
  setMindmapMarkdown(`# ${ai_response}`);
} else if (stage === 'branches') {
  const branchList = ai_response.split(',').map(b => b.trim());
  setBranches(branchList);
  const markdown = [`# ${centralIdea}`, ...branchList.map(b => `- ${b}`)].join('\n');
  setMindmapMarkdown(markdown);
} else if (stage === 'subbranches') {
  // Assume user has responded for ONE main branch for now
  const lastBranch = branches[branches.length - 1];
  const subList = ai_response.split(',').map(s => s.trim());
  const updatedSubBranches = { ...subBranches, [lastBranch]: subList };
  setSubBranches(updatedSubBranches);

  // Regenerate full markdown tree
  const lines = [`# ${centralIdea}`];
  for (const branch of branches) {
    lines.push(`- ${branch}`);
    const subs = updatedSubBranches[branch] || [];
    for (const sub of subs) {
      lines.push(`  - ${sub}`);
    }
  }
  setMindmapMarkdown(lines.join('\n'));
}

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
  setInput(''); // 🧼 clear input now

  // ✅ Step 1: Get AI response
  const res = await fetch('/api/reflect', {
    method: 'POST',
    body: JSON.stringify({
      message: input,
      book_id: bookId,
      message_id: insertedMessages[0].id
    })
  });

  const { ai_response } = await res.json();

  // ✅ Step 2: Save + show AI reflection
  const reflectionMsg = {
    book_id: bookId,
    role: 'ai',
    content: ai_response
  };
  await supabase.from('messages').insert([reflectionMsg]);
  setMessages(prev => [...prev, reflectionMsg]);

  // ✅ Step 3: Update mind map based on stage
  if (stage === 'central') {
    setCentralIdea(ai_response);
    setMindmapMarkdown(`# ${ai_response}`);
  } else if (stage === 'branches') {
    const branchList = ai_response.split(',').map(b => b.trim());
    setBranches(branchList);
    const markdown = [`# ${centralIdea}`, ...branchList.map(b => `- ${b}`)].join('\n');
    setMindmapMarkdown(markdown);
  } else if (stage === 'subbranches') {
    const lastBranch = branches[branches.length - 1];
    const subList = ai_response.split(',').map(s => s.trim());
    const updatedSubBranches = { ...subBranches, [lastBranch]: subList };
    setSubBranches(updatedSubBranches);

    const lines = [`# ${centralIdea}`];
    for (const branch of branches) {
      lines.push(`- ${branch}`);
      const subs = updatedSubBranches[branch] || [];
      for (const sub of subs) {
        lines.push(`  - ${sub}`);
      }
    }
    setMindmapMarkdown(lines.join('\n'));
  }

  // ✅ Step 4: Advance stage and insert follow-up
  const nextStage = getNextStage(stage);
  setStage(nextStage);

  const followUp = getFollowUpPrompt(stage);
  const promptMsg = {
    book_id: bookId,
    role: 'ai',
    content: followUp
  };
  await supabase.from('messages').insert([promptMsg]);
  setMessages(prev => [...prev, promptMsg]);
};


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
      content: `👋 Welcome! Ready to generate your mind map for *Atomic Habits*?`,
      type: 'welcome',
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

{/* 🧠 Message Bubbles + Button Logic */}
{console.log("Rendering messages array:", messages)}

{messages.map((msg, i) => {
  console.log("🟡 Message:", msg);  // Log whole message

  return (
    <div key={msg.id || i} className="flex flex-col">
      <div
        className={`max-w-[80%] px-4 py-2 rounded-md text-sm whitespace-pre-wrap ${
          msg.role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'
        }`}
      >
        {msg.content}
      </div>

      {/* ✅ Show Yes/No buttons under welcome message */}
      {msg.type === 'welcome' && msg.role === 'ai' && !welcomeAnswered && (
        <div className="flex gap-3 mt-2 ml-2">
          <button
            onClick={handleAcceptMindmap} className="bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-[0_0_8px_1px_#86efac] text-sm">
            ✅ Yes, let's go!
          </button>
          <button onClick={handleDeclineMindmap} className="bg-red-100 text-red-800 px-4 py-2 rounded-md shadow-[0_0_8px_1px_#fca5a5] text-sm">
            ❌ Not yet
          </button>
        </div>
      )}
    </div>
  );
})}





      {/* ⬇️ Anchor for scroll-to-bottom */}
    <div ref={chatEndRef} />

    {/* 💬 Input box + send button */}
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
function MindMapDisplay({ markdownContent }) {
  const iframeRef = useRef();

  useEffect(() => {
    if (!markdownContent || !iframeRef.current) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.jsdelivr.net/npm/markmap-autoloader"></script>
        </head>
        <body>
          <svg id="mindmap"></svg>
          <script>
            markmap.autoLoader.render('#mindmap', ${JSON.stringify(markdownContent)});
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;

    return () => URL.revokeObjectURL(url);
  }, [markdownContent]);

  return (
    <div style={{ marginTop: '40px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      <iframe
        ref={iframeRef}
        style={{ width: '100%', height: '400px', border: 'none' }}
        title="Mind Map"
      />
    </div>
  );
}
