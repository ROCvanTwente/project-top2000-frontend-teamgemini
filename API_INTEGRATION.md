# Backend API Integration Guide

This document explains how to integrate your backend API with this Top 2000 frontend application.

## Overview

All backend logic has been removed from this React application. The frontend is now ready to be connected to your custom backend API through fetch calls. This guide explains where and how to implement these API calls.

## Type Definitions

All data types are defined in `src/types/index.ts`:

- **Song**: Represents a song with metadata (title, artist, release year, etc.)
- **Artist**: Represents an artist with bio, links, and photo
- **Ranking**: Represents a song's position in a specific year
- **User**: Represents a user account
- **Playlist**: Represents a user's playlist
- **DJ**: Represents a DJ with name and Wikipedia link

## API Integration Points

### 1. Authentication (`src/contexts/AuthContext.tsx`)

**Login Function:**
```typescript
const login = async (email: string, password: string): Promise<boolean>
```

**Expected Backend Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response (200 OK):**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "role": "user" | "admin"
}
```

**Logout Function:**
```typescript
const logout = async (): Promise<void>
```

**Expected Backend Endpoint:** `POST /api/auth/logout`

---

### 2. Playlists (`src/contexts/PlaylistContext.tsx`)

**Fetch Playlists:**
- **Endpoint:** `GET /api/playlists?userId={userId}`
- **Response:** Array of Playlist objects

**Create Playlist:**
- **Endpoint:** `POST /api/playlists`
- **Body:** `{ "name": "My Playlist", "userId": "user-id" }`
- **Response:** Newly created Playlist object

**Delete Playlist:**
- **Endpoint:** `DELETE /api/playlists/{playlistId}`

**Add Song to Playlist:**
- **Endpoint:** `POST /api/playlists/{playlistId}/songs`
- **Body:** `{ "songId": "song-id" }`

**Remove Song from Playlist:**
- **Endpoint:** `DELETE /api/playlists/{playlistId}/songs/{songId}`

---

### 3. Songs Data (`src/components/pages/SongsPage.tsx` and similar)

**Fetch All Songs:**
- **Endpoint:** `GET /api/songs`
- **Response:** Array of Song objects

**Fetch Single Song:**
- **Endpoint:** `GET /api/songs/{songId}`
- **Response:** Single Song object

**Fetch Songs by Artist:**
- **Endpoint:** `GET /api/songs?artistId={artistId}`
- **Response:** Array of Song objects

---

### 4. Artists Data

**Fetch All Artists:**
- **Endpoint:** `GET /api/artists`
- **Response:** Array of Artist objects

**Fetch Single Artist:**
- **Endpoint:** `GET /api/artists/{artistId}`
- **Response:** Single Artist object

---

### 5. Rankings Data

**Fetch All Rankings:**
- **Endpoint:** `GET /api/rankings`
- **Response:** Array of Ranking objects

**Fetch Rankings by Year:**
- **Endpoint:** `GET /api/rankings?year={year}`
- **Response:** Array of Ranking objects for that year

**Fetch Rankings for a Song:**
- **Endpoint:** `GET /api/rankings?songId={songId}`
- **Response:** Array of Ranking objects for that song

---

### 6. DJs Data (`src/components/Header.tsx`)

**Fetch DJs:**
- **Endpoint:** `GET /api/djs`
- **Response:** Array of DJ objects

---

## Implementation Steps

### Step 1: Set Up API Base URL

Create an environment variable or configuration file to store your backend API URL:

```typescript
// src/config/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

Then create a `.env` file in the root:
```
VITE_API_URL=http://localhost:3000
```

### Step 2: Create API Utility Functions

Create a helper file for making API requests:

```typescript
// src/utils/api.ts
import { API_BASE_URL } from '../config/api';

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include', // Include cookies for authentication
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
```

### Step 3: Implement API Calls

For each TODO comment in the codebase, replace it with actual API calls. For example, in `SongsPage.tsx`:

**Before:**
```typescript
useEffect(() => {
  // TODO: Fetch data from your backend API
}, []);
```

**After:**
```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      const [songsData, artistsData, rankingsData] = await Promise.all([
        fetchAPI<Song[]>('/api/songs'),
        fetchAPI<Artist[]>('/api/artists'),
        fetchAPI<Ranking[]>('/api/rankings')
      ]);
      setSongs(songsData);
      setArtists(artistsData);
      setRankings(rankingsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### Step 4: Handle Loading and Error States

Each component that fetches data should handle loading and error states:

```typescript
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// In your fetch function:
try {
  // ... fetch data
} catch (err) {
  setError(err instanceof Error ? err.message : 'An error occurred');
} finally {
  setLoading(false);
}

// In your render:
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
```

### Step 5: Implement Authentication Token Management

If your backend uses JWT tokens or similar:

```typescript
// Store token after login
localStorage.setItem('auth_token', token);

// Include token in requests
headers: {
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
}

// Remove token on logout
localStorage.removeItem('auth_token');
```

## Files That Need API Integration

Here's a complete list of files with TODO comments that need API implementation:

1. **Authentication:**
   - `src/contexts/AuthContext.tsx` - Login and logout

2. **Playlists:**
   - `src/contexts/PlaylistContext.tsx` - All playlist operations

3. **Pages:**
   - `src/components/pages/SongsPage.tsx` - Fetch songs, artists, rankings
   - `src/components/pages/ArtistsPage.tsx` - Fetch artists, songs, rankings
   - `src/components/pages/HomePage.tsx` - Fetch songs, artists, rankings
   - `src/components/pages/RankingsPage.tsx` - Fetch songs, artists, rankings
   - `src/components/pages/SongDetailPage.tsx` - Fetch song, artist, rankings
   - `src/components/pages/ArtistDetailPage.tsx` - Fetch artist and songs
   - `src/components/pages/ArtistSongsPage.tsx` - Fetch artist and songs
   - `src/components/pages/AdminPage.tsx` - Fetch artists and songs
   - `src/components/pages/EditSongPage.tsx` - Fetch and update song
   - `src/components/pages/EditArtistPage.tsx` - Fetch and update artist
   - `src/components/pages/PlaylistsPage.tsx` - Fetch songs and artists
   - `src/components/pages/StatisticsPage.tsx` - Fetch songs, artists, rankings

4. **Header:**
   - `src/components/Header.tsx` - Fetch DJs

## Testing Your Integration

1. **Start your backend server** on the configured port (default: localhost:3000)

2. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

3. **Test each feature:**
   - Try logging in
   - Navigate through different pages
   - Create and manage playlists
   - Search and filter songs
   - View artist details

## CORS Configuration

Make sure your backend allows requests from your frontend origin:

```javascript
// Example Express.js CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));
```

## Security Considerations

1. **Never store passwords in plaintext** - Use proper password hashing (bcrypt, argon2)
2. **Use HTTPS in production** - Encrypt data in transit
3. **Implement CSRF protection** - Prevent cross-site request forgery
4. **Validate all inputs** - On both frontend and backend
5. **Use secure session management** - HttpOnly cookies, secure flags
6. **Implement rate limiting** - Prevent abuse of your API
7. **Sanitize user inputs** - Prevent XSS and SQL injection attacks

## Current State

The application will currently:
- Build successfully ✓
- Run without errors ✓
- Display empty data/placeholder messages ✓
- Show warnings in console about unimplemented features ✓

Once you implement the backend API calls, all functionality will work as expected!
