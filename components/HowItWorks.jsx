'use client';

export default function HowItWorks() {
  const steps = [
    {
      emoji: '✨',
      title: 'Turn Any Book Into a Mind Map in Minutes',
      description: 'Just tell our AI about any book you\'re reading or have read. In minutes, watch as it creates a stunning visual mind map of all the key concepts, connections, and insights. No note-taking required - the magic happens instantly.',
      glow: '0 12px 32px rgba(139, 92, 246, 0.08), 0 0 20px rgba(167, 139, 250, 0.06), 0 4px 12px rgba(196, 181, 253, 0.12)', // Soft blue-purple
    },
    {
      emoji: '💎',
      title: 'Add Your Personal Discoveries',
      description: 'The AI gives you the foundation, but the real magic happens when you add your own insights, quotes that resonated, and connections to your life. Turn a generic mind map into your personal knowledge treasure.',
      glow: '0 12px 32px rgba(6, 182, 212, 0.08), 0 0 20px rgba(34, 211, 238, 0.06), 0 4px 12px rgba(103, 232, 249, 0.12)', // Gentle teal-cyan
    },
    {
      emoji: '🎨',
      title: 'Design Your Perfect Knowledge Map',
      description: 'Customize colors, reorganize branches, and structure the map exactly how your brain thinks. Every mind works differently - your knowledge maps should too. Create something you\'ll actually love reviewing.',
      glow: '0 12px 32px rgba(251, 146, 60, 0.08), 0 0 20px rgba(253, 186, 116, 0.06), 0 4px 12px rgba(254, 215, 170, 0.12)', // Warm peach-coral
    },
    {
      emoji: '🧠✨',
      title: 'Become the Person Others Ask About Books',
      description: 'Your beautiful, personalized mind maps stick in memory like nothing else. Months later, you\'ll recall insights perfectly and impress everyone with your deep book knowledge. Finally, your reading transforms you into the knowledgeable person you\'ve always wanted to be.',
      glow: '0 12px 32px rgba(52, 211, 153, 0.08), 0 0 20px rgba(110, 231, 183, 0.06), 0 4px 12px rgba(167, 243, 208, 0.12)', // Soft mint-green
    },
  ];

  return (
    <section style={{
      padding: '60px 24px',
      background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)',
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
        {steps.map((step, idx) => (
          <div
            key={idx}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: step.glow,
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              border: '1px solid rgba(35, 73, 180, 0.1)'
            }}
          >
            <div style={{
              fontSize: '40px',
              flexShrink: '0'
            }}>{step.emoji}</div>
            <div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '8px'
              }}>{step.title}</h3>
              <p style={{
                fontSize: '16px',
                color: '#4b5563',
                lineHeight: '1.5'
              }}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        <button style={{
          padding: '16px 32px',
          background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(30, 64, 175, 0.25)',
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

