import { LogIn } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate: _onNavigate }: LoginPageProps) {
  // All login functionality should be handled by backend/Razor

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
              <LogIn className="text-white" size={32} />
            </div>
            <h1>Inloggen</h1>
            <p className="text-gray-600 mt-2">
              Login functionaliteit wordt afgehandeld door de backend/Razor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
