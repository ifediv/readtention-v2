'use client';

export default function MindMapCards() {
  const cards = [
    {
      title: 'Atomic Habits',
      description: 'Tiny changes, remarkable results.',
      tags: ['📘 Productivity', '🧠 Popular']
    },
    {
      title: 'Deep Work',
      description: 'Guard your time. Focus deeply.',
      tags: ['🖥️ Focus', '🔥 High Retention']
    },
    {
      title: 'The War of Art',
      description: 'Beat resistance. Create daily.',
      tags: ['🎨 Creative Flow', '📚 Reader Favorite']
    }
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
      }}>Featured Mind Maps</h2>

      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '32px'
      }}>
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => alert(`Open: ${card.title}`)}
            style={{
              background: 'white',
              padding: '28px',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '8px'
              }}>{card.title}</h3>
              <p style={{
                fontSize: '15px',
                color: '#4b5563',
                marginBottom: '16px'
              }}>{card.description}</p>
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '16px'
            }}>
              {card.tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    background: '#e0f2fe',
                    color: '#1e40af',
                    fontSize: '12px',
                    fontWeight: '500',
                    padding: '6px 12px',
                    borderRadius: '20px'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

