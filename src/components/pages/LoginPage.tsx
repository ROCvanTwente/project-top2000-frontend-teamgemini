import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate: _onNavigate }: LoginPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header + icon */}
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
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(mode, "submit ignored");
          }}
          className="space-y-4"
        >
          {/* Always shown */}
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
            required
          />

          <input
            type="password"
            placeholder="Wachtwoord"
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
            required
          />

          {/* Only for register */}
          {mode === "register" && (
            <input
              type="password"
              placeholder="Herhaal wachtwoord"
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg shadow"
          >
            {mode === "login" ? "Inloggen" : "Account aanmaken"}
          </button>
        </form>

        {/* Switch */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            {mode === "login"
              ? "Nog geen account? Registreren"
              : "Al een account? Inloggen"}
          </button>
        </div>
      </div>
    </div>
  );
}
