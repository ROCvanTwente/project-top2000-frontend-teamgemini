import { useState } from 'react';
import { LogIn, User, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    if (success) {
      onNavigate('home');
    } else {
      setError('Login functionaliteit is nog niet geïmplementeerd. Verbind met uw backend API.');
    }
  };

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
              Log in om je persoonlijke afspeellijsten te beheren
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2">
                <User size={16} className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-black"
                placeholder="je@email.nl"
              />
            </div>

            <div>
              <label className="block mb-2">
                <Lock size={16} className="inline mr-2" />
                Wachtwoord
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-black"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all"
            >
              Inloggen
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <h3 className="mb-2 text-yellow-900">⚠️ Backend Niet Verbonden</h3>
              <p className="text-sm text-yellow-800">
                De login functionaliteit moet worden geïmplementeerd door verbinding te maken met uw backend API.
                Zie de AuthContext component en API_INTEGRATION.md voor implementatie details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}