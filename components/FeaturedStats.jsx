
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
      {/* Top moving gradient shine (moving right) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '200%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.15), rgba(16, 185, 129, 0.15), transparent)',
        animation: 'shimmerRight 8s ease-in-out infinite'
      }} />
      
      {/* Bottom moving gradient shine (moving left) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: '-100%',
        width: '200%',
        height: '2px',
        background: 'linear-gradient(270deg, transparent, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.15), rgba(251, 113, 133, 0.15), transparent)',
        animation: 'shimmerLeft 10s ease-in-out infinite reverse'
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
              border: '1px solid rgba(35, 73, 180, 0.1)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.3s ease',
              cursor: 'default',
              minWidth: 'fit-content',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(35, 73, 180, 0.15)';
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
                color: stat.label.match(/^\d/) ? '#2349b4' : '#1f2937'
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
              border: '1px solid rgba(35, 73, 180, 0.1)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.3s ease',
              cursor: 'default',
              minWidth: 'fit-content',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(35, 73, 180, 0.15)';
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
                color: stat.label.match(/^\d/) ? '#2349b4' : '#1f2937'
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
        
        @keyframes shimmerRight {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes shimmerLeft {
          0% { transform: translateX(100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        
        section:hover div[style*="animation"]:not([style*="shimmer"]) {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}


