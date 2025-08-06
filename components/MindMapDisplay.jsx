'use client';

import { useRef, useEffect, useState } from 'react';
import MindMapViewer from './MindMapViewer';

export default function MindMapDisplay({ markdownContent, bookId, onMarkdownChange }) {
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
    <MindMapViewer 
      markdown={markdownContent}
      bookId={bookId}
      onMarkdownChange={onMarkdownChange}
    />
  );
}