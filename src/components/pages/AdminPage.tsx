interface AdminPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function AdminPage({ onNavigate: _onNavigate }: AdminPageProps) {
  // All admin functionality should be handled by backend/Razor

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-[var(--bright-blue)] to-[var(--vivid-purple)]"></div>
          <h1>Beheer</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
          Beheersfuncties worden afgehandeld door de backend/Razor
        </div>
      </div>
    </div>
  );
}
