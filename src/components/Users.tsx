import { useEffect, useState } from "react";
import { fetchFromAPI } from "../api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFromAPI("Users/Index")
      .then(setUsers)
      .catch(err => setError(err.message));
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
