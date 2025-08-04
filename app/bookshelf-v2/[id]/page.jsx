'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../utils/supabaseClient';
import SocraticChat from '../../../components/SocraticChat';
import MindMapDisplay from '../../../components/MindMapDisplay';

export default function BookshelfPage() {
  const { id: bookId } = useParams();
  const [mode, setMode] = useState('socratic');
  const [themes, setThemes] = useState('');
  const [quotes, setQuotes] = useState('');
  const [takeaways, setTakeaways] = useState('');
  const [mindmapMarkdown, setMindmapMarkdown] = useState('');
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('id', bookId)
          .single();
        
        if (!error && data) {
          setBook(data);
        }
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();
  }, [bookId]);

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

  if (loading) {
    return (
      <div id="bookshelf" style={{ 
        minHeight: '100vh',
        backgroundColor: '#ffffff', 
        padding: '48px 24px',
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Loading your book...</h2>
          <p style={{ fontSize: '14px', color: '#999' }}>Getting everything ready for you</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div id="bookshelf" style={{ 
        minHeight: '100vh',
        backgroundColor: '#ffffff', 
        padding: '48px 24px',
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Book not found</h2>
          <p style={{ fontSize: '14px', color: '#999' }}>The book you&apos;re looking for doesn&apos;t exist</p>
        </div>
      </div>
    );
  }

  return (
    <div id="bookshelf" style={{ 
      minHeight: '100vh',
      backgroundColor: '#ffffff', 
      padding: '48px 24px',
      maxWidth: '1200px', 
      margin: '0 auto'
    }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#1d2233', marginBottom: '8px' }}>
        {book.title}
      </h1>
      <p style={{ fontSize: '14px', color: '#777', marginBottom: '32px' }}>
        by {book.author}
      </p>

      {/* User Guidance */}
      <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f8f9ff', border: '1px solid #e6e1fa', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#5f3dc4', marginBottom: '8px', margin: 0 }}>
          🎯 How to create your mind map
        </h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px', margin: 0 }}>
          <strong>Socratic Assistant (Recommended):</strong> Click &quot;Yes, let&apos;s go!&quot; and I&apos;ll automatically generate a comprehensive mind map using AI.
        </p>
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
          <strong>Manual Mode:</strong> Fill out the forms below to create your own custom mind map step by step.
        </p>
      </div>

      {/* AI Mode Toggle */}
      <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setMode('socratic')} 
            style={{ 
              fontSize: '13px', 
              background: mode === 'socratic' ? '#e6e1fa' : '#f0f0f0', 
              color: mode === 'socratic' ? '#5f3dc4' : '#666', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '9999px', 
              cursor: 'pointer', 
              boxShadow: mode === 'socratic' ? '0 6px 12px rgba(157, 112, 249, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            ✨ Socratic Assistant
          </button>
          <button 
            onClick={() => setMode('manual')} 
            style={{ 
              fontSize: '13px', 
              background: mode === 'manual' ? '#e6f2ff' : '#f0f0f0', 
              color: mode === 'manual' ? '#2349b4' : '#666', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '9999px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              boxShadow: mode === 'manual' ? '0 6px 12px rgba(35, 73, 180, 0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            🛠️ Manual Mode
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#999' }}>Choose your preferred method to create mind maps</p>
      </div>

      {mode === 'socratic' ? <SocraticChat bookId={bookId} book={book} setMindmapMarkdown={setMindmapMarkdown} /> : (
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
              placeholder="e.g. &apos;You do not rise to the level of your goals...&apos;"
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

      {mindmapMarkdown && <MindMapDisplay markdownContent={mindmapMarkdown} />}
    </div>
  );
}