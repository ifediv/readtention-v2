export default function HowItWorks() {
  return (
    <div className="how-it-works" style={{ padding: '40px 16px', backgroundColor: '#fafafa', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#1d2233', marginBottom: '32px' }}>How It Works</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 8px 16px rgba(216, 245, 227, 0.6)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '28px' }}>📚</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '600' }}>Save Key Ideas</div>
            <div style={{ fontSize: '14px', color: '#555' }}>Highlight important takeaways from any book you’re reading.</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 8px 16px rgba(229, 236, 251, 0.6)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '28px' }}>🧠</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '600' }}>Generate Mind Maps</div>
            <div style={{ fontSize: '14px', color: '#555' }}>Our AI turns your notes into structured, visual mind maps.</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 8px 16px rgba(253, 236, 200, 0.6)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '28px' }}>🔁</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '600' }}>Remember Effortlessly</div>
            <div style={{ fontSize: '14px', color: '#555' }}>Review maps regularly and retain more over time.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
