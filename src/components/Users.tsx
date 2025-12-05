import { useEffect, useState } from "react";
// @ts-ignore
import { fetchFromAPI } from "../api";

type User = { id: number; name: string };

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFromAPI("api/Users")
      .then(setUsers)
      .catch((err: any) => setError(err.message));
  }, []);

  return (
    <div>
      <h1>Users Placeholder</h1>
      {error && <p style={{color: 'red'}}>API error: {error}</p>}
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}
