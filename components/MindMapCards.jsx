'use client';

export default function MindMapCards() {
  const cards = [
    {
      title: 'Atomic Habits',
      description: 'Tiny changes, remarkable results.',
      tags: ['📘 Productivity', '🧠 Popular'],
      glow: '0 8px 24px rgba(139, 92, 246, 0.08), 0 0 20px rgba(167, 139, 250, 0.06), 0 4px 12px rgba(196, 181, 253, 0.12)' // Purple glow
    },
    {
      title: 'Deep Work',
      description: 'Guard your time. Focus deeply.',
      tags: ['🖥️ Focus', '🔥 High Retention'],
      glow: '0 8px 24px rgba(6, 182, 212, 0.08), 0 0 20px rgba(34, 211, 238, 0.06), 0 4px 12px rgba(103, 232, 249, 0.12)' // Cyan glow
    },
    {
      title: 'The War of Art',
      description: 'Beat resistance. Create daily.',
      tags: ['🎨 Creative Flow', '📚 Reader Favorite'],
      glow: '0 8px 24px rgba(251, 146, 60, 0.08), 0 0 20px rgba(253, 186, 116, 0.06), 0 4px 12px rgba(254, 215, 170, 0.12)' // Orange glow
    }
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
              boxShadow: card.glow,
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
              {card.tags.map((tag, i) => {
                const tagColors = [
                  { bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', color: '#92400e', shadow: 'rgba(245, 158, 11, 0.2)' },
                  { bg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', color: '#1a3798', shadow: 'rgba(35, 73, 180, 0.2)' },
                  { bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', color: '#166534', shadow: 'rgba(34, 197, 94, 0.2)' },
                  { bg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', color: '#be185d', shadow: 'rgba(236, 72, 153, 0.2)' },
                  { bg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', color: '#0c4a6e', shadow: 'rgba(14, 165, 233, 0.2)' }
                ];
                const colorIndex = i % tagColors.length;
                return (
                  <span
                    key={i}
                    style={{
                      background: tagColors[colorIndex].bg,
                      color: tagColors[colorIndex].color,
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '8px 14px',
                      borderRadius: '16px',
                      boxShadow: `0 4px 8px ${tagColors[colorIndex].shadow}`,
                      border: `1px solid ${tagColors[colorIndex].color}20`,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = `0 6px 12px ${tagColors[colorIndex].shadow}`;
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = `0 4px 8px ${tagColors[colorIndex].shadow}`;
                    }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

