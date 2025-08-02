
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TopHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header style={{
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      padding: '16px 24px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#166534',
        letterSpacing: '-0.5px'
      }}>readtention.com</div>

      {/* Menu icon (for mobile) */}
      <button onClick={toggleMenu} style={{
        fontSize: '24px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'none' // Hidden on desktop
      }} className="md:hidden">
        📚
      </button>

      {/* Desktop nav */}
      <nav style={{
        display: 'flex',
        gap: '24px',
        fontSize: '15px',
        color: '#374151',
        fontWeight: '500'
      }} className="hidden md:flex">
        <a onClick={() => router.push('/books')} style={{
          cursor: 'pointer',
          transition: 'color 0.2s ease',
          textDecoration: 'none'
        }} onMouseOver={(e) => e.target.style.color = '#10b981'}
          onMouseOut={(e) => e.target.style.color = '#374151'}>My Books</a>
        <a onClick={() => router.push('/bookshelf')} style={{
          cursor: 'pointer',
          transition: 'color 0.2s ease',
          textDecoration: 'none'
        }} onMouseOver={(e) => e.target.style.color = '#10b981'}
          onMouseOut={(e) => e.target.style.color = '#374151'}>Bookshelf</a>
        <a style={{
          cursor: 'pointer',
          transition: 'color 0.2s ease',
          textDecoration: 'none'
        }} onMouseOver={(e) => e.target.style.color = '#10b981'}
          onMouseOut={(e) => e.target.style.color = '#374151'}>Trends</a>
        <a style={{
          cursor: 'pointer',
          transition: 'color 0.2s ease',
          textDecoration: 'none'
        }} onMouseOver={(e) => e.target.style.color = '#10b981'}
          onMouseOut={(e) => e.target.style.color = '#374151'}>AI Agent</a>
        <a style={{
          cursor: 'pointer',
          transition: 'color 0.2s ease',
          textDecoration: 'none'
        }} onMouseOver={(e) => e.target.style.color = '#10b981'}
          onMouseOut={(e) => e.target.style.color = '#374151'}>Pricing</a>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '64px',
          right: '16px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          gap: '12px',
          fontSize: '14px',
          zIndex: '50'
        }} className="md:hidden">
          <a onClick={() => { toggleMenu(); router.push('/books'); }} style={{ cursor: 'pointer' }}>My Books</a>
          <a onClick={() => { toggleMenu(); router.push('/bookshelf'); }} style={{ cursor: 'pointer' }}>Bookshelf</a>
          <a onClick={() => { toggleMenu(); router.push('/trends'); }} style={{ cursor: 'pointer' }}>Trends</a>
          <a onClick={() => { toggleMenu(); router.push('/ai-agent'); }} style={{ cursor: 'pointer' }}>AI Agent</a>
          <a onClick={() => { toggleMenu(); router.push('/pricing'); }} style={{ cursor: 'pointer' }}>Pricing</a>
        </div>
      )}
    </header>
  );
}


