import { useEffect, useState } from "react";
import { fetchFromAPI } from "./api";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchFromAPI("Users/Index")
      .then(setUsers)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Users Placeholder</h1>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}
