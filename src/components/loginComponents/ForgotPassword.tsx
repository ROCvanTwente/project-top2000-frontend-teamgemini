import { useState } from "react";
// Werkt niet echt, alleen voor de flow in loginpagina
interface ForgotPasswordProps {
  onBack: () => void;
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [code, setCode] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Forgot password submit ignored", code);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Voer je code in(123-45XA)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-600"
        required
      />
      <button
        type="submit"
        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg shadow"
      >
        Check de code
      </button>

      <button
        type="button"
        onClick={onBack}
        className="mt-2 w-full text-sm text-red-600 hover:text-red-700 font-medium"
      >
        Terug naar login
      </button>
    </form>
  );
}
