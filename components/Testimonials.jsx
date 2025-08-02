
'use client';

export default function Testimonials() {
  const testimonials = [
    {
      text: `“Readtention helped me speak more clearly about books I read months ago. It's like having a second memory.”`,
      name: 'James H.',
      emoji: '👤',
    },
    {
      text: `“I finally feel confident discussing big ideas with friends. The maps make it easy to recall and share.”`,
      name: 'Priya M.',
      emoji: '👤',
    },
    {
      text: `“In a world full of distractions, Readtention keeps the wisdom I care about front and center.”`,
      name: 'Malik T.',
      emoji: '👤',
    },
    {
      text: `“It's not just a note app—it's a tool for becoming a better thinker and communicator.”`,
      name: 'Sophia L.',
      emoji: '👤',
    },
    {
      text: `“Readtention made it possible for me to actually *retain* what I read in a meaningful way.”`,
      name: 'Amina R.',
      emoji: '👤',
    },
  ];

  return (
    <section style={{
      padding: '60px 24px',
      background: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h2 style={{
        fontSize: '32px',
        fontWeight: '700',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        Why Readers Love Readtention
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
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              textAlign: 'left',
              transition: 'transform 0.2s ease',
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
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            display: 'inline-block'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Join Thousands of Readers
        </a>
      </div>
    </section>
  );
}


