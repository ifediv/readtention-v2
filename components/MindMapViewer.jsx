
'use client';

import { useEffect, useRef } from 'react';

export default function MindMapViewer({ markdown, onBranchAdd }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!markdown || !svgRef.current) return;

    const loadMarkmap = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { Markmap } = await import('markmap-view');
        const { Transformer } = await import('markmap-lib');

        const transformer = new Transformer();
        const { root } = transformer.transform(markdown);

        // Clear previous content
        svgRef.current.innerHTML = '';

        // Create markmap instance
        const mm = Markmap.create(svgRef.current, {
          color: (node) => {
            const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
            return colors[node.depth % colors.length];
          },
          duration: 500,
          maxWidth: 300,
          spacingVertical: 8,
          spacingHorizontal: 80,
          paddingX: 8,
          paddingY: 4,
          fontSize: 14,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        });

        // Render the mindmap
        mm.setData(root);
        mm.fit();

        // Add click handlers for branch addition
        if (onBranchAdd) {
          svgRef.current.addEventListener('click', (e) => {
            const target = e.target.closest('g[data-depth]');
            if (target) {
              const depth = target.getAttribute('data-depth');
              const text = target.querySelector('text')?.textContent;
              if (text) {
                onBranchAdd(text, depth);
              }
            }
          });
        }

      } catch (error) {
        console.error('Error loading markmap:', error);
        // Fallback to simple text display
        if (svgRef.current) {
          svgRef.current.innerHTML = `
            <foreignObject width="100%" height="100%">
              <div style="padding: 20px; font-family: monospace; white-space: pre-wrap; color: #374151;">
                ${markdown}
              </div>
            </foreignObject>
          `;
        }
      }
    };

    loadMarkmap();
  }, [markdown, onBranchAdd]);

  return (
    <div 
      ref={containerRef}
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e7eb',
        marginTop: '24px'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '18px',
          color: '#374151',
          margin: '0',
          fontWeight: '600'
        }}>
          Your Mind Map
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onBranchAdd && onBranchAdd('New Branch', '1')}
            style={{
              fontSize: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '16px',
              cursor: 'pointer',
              fontWeight: '500',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            + Add Branch
          </button>
          <button
            onClick={() => {
              const svg = svgRef.current;
              if (svg) {
                const serializer = new XMLSerializer();
                const svgString = serializer.serializeToString(svg);
                const blob = new Blob([svgString], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'mindmap.svg';
                a.click();
                URL.revokeObjectURL(url);
              }
            }}
            style={{
              fontSize: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '16px',
              cursor: 'pointer',
              fontWeight: '500',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            📥 Export
          </button>
        </div>
      </div>
      
      <svg
        ref={svgRef}
        style={{
          width: '100%',
          height: '400px',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          background: '#fafafa'
        }}
      />
      
      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#f3f4f6',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        💡 Click on any node to add a new branch • Pinch to zoom on mobile • Drag to pan
      </div>
    </div>
  );
}


