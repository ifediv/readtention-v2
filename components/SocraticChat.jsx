'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import MindmapLensSelector from './MindmapLensSelector';

export default function SocraticChat({ bookId, book, setMindmapMarkdown }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [stage, setStage] = useState('central');
  const [centralIdea, setCentralIdea] = useState('');
  const [branches, setBranches] = useState([]); 
  const [subBranches, setSubBranches] = useState({});
  const [welcomeAnswered, setWelcomeAnswered] = useState(false);
  const [showLensSelector, setShowLensSelector] = useState(false);
  const chatEndRef = useRef(null);

  const handleAcceptMindmap = async () => {
    setWelcomeAnswered(true);
    setShowLensSelector(true);
  };

  const handleGenerateWithLenses = async (lensData) => {
    // Show loading message with lens information
    const selectedModes = Object.keys(lensData.selectedModes);
    const modesText = selectedModes.length > 0 
      ? ` with ${selectedModes.join(', ')} perspectives`
      : '';
    
    const loadingMsg = {
      book_id: bookId,
      role: 'ai',
      content: `🎯 Perfect! I'm generating your personalized mind map for "${book?.title}"${modesText}. This may take a few moments...`,
    };
    await supabase.from('messages').insert([loadingMsg]);
    setMessages(prev => [...prev, loadingMsg]);

    try {
      // Call the generate-mindmap API with lens data
      const response = await fetch('/api/generate-mindmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book_id: bookId,
          lensData: lensData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const result = await response.json();

      if (result.success && result.mindmap) {
        // Set the generated mindmap
        setMindmapMarkdown(result.mindmap);
        
        // Show success message with personalization note
        const successMsg = {
          book_id: bookId,
          role: 'ai',
          content: `✅ Your personalized mind map is ready! I've focused on the ${selectedModes.join(' and ')} perspective${selectedModes.length > 1 ? 's' : ''} you selected. You can see it below. Would you like to refine or add anything to it?`,
        };
        await supabase.from('messages').insert([successMsg]);
        setMessages(prev => [...prev, successMsg]);
        setStage('refinement');
      } else {
        throw new Error(result.error || 'Failed to generate mindmap');
      }
    } catch (error) {
      console.error('Error generating mindmap:', error);
      
      // Determine error message based on the error type
      let errorMessage;
      if (error.message?.includes('Failed to fetch')) {
        errorMessage = `🌐 Connection issue. Please check your internet connection and try again.`;
      } else if (error.message?.includes('OpenAI')) {
        errorMessage = `🤖 AI service is temporarily unavailable. Let's create your mind map manually instead!`;
      } else {
        errorMessage = `⚡ Something went wrong with the automatic generation. No worries - let's build your mind map step by step!`;
      }
      
      const errorMsg = {
        book_id: bookId,
        role: 'ai',
        content: `❌ ${errorMessage} What's the main theme or central idea of "${book?.title}"?`,
      };
      await supabase.from('messages').insert([errorMsg]);
      setMessages(prev => [...prev, errorMsg]);
      setStage('central');
    }
  };

  const handleDeclineMindmap = () => {
    setWelcomeAnswered(true);
    const skipPrompt = {
      book_id: bookId,
      role: 'ai',
      content: `No worries! You can start typing anytime when you&apos;re ready to build your mind map.`,
    };
    supabase.from('messages').insert([skipPrompt]);
    setMessages(prev => [...prev, skipPrompt]);
  };

  useEffect(() => {
    if (!bookId || !book) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('id, role, content, book_id, created_at, type')
        .eq('book_id', bookId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Error fetching messages:', error);
        return;
      }

      if (data && data.length > 0) {
        setMessages(data);
        setStage('refinement');
      } else {
        const welcome = {
          role: 'ai',
          type: 'welcome',
          content: `👋 Welcome! Ready to generate your mind map for *${book.title}*?`,
          book_id: bookId,
          created_at: new Date().toISOString()
        };

        setMessages([welcome]);
        setStage('welcome');
        await supabase.from('messages').insert([welcome]);
      }
    };

    loadMessages();
  }, [bookId, book]);

  const getFollowUpPrompt = (currentStage) => {
    switch (currentStage) {
      case 'central':
        return "Great start! Now let&apos;s go one level deeper.\n\nStep 2️⃣: What are the *main branches* of ideas that support this central theme?";
      case 'branches':
        return "Awesome! Let&apos;s explore further.\n\nStep 3️⃣: For each main branch, what are some *supporting sub-branches* or specific examples?";
      case 'subbranches':
        return "✅ You&apos;ve outlined a complete mind map! You can refine it further or move to Markmap.";
      default:
        return "Anything else you&apos;d like to add?";
    }
  };

  const getNextStage = (currentStage) => {
    switch (currentStage) {
      case 'central':
        return 'branches';
      case 'branches':
        return 'subbranches';
      case 'subbranches':
        return 'subbranches';
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
      const welcome = {
        role: 'ai',
        content: `👋 Welcome! Ready to generate your mind map for *${book?.title || 'your book'}*?`,
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

      {messages.map((msg, i) => (
        <div key={msg.id || i} className="flex flex-col">
          <div
            className={`max-w-[80%] px-4 py-2 rounded-md text-sm whitespace-pre-wrap border ${
              msg.role === 'user' 
                ? 'bg-blue-50 text-blue-900 border-blue-200 self-end' 
                : 'bg-white text-gray-800 border-gray-300 self-start shadow-sm'
            }`}
          >
            {msg.content}
          </div>

          {msg.type === 'welcome' && msg.role === 'ai' && !welcomeAnswered && (
            <div className="flex gap-3 mt-2 ml-2">
              <button
                onClick={handleAcceptMindmap} 
                className="bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-[0_0_8px_1px_#86efac] text-sm"
              >
                ✅ Yes, let&apos;s go!
              </button>
              <button 
                onClick={handleDeclineMindmap} 
                className="bg-red-100 text-red-800 px-4 py-2 rounded-md shadow-[0_0_8px_1px_#fca5a5] text-sm"
              >
                ❌ Not yet
              </button>
            </div>
          )}
        </div>
      ))}

      <div ref={chatEndRef} />

      <div className="flex gap-2 pt-2">
        <input
          type="text"
          value={input}
          placeholder="Type your thoughts..."
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#2349b4] focus:ring-1 focus:ring-[#2349b4] bg-white"
        />
        <button
          onClick={sendMessage}
          className="bg-[#2349b4] text-white px-4 py-2 rounded-md text-sm"
        >
          Send
        </button>
      </div>

      {/* Mindmap Lens Selector Modal */}
      <MindmapLensSelector
        isOpen={showLensSelector}
        onClose={() => setShowLensSelector(false)}
        onGenerate={handleGenerateWithLenses}
        book={book}
      />
    </div>
  );
}