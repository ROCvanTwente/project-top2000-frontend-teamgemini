const API_URL = import.meta.env.VITE_API_URL;

export async function fetchFromAPI(endpoint) {
  const url = API_URL ? `${API_URL}/${endpoint}` : `/${endpoint}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}
