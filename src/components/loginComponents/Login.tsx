import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface LoginProps {
  onForgotPassword: () => void;
}

export default function Login({ onForgotPassword }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { setUserFromBackend } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("https://demotop2000.runasp.net/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const message = await response.json();
        setError(message.message || "Login failed");
        return;
      }

      const data = await response.json();
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      setUserFromBackend({
        email: data.email,
        role: data.roles[0] || "user",
      });

      console.log("Login successful", data);

    } catch (err) {
      setError("Login failed");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
        required
      />
      <input
        type="password"
        placeholder="Wachtwoord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
        required
      />

      <div className="text-right">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Wachtwoord vergeten?
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg shadow"
      >
        Inloggen
      </button>
    </form>
  );
}
