import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface LoginProps {
  onForgotPassword: () => void;
  onLoggedIn: (redirect: string) => void;
}

// Alle data voor login
export default function Login({ onForgotPassword, onLoggedIn }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { setUserFromBackend } = useAuth();

  const parseJwt = (token: string) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Try to log in en fetch
    try {
      const response = await fetch(
        "https://demotop2000.runasp.net/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.token) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("jwt", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      const roleFromResponse = data.role ?? data.roles?.[0];
      let roleFromToken: string | undefined;
      try {
        const payload = parseJwt(data.token);
        const tokenRole =
          payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] ||
          payload.role ||
          payload.roles?.[0];
        roleFromToken = Array.isArray(tokenRole) ? tokenRole[0] : tokenRole;
      } catch {
        roleFromToken = undefined;
      }

      const normalizedRole = (
        roleFromResponse ||
        roleFromToken ||
        "user"
      ).toLowerCase();

      setUserFromBackend({
        email: data.email,
        role: normalizedRole,
      });
      // Login successful
      console.log("Login successful", data);

      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/";
      window.history.replaceState(null, "", "/");
      onLoggedIn(redirect);
    } catch (err) {
      setError("Login failed");
      console.error(err);
    }
  };
// Return form
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
      {/* Test user */}
      <p className="text-sm text-neutral-600">
        Username: User@home.nl<br></br> 
        Password: User123
      </p>
    </form>
  );
}
