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
  const [showGuidance, setShowGuidance] = useState(true);

  useEffect(() => {
    // Check if guidance has been dismissed before
    const guidanceDismissed = localStorage.getItem('mindmap-guidance-dismissed');
    if (guidanceDismissed === 'true') {
      setShowGuidance(false);
    }

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

  const dismissGuidance = () => {
    setShowGuidance(false);
    localStorage.setItem('mindmap-guidance-dismissed', 'true');
  };

  const showGuidanceAgain = () => {
    setShowGuidance(true);
    localStorage.removeItem('mindmap-guidance-dismissed');
  };

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
      margin: '0 auto',
      position: 'relative'
    }}>
      {/* Navigation Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #2349b4 0%, #1a3798 100%)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(35, 73, 180, 0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <span>🏠</span>
            <span>Home</span>
          </button>
          <button
            onClick={() => window.location.href = '/books'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(35, 73, 180, 0.1)',
              color: '#2349b4',
              padding: '8px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(35, 73, 180, 0.2)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(35, 73, 180, 0.15)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(35, 73, 180, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <span>📚</span>
            <span>Library</span>
          </button>
        </div>

        {/* Help Button - only show if guidance is dismissed */}
        {!showGuidance && (
          <button
            onClick={showGuidanceAgain}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
            }}
            title="Show help guide"
          >
            ?
          </button>
        )}
      </div>

      <h1 className="font-playfair" style={{ fontSize: '32px', color: '#1d2233', marginBottom: '8px', fontWeight: '700' }}>
        {book.title}
      </h1>
      <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '32px' }}>
        by {book.author}
      </p>

      {/* User Guidance */}
      {showGuidance && (
        <div style={{ 
          marginBottom: '24px', 
          padding: '18px', 
          background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)', 
          border: '1px solid #e1e7ff', 
          borderRadius: '12px', 
          position: 'relative',
          boxShadow: '0 4px 12px rgba(95, 60, 196, 0.08)'
        }}>
          <button
            onClick={dismissGuidance}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              fontSize: '16px',
              color: '#999',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(4px)'
            }}
            onMouseOver={(e) => {
              e.target.style.color = '#666';
              e.target.style.background = 'rgba(255, 255, 255, 0.95)';
            }}
            onMouseOut={(e) => {
              e.target.style.color = '#999';
              e.target.style.background = 'rgba(255, 255, 255, 0.8)';
            }}
            title="Don't show this again"
          >
            ✕
          </button>
          <h3 style={{ 
            fontSize: '17px', 
            fontWeight: '600', 
            background: 'linear-gradient(135deg, #6D28D9 0%, #5f3dc4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '10px', 
            margin: 0, 
            paddingRight: '32px' 
          }}>
            🎯 How to create your mind map
          </h3>
          <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '10px', margin: 0, lineHeight: '1.5' }}>
            <strong style={{ color: '#374151' }}>Socratic Assistant (Recommended):</strong> Click &quot;Yes, let&apos;s go!&quot; and I&apos;ll automatically generate a comprehensive mind map using AI.
          </p>
          <p style={{ fontSize: '14px', color: '#4b5563', margin: 0, lineHeight: '1.5' }}>
            <strong style={{ color: '#374151' }}>Manual Mode:</strong> Fill out the forms below to create your own custom mind map step by step.
          </p>
        </div>
      )}

      {/* AI Mode Toggle */}
      <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setMode('socratic')} 
            style={{ 
              fontSize: '13px', 
              background: mode === 'socratic' 
                ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' 
                : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
              color: mode === 'socratic' ? '#ffffff' : '#64748b', 
              border: mode === 'socratic' ? 'none' : '1px solid #e2e8f0',
              padding: '10px 18px', 
              borderRadius: '12px', 
              cursor: 'pointer', 
              boxShadow: mode === 'socratic' 
                ? '0 8px 16px rgba(139, 92, 246, 0.3), 0 3px 6px rgba(139, 92, 246, 0.2)' 
                : '0 2px 4px rgba(100, 116, 139, 0.1)',
              transition: 'all 0.3s ease',
              fontWeight: mode === 'socratic' ? '600' : '500',
              transform: mode === 'socratic' ? 'translateY(-1px)' : 'none'
            }}
            onMouseOver={(e) => {
              if (mode !== 'socratic') {
                e.target.style.boxShadow = '0 4px 8px rgba(100, 116, 139, 0.15)';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseOut={(e) => {
              if (mode !== 'socratic') {
                e.target.style.boxShadow = '0 2px 4px rgba(100, 116, 139, 0.1)';
                e.target.style.transform = 'none';
              }
            }}
          >
            ✨ Socratic Assistant
          </button>
          <button 
            onClick={() => setMode('manual')} 
            style={{ 
              fontSize: '13px', 
              background: mode === 'manual' 
                ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
                : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
              color: mode === 'manual' ? '#ffffff' : '#64748b', 
              border: mode === 'manual' ? 'none' : '1px solid #e2e8f0',
              padding: '10px 18px', 
              borderRadius: '12px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              boxShadow: mode === 'manual' 
                ? '0 8px 16px rgba(59, 130, 246, 0.3), 0 3px 6px rgba(59, 130, 246, 0.2)' 
                : '0 2px 4px rgba(100, 116, 139, 0.1)',
              transition: 'all 0.3s ease',
              fontWeight: mode === 'manual' ? '600' : '500',
              transform: mode === 'manual' ? 'translateY(-1px)' : 'none'
            }}
            onMouseOver={(e) => {
              if (mode !== 'manual') {
                e.target.style.boxShadow = '0 4px 8px rgba(100, 116, 139, 0.15)';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseOut={(e) => {
              if (mode !== 'manual') {
                e.target.style.boxShadow = '0 2px 4px rgba(100, 116, 139, 0.1)';
                e.target.style.transform = 'none';
              }
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
            style={{ 
              marginTop: '20px', 
              padding: '12px 24px', 
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '12px', 
              fontSize: '14px', 
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3), 0 3px 6px rgba(59, 130, 246, 0.2)',
              transition: 'all 0.3s ease',
              transform: 'translateY(0)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 20px rgba(59, 130, 246, 0.4), 0 4px 8px rgba(59, 130, 246, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.3), 0 3px 6px rgba(59, 130, 246, 0.2)';
            }}
          >
            Save & Generate Map ✨
          </button>
        </div>
      )}

      {mindmapMarkdown && (
        <MindMapDisplay 
          markdownContent={mindmapMarkdown} 
          bookId={bookId}
          onMarkdownChange={setMindmapMarkdown}
        />
      )}
    </div>
  );
}