'use client';

import { useEffect, useRef, useState } from 'react';

export default function SimpleMindMap({ markdownContent, bookId }) {
  const [status, setStatus] = useState('idle');
  const [content, setContent] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // Only run on client side to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!markdownContent || !mounted) return;
    
    const renderContent = () => {
      setStatus('loading');
      
      // Format the content for display
      const formattedContent = `
        <h3 style="color: #2349b4; margin-bottom: 16px; font-size: 18px;">Mind Map Content</h3>
        <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; border-left: 4px solid #2349b4;">
          <pre style="white-space: pre-wrap; font-size: 14px; line-height: 1.5; margin: 0; font-family: system-ui;">${markdownContent}</pre>
        </div>
      `;
      
      setContent(formattedContent);
      setStatus('success');
    };
    
    // Small delay to ensure everything is ready
    const timeoutId = setTimeout(renderContent, 50);
    
    return () => clearTimeout(timeoutId);
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
          Your Mind Map (Safe Mode)
        </h3>
        <div style={{ 
          padding: '4px 8px', 
          borderRadius: '4px',
          fontSize: '12px',
          background: status === 'success' ? '#10b981' : status === 'loading' ? '#f59e0b' : '#ef4444',
          color: 'white'
        }}>
          {status}
        </div>
      </div>
      
      <div 
        style={{ 
          width: '100%', 
          minHeight: '400px',
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px',
          position: 'relative'
        }}
        suppressHydrationWarning={true}
      >
        {content ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <div style={{ 
            textAlign: 'center',
            color: '#6b7280'
          }}>
            Preparing mind map...
          </div>
        )}
      </div>
    </div>
  );
}