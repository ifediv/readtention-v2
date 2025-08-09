
'use client';

export default function Testimonials() {
  const testimonials = [
    {
      text: `"I used to pretend I remembered books in conversations. Now I confidently reference insights from books I read months ago, complete with specific examples and quotes."`,
      name: 'Sarah Chen',
      emoji: '📚',
      glow: '0 12px 32px rgba(147, 51, 234, 0.08), 0 0 24px rgba(196, 122, 255, 0.06), 0 4px 16px rgba(221, 183, 255, 0.12)', // Soft purple-pink
    },
    {
      text: `"Finally! A system that actually works. I've tried everything - Notion, Obsidian, handwritten notes. This is the first tool where I don't lose my thoughts."`,
      name: 'Marcus Rodriguez',
      emoji: '🎯',
      glow: '0 12px 32px rgba(251, 113, 133, 0.08), 0 0 24px rgba(252, 165, 165, 0.06), 0 4px 16px rgba(254, 202, 202, 0.12)', // Warm coral-pink
    },
    {
      text: `"The AI mind maps are incredible. In 3 seconds, I get a visual summary that would take me an hour to create manually. My book club thinks I'm a genius now."`,
      name: 'Dr. Jennifer Park',
      emoji: '🧠',
      glow: '0 12px 32px rgba(52, 211, 153, 0.08), 0 0 24px rgba(110, 231, 183, 0.06), 0 4px 16px rgba(167, 243, 208, 0.12)', // Cool mint-green
    },
    {
      text: `"I read 50+ books a year and remembered maybe 10% of them. Now I can discuss any book I've read with confidence and depth. Game changer."`,
      name: 'Ahmed Hassan',
      emoji: '⚡',
      glow: '0 12px 32px rgba(251, 191, 36, 0.08), 0 0 24px rgba(252, 211, 77, 0.06), 0 4px 16px rgba(254, 240, 138, 0.12)', // Golden-yellow
    },
    {
      text: `"My manager asked how I became so articulate about complex topics. It's because I finally have a system that makes knowledge stick."`,
      name: 'Lisa Thompson',
      emoji: '💡',
      glow: '0 12px 32px rgba(139, 92, 246, 0.08), 0 0 24px rgba(167, 139, 250, 0.06), 0 4px 16px rgba(196, 181, 253, 0.12)', // Soft lavender-blue
    },
  ];

  return (
    <section style={{
      padding: '60px 24px',
      background: 'linear-gradient(180deg, #ffffff 0%, #fefeff 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h2 style={{
        fontSize: '32px',
        fontWeight: '700',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        The Reading Transformation
      </h2>

      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px'
      }}>
        {testimonials.map((testimonial, idx) => (
          <div
            key={idx}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: testimonial.glow,
              textAlign: 'left',
              transition: 'transform 0.2s ease',
              border: '1px solid rgba(35, 73, 180, 0.1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <p style={{
              fontSize: '16px',
              color: '#374151',
              lineHeight: '1.6'
            }}>{testimonial.text}</p>
            <div style={{
              marginTop: '20px',
              fontSize: '15px',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: '500'
            }}>
              <span style={{ fontSize: '24px' }}>{testimonial.emoji}</span> {testimonial.name}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '60px', textAlign: 'center' }}>
        <a
          href="#"
          style={{
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(30, 64, 175, 0.25)',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            display: 'inline-block'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Start Remembering Every Book You Read
        </a>
      </div>
    </section>
  );
}


