
'use client';

export default function FeaturedStats() {
  const stats = [
    { icon: '🎯', label: 'Curated for you' },
    { icon: '🖥️', label: '1,234 readers today' },
    { icon: '📚', label: '542 books logged' },
    { icon: '🧠', label: '9,876 insights retained' }
  ];

  return (
    <section style={{
      background: '#f9fafb',
      padding: '40px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        textAlign: 'center'
      }}>
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{
              background: 'white',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              fontSize: '36px',
              marginBottom: '12px'
            }}>{stat.icon}</div>
            <p style={{
              fontSize: '15px',
              fontWeight: '500',
              color: '#4b5563'
            }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


