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
      }}>Your Reading Transformation Journey</h2>
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
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08), 0 0 20px rgba(35, 73, 180, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          border: '1px solid rgba(35, 73, 180, 0.1)'
        }}>
          <div style={{
            fontSize: '40px',
            flexShrink: '0'
          }}>✨</div>
          <div>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '8px'
            }}>Turn Any Book Into a Mind Map in Minutes</h3>
            <p style={{
              fontSize: '16px',
              color: '#4b5563',
              lineHeight: '1.5'
            }}>Just tell our AI about any book you&apos;re reading or have read. In minutes, watch as it creates a stunning visual mind map of all the key concepts, connections, and insights. No note-taking required - the magic happens instantly.</p>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08), 0 0 20px rgba(35, 73, 180, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          border: '1px solid rgba(35, 73, 180, 0.1)'
        }}>
          <div style={{
            fontSize: '40px',
            flexShrink: '0'
          }}>💎</div>
          <div>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '8px'
            }}>Add Your Personal Discoveries</h3>
            <p style={{
              fontSize: '16px',
              color: '#4b5563',
              lineHeight: '1.5'
            }}>The AI gives you the foundation, but the real magic happens when you add your own insights, quotes that resonated, and connections to your life. Turn a generic mind map into your personal knowledge treasure.</p>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08), 0 0 20px rgba(35, 73, 180, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          border: '1px solid rgba(35, 73, 180, 0.1)'
        }}>
          <div style={{
            fontSize: '40px',
            flexShrink: '0'
          }}>🎨</div>
          <div>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '8px'
            }}>Design Your Perfect Knowledge Map</h3>
            <p style={{
              fontSize: '16px',
              color: '#4b5563',
              lineHeight: '1.5'
            }}>Customize colors, reorganize branches, and structure the map exactly how your brain thinks. Every mind works differently - your knowledge maps should too. Create something you&apos;ll actually love reviewing.</p>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08), 0 0 20px rgba(35, 73, 180, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          border: '1px solid rgba(35, 73, 180, 0.1)'
        }}>
          <div style={{
            fontSize: '40px',
            flexShrink: '0'
          }}>🧠✨</div>
          <div>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '8px'
            }}>Become the Person Others Ask About Books</h3>
            <p style={{
              fontSize: '16px',
              color: '#4b5563',
              lineHeight: '1.5'
            }}>Your beautiful, personalized mind maps stick in memory like nothing else. Months later, you&apos;ll recall insights perfectly and impress everyone with your deep book knowledge. Finally, your reading transforms you into the knowledgeable person you&apos;ve always wanted to be.</p>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '50px', textAlign: 'center' }}>
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
          Ready to Transform Your Reading Experience?
        </button>
      </div>
    </section>
  );
}

