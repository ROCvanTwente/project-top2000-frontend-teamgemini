export function ContactPage() {
  // Contact form and submission should be handled by backend/Razor

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-black"></div>
          <h1>Contact</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
          Contactformulier wordt afgehandeld door de backend/Razor
        </div>
      </div>
    </div>
  );
}
