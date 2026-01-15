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

export const fetchArtistById = async (artistId) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const baseUrl = apiUrl ? apiUrl : '';
    const response = await fetch(`${baseUrl}/api/artist/${artistId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch artist');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching artist:', error);
    throw error;
  }
};

export const fetchArtistSongs = async (artistId) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const baseUrl = apiUrl ? apiUrl : '';
    const response = await fetch(`${baseUrl}/api/artist/${artistId}/songs`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch artist songs');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching artist songs:', error);
    throw error;
  }
};
