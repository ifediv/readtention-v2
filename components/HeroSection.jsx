
'use client';

export default function HeroSection() {
  return (
    <section style={{
      textAlign: 'center',
      padding: '80px 24px',
      background: 'linear-gradient(135deg, #faf8ff 0%, #f3f0ff 50%, #ffffff 100%)',
      fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
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
        Stop Forgetting the Books You Love
      </h1>
      <p style={{
        fontSize: '20px',
        color: '#4b5563',
        marginBottom: '16px',
        maxWidth: '700px',
        margin: '0 auto 16px auto',
        lineHeight: '1.5'
      }}>
        You read amazing books. You love the insights. But weeks later, you can barely remember what they were about.
      </p>
      <p style={{
        fontSize: '18px',
        color: '#6b7280',
        marginBottom: '40px',
        fontWeight: '600'
      }}>
        Finally, there&apos;s a solution that book lovers actually use.
      </p>
      <button style={{
        padding: '16px 32px',
        background: 'linear-gradient(135deg, #2349b4 0%, #1a3798 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '30px',
        fontSize: '18px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 8px 20px rgba(35, 73, 180, 0.3)',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
      >
        See How It Works With Your Last Book
      </button>
    </section>
  );
}


