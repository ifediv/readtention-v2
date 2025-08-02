
'use client';

export default function HeroSection() {
  return (
    <section style={{
      textAlign: 'center',
      padding: '80px 24px',
      background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h1 style={{
        fontSize: '48px',
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: '24px',
        lineHeight: '1.2',
        maxWidth: '900px',
        margin: '0 auto 24px auto'
      }}>
        The note-taking system that actually helps you remember what you read.
      </h1>
      <p style={{
        fontSize: '18px',
        color: '#4b5563',
        marginBottom: '40px'
      }}>
        Start remembering today
      </p>
      <button style={{
        padding: '16px 32px',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '30px',
        fontSize: '18px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
      >
        Get Started Free
      </button>
    </section>
  );
}


