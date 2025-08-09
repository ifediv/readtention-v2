'use client';

import { useRef, useEffect, useState } from 'react';

export default function MindMapDisplay({ markdownContent, bookId, onMarkdownChange }) {
  const svgRef = useRef();
  const markmapRef = useRef(); // Keep reference to markmap instance for cleanup
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(false);

  console.log('MindMapDisplay received:', { bookId, hasContent: !!markdownContent });

  // Auto-save functionality
  useEffect(() => {
    if (markdownContent && bookId && !lastSaved) {
      console.log('Initial mindmap content detected, saving...');
      setTimeout(() => {
        handleSave();
      }, 1000);
    }
  }, [markdownContent, bookId]);

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

  useEffect(() => {
    if (!markdownContent) return;

    const loadMarkmap = async () => {
      try {
        setLoading(true);
        setError(null);

        // Clean up previous markmap instance first
        if (markmapRef.current) {
          try {
            markmapRef.current.destroy?.();
          } catch (destroyError) {
            console.warn('Error during markmap cleanup:', destroyError);
          }
          markmapRef.current = null;
        }

        // Wait for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 150));

        if (!svgRef.current) {
          setError('Container not ready');
          setLoading(false);
          return;
        }

        // Dynamically import markmap packages
        const { Markmap } = await import('markmap-view');
        const { Transformer } = await import('markmap-lib');
        
        // Create transformer instance and transform markdown to markmap data
        const transformer = new Transformer();
        const { root } = transformer.transform(markdownContent);
        
        // Create a completely new container div that React won't manage
        const markmapContainer = document.createElement('div');
        markmapContainer.style.cssText = `
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background: #fff;
        `;
        
        // Create SVG inside the isolated container
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        
        // Set explicit dimensions
        const containerWidth = 800;
        const containerHeight = 600;
        
        svg.setAttribute('width', containerWidth.toString());
        svg.setAttribute('height', containerHeight.toString());
        svg.setAttribute('viewBox', `0 0 ${containerWidth} ${containerHeight}`);
        svg.style.cssText = `
          width: 100%;
          height: 100%;
          display: block;
        `;
        
        // Add SVG to isolated container
        markmapContainer.appendChild(svg);
        
        // Clear React container and add our isolated container
        if (svgRef.current) {
          // Mark this container as "hands off" for React
          svgRef.current.innerHTML = '';
          svgRef.current.appendChild(markmapContainer);
        }
        
        // Wait for DOM insertion
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        // Create and configure markmap with minimal settings
        const mm = Markmap.create(svg, {
          duration: 0,
          nodeMinHeight: 20,
          spacingVertical: 10,
          spacingHorizontal: 120,
          autoFit: false,
          fitRatio: 1,
          initialExpandLevel: 2,
          pan: false, // Disable panning to reduce DOM manipulation
          zoom: false, // Disable zooming to reduce DOM manipulation
          color: (node) => {
            if (node.depth === 0) return '#8b5cf6';
            if (node.depth === 1) return '#2349b4';
            if (node.depth === 2) return '#10b981';
            return '#6b7280';
          }
        });
        
        // Store reference for cleanup
        markmapRef.current = mm;
        
        // Set data without fitting (to avoid SVG manipulations)
        mm.setData(root);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading markmap:', err);
        setError('Failed to render mind map');
        setLoading(false);
        
        // Fallback: show formatted markdown
        if (svgRef.current) {
          svgRef.current.innerHTML = `
            <div style="padding: 20px; font-family: system-ui, sans-serif; line-height: 1.6; color: #333;">
              <h3 style="color: #2349b4; margin-bottom: 16px;">Mind Map Content (Text View)</h3>
              <pre style="white-space: pre-wrap; font-family: system-ui, sans-serif;">${markdownContent}</pre>
            </div>
          `;
        }
      }
    };

    // Use a longer timeout to ensure React has finished its reconciliation
    const timeoutId = setTimeout(loadMarkmap, 300);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (markmapRef.current) {
        try {
          markmapRef.current.destroy?.();
        } catch (cleanupError) {
          console.warn('Error during cleanup:', cleanupError);
        }
        markmapRef.current = null;
      }
    };
  }, [markdownContent]);

  if (!markdownContent) {
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
      
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '600px',
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <div 
          ref={svgRef} 
          style={{ 
            width: '100%', 
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {loading && (
            <div style={{ 
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🧠</div>
              <div>Loading mind map...</div>
            </div>
          )}
          {error && (
            <div style={{ 
              textAlign: 'center',
              color: '#ef4444',
              padding: '20px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
              <div>{error}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}