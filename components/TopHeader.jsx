
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function TopHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header style={{
      background: 'linear-gradient(135deg, #faf8ff 0%, #f3f0ff 100%)',
      padding: '16px 24px',
      boxShadow: '0 4px 20px rgba(35, 73, 180, 0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      borderBottom: '1px solid rgba(35, 73, 180, 0.1)'
    }}>
      <div 
        onClick={() => router.push('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3), 0 3px 6px rgba(139, 92, 246, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Image
            src="/readtention-logo.png"
            alt="Readtention Logo"
            width={44}
            height={44}
            style={{ 
              filter: 'hue-rotate(200deg) saturate(1.2) brightness(1.1)',
              transform: 'scale(1.0)',
              mixBlendMode: 'normal'
            }}
          />
        </div>
        <div style={{
          fontSize: '24px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.5px'
        }}>readtention</div>
      </div>

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
        gap: '32px',
        fontSize: '15px',
        color: '#64748b',
        fontWeight: '500'
      }} className="hidden md:flex">
        <a onClick={() => router.push('/books')} style={{
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          position: 'relative'
        }} onMouseOver={(e) => {
          e.target.style.color = '#2349b4';
          e.target.style.background = 'rgba(35, 73, 180, 0.1)';
          e.target.style.transform = 'translateY(-1px)';
        }}
        onMouseOut={(e) => {
          e.target.style.color = '#64748b';
          e.target.style.background = 'transparent';
          e.target.style.transform = 'translateY(0)';
        }}>My Books</a>
        <a style={{
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '8px'
        }} onMouseOver={(e) => {
          e.target.style.color = '#2349b4';
          e.target.style.background = 'rgba(35, 73, 180, 0.1)';
          e.target.style.transform = 'translateY(-1px)';
        }}
        onMouseOut={(e) => {
          e.target.style.color = '#64748b';
          e.target.style.background = 'transparent';
          e.target.style.transform = 'translateY(0)';
        }}>Trends</a>
        <a style={{
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '8px'
        }} onMouseOver={(e) => {
          e.target.style.color = '#2349b4';
          e.target.style.background = 'rgba(35, 73, 180, 0.1)';
          e.target.style.transform = 'translateY(-1px)';
        }}
        onMouseOut={(e) => {
          e.target.style.color = '#64748b';
          e.target.style.background = 'transparent';
          e.target.style.transform = 'translateY(0)';
        }}>AI Agent</a>
        <a style={{
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '8px'
        }} onMouseOver={(e) => {
          e.target.style.color = '#2349b4';
          e.target.style.background = 'rgba(35, 73, 180, 0.1)';
          e.target.style.transform = 'translateY(-1px)';
        }}
        onMouseOut={(e) => {
          e.target.style.color = '#64748b';
          e.target.style.background = 'transparent';
          e.target.style.transform = 'translateY(0)';
        }}>Pricing</a>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '72px',
          right: '16px',
          background: 'linear-gradient(135deg, #ffffff 0%, #faf8ff 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(35, 73, 180, 0.15)',
          boxShadow: '0 8px 24px rgba(35, 73, 180, 0.15), 0 4px 8px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          gap: '16px',
          fontSize: '15px',
          zIndex: '50',
          backdropFilter: 'blur(8px)'
        }} className="md:hidden">
          <a onClick={() => { toggleMenu(); router.push('/books'); }} style={{ 
            cursor: 'pointer',
            color: '#64748b',
            transition: 'all 0.2s ease',
            padding: '8px 12px',
            borderRadius: '8px',
            textDecoration: 'none'
          }} onMouseOver={(e) => {
            e.target.style.color = '#2349b4';
            e.target.style.background = 'rgba(35, 73, 180, 0.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#64748b';
            e.target.style.background = 'transparent';
          }}>My Books</a>
          <a onClick={() => { toggleMenu(); router.push('/trends'); }} style={{ 
            cursor: 'pointer',
            color: '#64748b',
            transition: 'all 0.2s ease',
            padding: '8px 12px',
            borderRadius: '8px',
            textDecoration: 'none'
          }} onMouseOver={(e) => {
            e.target.style.color = '#2349b4';
            e.target.style.background = 'rgba(35, 73, 180, 0.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#64748b';
            e.target.style.background = 'transparent';
          }}>Trends</a>
          <a onClick={() => { toggleMenu(); router.push('/ai-agent'); }} style={{ 
            cursor: 'pointer',
            color: '#64748b',
            transition: 'all 0.2s ease',
            padding: '8px 12px',
            borderRadius: '8px',
            textDecoration: 'none'
          }} onMouseOver={(e) => {
            e.target.style.color = '#2349b4';
            e.target.style.background = 'rgba(35, 73, 180, 0.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#64748b';
            e.target.style.background = 'transparent';
          }}>AI Agent</a>
          <a onClick={() => { toggleMenu(); router.push('/pricing'); }} style={{ 
            cursor: 'pointer',
            color: '#64748b',
            transition: 'all 0.2s ease',
            padding: '8px 12px',
            borderRadius: '8px',
            textDecoration: 'none'
          }} onMouseOver={(e) => {
            e.target.style.color = '#2349b4';
            e.target.style.background = 'rgba(35, 73, 180, 0.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#64748b';
            e.target.style.background = 'transparent';
          }}>Pricing</a>
        </div>
      )}
    </header>
  );
}


