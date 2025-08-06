
'use client';

export default function FeaturedStats() {
  const stats = [
    { icon: '📚', label: '10,847', sublabel: 'readers never forget' },
    { icon: '🧠', label: '73%', sublabel: 'more insights retained' },
    { icon: '💬', label: '4.9/5', sublabel: 'book confidence boost' },
    { icon: '⚡', label: '2.3s', sublabel: 'mind map generation' }
  ];

  return (
    <section style={{
      background: 'linear-gradient(135deg, #fefefe 0%, #f8fafc 100%)',
      padding: '32px 0',
      fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Subtle top border */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(139, 92, 246, 0.2), transparent)'
      }} />
      
      {/* Infinite scrolling ticker */}
      <div style={{
        display: 'flex',
        animation: 'scroll 30s linear infinite',
        width: 'max-content'
      }}>
        {/* First set */}
        {stats.map((stat, i) => (
          <div
            key={`first-${i}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 32px',
              marginRight: '48px',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.1)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.3s ease',
              cursor: 'default',
              minWidth: 'fit-content',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
            }}
          >
            <span style={{ fontSize: '20px' }}>{stat.icon}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                background: stat.label.match(/^\d/) ? 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)' : 'none',
                WebkitBackgroundClip: stat.label.match(/^\d/) ? 'text' : 'unset',
                WebkitTextFillColor: stat.label.match(/^\d/) ? 'transparent' : 'inherit',
                backgroundClip: stat.label.match(/^\d/) ? 'text' : 'unset'
              }}>
                {stat.label}
              </span>
              {stat.sublabel && (
                <span style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  {stat.sublabel}
                </span>
              )}
            </div>
          </div>
        ))}
        
        {/* Second set for seamless loop */}
        {stats.map((stat, i) => (
          <div
            key={`second-${i}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 32px',
              marginRight: '48px',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.1)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.3s ease',
              cursor: 'default',
              minWidth: 'fit-content',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
            }}
          >
            <span style={{ fontSize: '20px' }}>{stat.icon}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                background: stat.label.match(/^\d/) ? 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)' : 'none',
                WebkitBackgroundClip: stat.label.match(/^\d/) ? 'text' : 'unset',
                WebkitTextFillColor: stat.label.match(/^\d/) ? 'transparent' : 'inherit',
                backgroundClip: stat.label.match(/^\d/) ? 'text' : 'unset'
              }}>
                {stat.label}
              </span>
              {stat.sublabel && (
                <span style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  {stat.sublabel}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        section:hover div[style*="animation"] {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}


