import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";

interface AuthPageProps {
  onNavigate: (page: string) => void;
}

export function AuthPage({ onNavigate }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-600 shadow-lg mb-4">
            {mode === "login" ? (
              <LogIn size={40} className="text-white" />
            ) : (
              <UserPlus size={40} className="text-white" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-neutral-900">
            {mode === "login" ? "Inloggen" : "Registreren"}
          </h1>
          <p className="text-neutral-600 mt-2">
            Functionaliteit wordt afgehandeld door backend/Razor
          </p>
        </div>

        {/* Fake form placeholder */}
        <div className="bg-neutral-100 p-6 rounded-lg text-neutral-700 text-center border border-neutral-200">
          Hier komt het {mode === "login" ? "login" : "registratie"} formulier
        </div>

        {/* Switch */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            {mode === "login"
              ? "Geen account? Registreren"
              : "Heb je al een account? Inloggen"}
          </button>
        </div>

        {/* Example navigation button */}
        <div className="mt-4">
          <button
            onClick={() => onNavigate("home")}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg shadow"
          >
            Ga verder (fake)
          </button>
        </div>
      </div>
    </div>
  );
}
