'use client';

import { useRef, useEffect, useState } from 'react';

export default function MindMapDisplay({ markdownContent }) {
  const svgRef = useRef();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!markdownContent || !svgRef.current) return;

    const loadMarkmap = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dynamically import markmap packages
        const { Markmap } = await import('markmap-view');
        const { Transformer } = await import('markmap-lib');
        
        // Create transformer instance and transform markdown to markmap data
        const transformer = new Transformer();
        const { root } = transformer.transform(markdownContent);
        
        // Clear previous content and create SVG
        svgRef.current.innerHTML = '';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.width = '100%';
        svg.style.height = '100%';
        svgRef.current.appendChild(svg);
        
        // Create and render markmap
        const mm = Markmap.create(svg);
        mm.setData(root);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading markmap:', err);
        setError('Failed to render mind map');
        setLoading(false);
        
        // Fallback: show plain text version
        if (svgRef.current) {
          svgRef.current.innerHTML = `
            <div style="padding: 20px; font-family: monospace; white-space: pre-wrap; color: #333;">
              ${markdownContent}
            </div>
          `;
        }
      }
    };

    loadMarkmap();
  }, [markdownContent]);

  if (!markdownContent) {
    return null;
  }

  return (
    <div style={{ marginTop: '40px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fafafa' }}>
      <div style={{ padding: '12px', borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#333' }}>
          🧠 Mind Map
        </h4>
      </div>
      
      {loading && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          Loading mind map...
        </div>
      )}
      
      {error && (
        <div style={{ padding: '20px', color: '#d73027', fontSize: '14px' }}>
          {error}
        </div>
      )}
      
      <div 
        ref={svgRef}
        style={{ 
          width: '100%', 
          height: '400px', 
          display: loading ? 'none' : 'block'
        }}
      />
    </div>
  );
}