import { useState } from "react";
import Login from "../loginComponents/Login";
import Register from "../loginComponents/Register";
import ForgotPassword from "../loginComponents/ForgotPassword";
import { LogIn, UserPlus } from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");

  const renderForm = () => {
    switch (mode) {
      case "login":
        return (
          <Login
            onForgotPassword={() => setMode("forgot")}
            onLoggedIn={(redirect) => {
              window.location.href = redirect; // redirect to homepage after login
            }}
          />
        );
      case "register":
        return <Register onRegistered={() => setMode("login")} />;
      case "forgot":
        return <ForgotPassword onBack={() => setMode("login")} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-600 shadow-lg mb-4">
            {mode === "login" || mode === "forgot" ? (
              <LogIn size={40} className="text-white" />
            ) : (
              <UserPlus size={40} className="text-white" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-neutral-900">
            {mode === "login"
              ? "Inloggen"
              : mode === "register"
                ? "Registreren"
                : "Wachtwoord vergeten"}
          </h1>
        </div>
        {renderForm()}
        {mode !== "forgot" && (
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
        )}
      </div>
    </div>
  );
}
