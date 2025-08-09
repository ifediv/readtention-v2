'use client';

import { useEffect, useState, useRef } from 'react';

export default function SafeMindMapDisplay({ markdownContent, bookId }) {
  const [status, setStatus] = useState('idle');
  const [mounted, setMounted] = useState(false);
  const [lastSaved, setLastSaved] = useState(false);
  const containerRef = useRef();
  const markmapInstanceRef = useRef();

  // Only run on client side to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-save functionality
  const handleSave = async () => {
    try {
      console.log('Saving mindmap to database...');
      const { supabase } = await import('../utils/supabaseClient');
      
      const { error } = await supabase.from('mindmaps').insert([{
        book_id: bookId,
        title: `Mind Map - ${new Date().toLocaleDateString()}`,
        content: markdownContent,
        mindmap_type: 'ai_generated',
        ai_model: 'gpt-4',
        generation_prompt: 'Auto-generated from Socratic chat'
      }]);

      if (error) {
        console.error('Supabase error saving mindmap:', error);
      } else {
        console.log('Mindmap saved successfully');
        setLastSaved(true);
      }
    } catch (error) {
      console.error('Error saving mindmap:', error);
    }
  };

  // Auto-save when content is received
  useEffect(() => {
    if (markdownContent && bookId && !lastSaved && mounted) {
      console.log('Initial mindmap content detected, saving...');
      setTimeout(() => {
        handleSave();
      }, 1000);
    }
  }, [markdownContent, bookId, mounted]);

  useEffect(() => {
    if (!markdownContent || !mounted || !containerRef.current) return;

    const renderMindmap = async () => {
      try {
        setStatus('loading');

        // Clean up previous instance
        if (markmapInstanceRef.current) {
          try {
            markmapInstanceRef.current.destroy?.();
          } catch (e) {
            console.warn('Cleanup warning:', e);
          }
          markmapInstanceRef.current = null;
        }

        // Wait for React to finish any updates
        await new Promise(resolve => setTimeout(resolve, 200));

        if (!containerRef.current) return;

        // Dynamically import markmap packages
        const { Markmap } = await import('markmap-view');
        const { Transformer } = await import('markmap-lib');
        
        // Create transformer and transform markdown
        const transformer = new Transformer();
        const { root } = transformer.transform(markdownContent);
        
        // Clear container using React-safe method
        containerRef.current.innerHTML = '';
        
        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.cssText = 'width: 100%; height: 100%; display: block;';
        
        containerRef.current.appendChild(svg);
        
        // Wait for SVG to be ready
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        // Create markmap with minimal settings to avoid conflicts
        const mm = Markmap.create(svg, {
          duration: 0, // No animations
          nodeMinHeight: 20,
          spacingVertical: 10,
          spacingHorizontal: 120,
          autoFit: false, // Disable autofit to prevent SVG issues
          fitRatio: 1,
          pan: false, // Disable panning
          zoom: false, // Disable zooming
          color: (node) => {
            if (node.depth === 0) return '#8b5cf6';
            if (node.depth === 1) return '#2349b4';
            if (node.depth === 2) return '#10b981';
            return '#6b7280';
          }
        });
        
        markmapInstanceRef.current = mm;
        mm.setData(root);
        
        setStatus('success');
        
      } catch (error) {
        console.error('Error loading mindmap:', error);
        setStatus('error');
        
        // Fallback to text display
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div style="padding: 20px; font-family: system-ui, sans-serif; line-height: 1.6; color: #333; height: 100%; overflow-y: auto;">
              <h3 style="color: #ef4444; margin-bottom: 16px;">⚠️ Interactive view unavailable - showing text version</h3>
              <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; border-left: 4px solid #2349b4;">
                <pre style="white-space: pre-wrap; font-size: 14px; line-height: 1.5; margin: 0; font-family: system-ui;">${markdownContent}</pre>
              </div>
            </div>
          `;
        }
      }
    };

    // Delay to ensure component is fully mounted and React is done
    const timeoutId = setTimeout(renderMindmap, 500);
    
    return () => {
      clearTimeout(timeoutId);
      if (markmapInstanceRef.current) {
        try {
          markmapInstanceRef.current.destroy?.();
        } catch (e) {
          console.warn('Cleanup warning:', e);
        }
        markmapInstanceRef.current = null;
      }
    };
  }, [markdownContent, mounted]);

  // Don't render anything on server side
  if (!mounted) {
    return null;
  }

  return (
    <div style={{ marginTop: '32px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#1f2937',
          margin: 0
        }}>
          Your Mind Map
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            padding: '4px 8px', 
            borderRadius: '4px',
            fontSize: '12px',
            background: status === 'success' ? '#10b981' : status === 'loading' ? '#f59e0b' : '#ef4444',
            color: 'white'
          }}>
            {status}
          </div>
          
          <button
            onClick={handleSave}
            disabled={lastSaved}
            style={{
              padding: '8px 16px',
              background: lastSaved 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : 'linear-gradient(135deg, #2349b4 0%, #1a3798 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: lastSaved ? 'default' : 'pointer',
              opacity: lastSaved ? 0.8 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {lastSaved ? '✓ Saved' : 'Save Map'}
          </button>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        style={{ 
          width: '100%', 
          height: '500px',
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          position: 'relative'
        }}
        suppressHydrationWarning={true}
      >
        {status === 'idle' && (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center',
            color: '#6b7280',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
            <div>Preparing mind map...</div>
          </div>
        )}
        
        {status === 'loading' && (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center',
            color: '#6b7280',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🧠</div>
            <div>Creating your interactive mind map...</div>
          </div>
        )}
      </div>
    </div>
  );
}