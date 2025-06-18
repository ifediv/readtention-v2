export default function Testimonials() {
  return (
    <div className="referrals" style={{ padding: '48px 16px', backgroundColor: '#fafafa', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#1d2233', marginBottom: '32px' }}>
        Why Readers Love Readtention
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '700px', margin: '0 auto' }}>
        {[
          {
            text: '“Readtention helped me speak more clearly about books I read months ago. It’s like having a second memory.”',
            name: 'James H.',
            emoji: '👤',
            color: 'rgba(229, 236, 251, 0.6)',
          },
          {
            text: '“I finally feel confident discussing big ideas with friends. The maps make it easy to recall and share.”',
            name: 'Priya M.',
            emoji: '👤',
            color: 'rgba(253, 236, 200, 0.6)',
          },
          {
            text: '“In a world full of distractions, Readtention keeps the wisdom I care about front and center.”',
            name: 'Malik T.',
            emoji: '👤',
            color: 'rgba(216, 245, 227, 0.6)',
          },
          {
            text: '“It’s not just a note app—it’s a tool for becoming a better thinker and communicator.”',
            name: 'Sophia L.',
            emoji: '👤',
            color: 'rgba(229, 236, 251, 0.6)',
          },
          {
            text: '“Readtention made it possible for me to actually *retain* what I read in a meaningful way.”',
            name: 'Amina R.',
            emoji: '👤',
            color: 'rgba(253, 236, 200, 0.6)',
          },
        ].map((testimonial, idx) => (
          <div
            key={idx}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: `0 8px 16px ${testimonial.color}`,
              textAlign: 'left',
            }}
          >
            <p style={{ fontSize: '14px', color: '#333' }}>{testimonial.text}</p>
            <div style={{ marginTop: '10px', fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>{testimonial.emoji}</span> {testimonial.name}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px' }}>
        <a
          href="#"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            backgroundColor: '#e5ecfb',
            color: '#2349b4',
            padding: '12px 24px',
            borderRadius: '9999px',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Join Thousands of Readers
        </a>
      </div>
    </div>
  );
}
