import { useState } from "react";

interface RegisterProps {
  onRegistered: () => void;
}
// Alle data voor registratie wordt hier afgehandeld
export default function Register({ onRegistered }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  function parseJwt(token: string) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Check of wachtwoorden overeenkomen
    if (password !== confirmPassword) {
      setErrors(["Passwords do not match"]);
      return;
    }

    try {
      const response = await fetch(
        "https://demotop2000.runasp.net/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, confirmPassword }),
        }
      );

      if (!response.ok) {
        try {
          const errorData = await response.json();
          const errorList: string[] = [];

// Error check en errors eruit halen
          if (errorData?.[""]) {
            errorList.push(...errorData[""]);
          } else if (errorData?.errors) {
            Object.values(errorData.errors).forEach((arr: any) => {
              if (Array.isArray(arr)) errorList.push(...arr);
            });
          } else if (errorData?.message) {
            errorList.push(errorData.message);
          } else {
            errorList.push("Er is iets misgegaan tijdens registratie.");
          }

          setErrors(errorList);
        } catch (jsonError) {
          setErrors(["Kon server response niet lezen."]);
          console.error("JSON parsing error:", jsonError);
        }
        return;
      }
// jwt token opslaan in localstorage
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
      setErrors(["Registratie mislukt"]);
      console.error(err);
    }
  };
// Formulier voor registratie met error handling
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

      {errors.length > 0 && (
        <div className="text-red-600 text-sm space-y-1">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg shadow"
      >
        Account aanmaken
      </button>
    </form>
  );
}
