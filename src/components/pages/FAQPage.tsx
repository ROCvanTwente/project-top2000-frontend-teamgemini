export function FAQPage() {
  // FAQ content and accordion functionality should be handled by backend/Razor

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '3rem 0' }}>
      <div style={{ maxWidth: '896px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ width: '4px', height: '3rem', background: 'linear-gradient(to bottom, black, #4b5563)' }}></div>
          <h1>Veelgestelde Vragen</h1>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>
            FAQ inhoud wordt weergegeven door de backend/Razor
          </p>
        </div>
      </div>
    </div>
  );
}
