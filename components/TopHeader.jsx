
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
      background: 'linear-gradient(135deg, #f8faff 0%, #eff6ff 100%)',
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
          boxShadow: '0 8px 16px rgba(255, 107, 26, 0.3), 0 3px 6px rgba(255, 140, 66, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Image
            src="/readtention-logo-v2.png"
            alt="Readtention Logo"
            width={44}
            height={44}
            style={{ 
              transform: 'scale(1.0)',
              mixBlendMode: 'normal'
            }}
          />
        </div>
        <div style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#374151',
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
        <button style={{
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid',
          borderImage: 'linear-gradient(135deg, #1e40af, #06b6d4, #10b981, #f59e0b, #ef4444) 1',
          color: '#1e40af',
          backgroundColor: 'transparent',
          fontWeight: '500',
          fontSize: '15px',
          fontFamily: 'inherit',
          boxShadow: '0 2px 8px rgba(30, 64, 175, 0.08), 0 0 12px rgba(6, 182, 212, 0.04), 0 1px 4px rgba(16, 185, 129, 0.06)'
        }} onMouseOver={(e) => {
          e.target.style.color = '#1e40af';
          e.target.style.background = 'linear-gradient(135deg, rgba(30, 64, 175, 0.05) 0%, rgba(6, 182, 212, 0.05) 25%, rgba(16, 185, 129, 0.05) 50%, rgba(245, 158, 11, 0.05) 75%, rgba(239, 68, 68, 0.05) 100%)';
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 16px rgba(30, 64, 175, 0.12), 0 0 20px rgba(6, 182, 212, 0.06), 0 2px 8px rgba(16, 185, 129, 0.08)';
        }}
        onMouseOut={(e) => {
          e.target.style.color = '#1e40af';
          e.target.style.background = 'transparent';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(30, 64, 175, 0.08), 0 0 12px rgba(6, 182, 212, 0.04), 0 1px 4px rgba(16, 185, 129, 0.06)';
        }}>Sign In</button>
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
          <button onClick={() => { toggleMenu(); }} style={{ 
            cursor: 'pointer',
            color: '#1e40af',
            transition: 'all 0.2s ease',
            padding: '8px 12px',
            borderRadius: '8px',
            textDecoration: 'none',
            border: '1px solid',
            borderImage: 'linear-gradient(135deg, #1e40af, #06b6d4, #10b981, #f59e0b, #ef4444) 1',
            backgroundColor: 'transparent',
            fontWeight: '500',
            fontSize: '15px',
            fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(30, 64, 175, 0.08), 0 0 12px rgba(6, 182, 212, 0.04), 0 1px 4px rgba(16, 185, 129, 0.06)'
          }} onMouseOver={(e) => {
            e.target.style.color = '#1e40af';
            e.target.style.background = 'linear-gradient(135deg, rgba(30, 64, 175, 0.05) 0%, rgba(6, 182, 212, 0.05) 25%, rgba(16, 185, 129, 0.05) 50%, rgba(245, 158, 11, 0.05) 75%, rgba(239, 68, 68, 0.05) 100%)';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#1e40af';
            e.target.style.background = 'transparent';
          }}>Sign In</button>
        </div>
      )}
    </header>
  );
}


