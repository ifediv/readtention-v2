
'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function MindMapViewer({ markdown, onBranchAdd, bookId, onMarkdownChange }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableMarkdown, setEditableMarkdown] = useState(markdown || '');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'unsaved'
  const [lastSaved, setLastSaved] = useState(null);

  // Update editable markdown when prop changes
  useEffect(() => {
    setEditableMarkdown(markdown || '');
  }, [markdown]);

  // Auto-save functionality
  useEffect(() => {
    if (!isEditing && editableMarkdown !== markdown && editableMarkdown.trim()) {
      const timeoutId = setTimeout(() => {
        handleSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [editableMarkdown, isEditing, markdown]);

  const handleSave = async () => {
    if (!bookId || !editableMarkdown.trim()) return;
    
    setSaveStatus('saving');
    
    try {
      // First, check if a mindmap already exists for this book
      const { data: existingMindmap, error: fetchError } = await supabase
        .from('mindmaps')
        .select('id')
        .eq('book_id', bookId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingMindmap) {
        // Update existing mindmap
        const { error: updateError } = await supabase
          .from('mindmaps')
          .update({ 
            content: editableMarkdown,
            updated_at: new Date().toISOString(),
            metadata: { lastEdited: 'manual', editedAt: new Date().toISOString() }
          })
          .eq('id', existingMindmap.id);

        if (updateError) throw updateError;
      } else {
        // Create new mindmap
        const { error: insertError } = await supabase
          .from('mindmaps')
          .insert([{
            book_id: bookId,
            content: editableMarkdown,
            mindmap_type: 'user_created',
            title: 'My Mind Map',
            metadata: { lastEdited: 'manual', createdAt: new Date().toISOString() }
          }]);

        if (insertError) throw insertError;
      }

      setSaveStatus('saved');
      setLastSaved(new Date());
      
      // Update parent component
      if (onMarkdownChange) {
        onMarkdownChange(editableMarkdown);
      }
      
    } catch (error) {
      console.error('Error saving mindmap:', error);
      setSaveStatus('unsaved');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveManually = async () => {
    await handleSave();
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditableMarkdown(markdown || '');
    setIsEditing(false);
    setSaveStatus('saved');
  };

  const handleMarkdownChange = (newMarkdown) => {
    setEditableMarkdown(newMarkdown);
    setSaveStatus('unsaved');
  };

  useEffect(() => {
    if (!editableMarkdown || !svgRef.current || isEditing) return;

    const loadMarkmap = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { Markmap } = await import('markmap-view');
        const { Transformer } = await import('markmap-lib');

        const transformer = new Transformer();
        const { root } = transformer.transform(editableMarkdown);

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
                ${editableMarkdown}
              </div>
            </foreignObject>
          `;
        }
      }
    };

    loadMarkmap();
  }, [editableMarkdown, onBranchAdd]);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h3 style={{
            fontSize: '20px',
            color: '#1f2937',
            margin: '0',
            fontWeight: '700',
            fontFamily: 'Playfair Display, serif'
          }}>
            Your Mind Map
          </h3>
          
          {/* Save Status Indicator */}
          <div style={{ 
            fontSize: '12px', 
            color: saveStatus === 'saved' ? '#10b981' : saveStatus === 'saving' ? '#f59e0b' : '#ef4444',
            fontWeight: '500'
          }}>
            {saveStatus === 'saved' && '✓ Saved'}
            {saveStatus === 'saving' && '⏳ Saving...'}
            {saveStatus === 'unsaved' && '● Unsaved changes'}
          </div>
          
          {lastSaved && (
            <div style={{ fontSize: '11px', color: '#9ca3af' }}>
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {!isEditing ? (
            <>
              <button
                onClick={handleEdit}
                style={{
                  fontSize: '12px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                ✏️ Edit
              </button>
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
            </>
          ) : (
            <>
              <button
                onClick={handleSaveManually}
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
                💾 Save
              </button>
              <button
                onClick={handleCancelEdit}
                style={{
                  fontSize: '12px',
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  boxShadow: '0 2px 8px rgba(107, 114, 128, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                ❌ Cancel
              </button>
            </>
          )}
          
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
      
      {/* Content Area - either SVG mindmap or text editor */}
      {isEditing ? (
        <div style={{
          width: '100%',
          height: '400px',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          background: '#ffffff'
        }}>
          <textarea
            value={editableMarkdown}
            onChange={(e) => handleMarkdownChange(e.target.value)}
            placeholder="Enter your mind map in Markdown format..."
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              padding: '16px',
              fontSize: '14px',
              fontFamily: 'Monaco, Menlo, monospace',
              lineHeight: '1.5',
              resize: 'none',
              outline: 'none',
              borderRadius: '12px',
              color: '#374151',
              backgroundColor: 'transparent'
            }}
          />
        </div>
      ) : (
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
      )}
      
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


