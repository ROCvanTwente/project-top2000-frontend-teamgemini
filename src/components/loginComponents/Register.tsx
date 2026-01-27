import { useState } from "react";

interface RegisterProps {
  onRegistered: () => void;
}

export default function Register({ onRegistered }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function parseJwt(token: string) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("https://demotop2000.runasp.net/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();

          // Handle Email errors (including "already used")
          if (errorData?.errors?.Email || errorData?.errors?.email) {
            setError("Email is connected to another account");
          }
          // Handle Password errors
          else if (errorData?.errors?.Password || errorData?.errors?.password) {
            setError(errorData.errors.Password?.[0] || errorData.errors.password?.[0]);
          }
          // Handle ConfirmPassword errors
          else if (errorData?.errors?.ConfirmPassword || errorData?.errors?.confirmPassword) {
            setError(errorData.errors.ConfirmPassword?.[0] || errorData.errors.confirmPassword?.[0]);
          }
          // Fallback
          else if (errorData?.message) {
            setError(errorData.message);
          } else {
            setError("E-mail is connected to another account");
          }
        } catch (jsonError) {
          setError("Failed to parse server response.");
          console.error("JSON parsing error:", jsonError);
        }
        return;
      }

      const data = await response.json();
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      const payload = parseJwt(data.token);
      console.log(
        "User roles:",
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      );

      console.log("Registration successful", data);

      onRegistered();
    } catch (err) {
      setError("Registration failed");
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
      <input
        type="password"
        placeholder="Herhaal wachtwoord"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
        required
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg shadow"
      >
        Account aanmaken
      </button>
    </form>
  );
}
