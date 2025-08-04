'use client';

export default function HowItWorks() {
  return (
    <section style={{
      padding: '60px 24px',
      background: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h2 style={{
        fontSize: '32px',
        fontWeight: '700',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: '40px'
      }}>How It Works</h2>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            fontSize: '40px',
            flexShrink: '0'
          }}>📚</div>
          <div>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '8px'
            }}>Save Key Ideas</h3>
            <p style={{
              fontSize: '15px',
              color: '#4b5563'
            }}>Highlight important takeaways from any book you&apos;re reading.</p>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            fontSize: '40px',
            flexShrink: '0'
          }}>🧠</div>
          <div>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '8px'
            }}>Generate Mind Maps</h3>
            <p style={{
              fontSize: '15px',
              color: '#4b5563'
            }}>Our AI turns your notes into structured, visual mind maps.</p>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            fontSize: '40px',
            flexShrink: '0'
          }}>🔁</div>
          <div>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '8px'
            }}>Remember Effortlessly</h3>
            <p style={{
              fontSize: '15px',
              color: '#4b5563'
            }}>Review maps regularly and retain more over time.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

