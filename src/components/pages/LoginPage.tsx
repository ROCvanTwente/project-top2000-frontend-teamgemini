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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(email, password);
    if (success) {
      onNavigate('home');
    } else {
      setError('Ongeldige inloggegevens');
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
            <h3 className="mb-4">Demo accounts</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="mb-1">Normale gebruiker:</div>
                <div className="text-gray-600">
                  Email: user@top2000.nl<br />
                  Wachtwoord: user123
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="mb-1">Beheerder:</div>
                <div className="text-gray-600">
                  Email: admin@top2000.nl<br />
                  Wachtwoord: admin123
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}