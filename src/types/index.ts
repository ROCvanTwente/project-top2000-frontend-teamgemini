// Type definitions for the Top 2000 application
// These types should match the data structure returned by your backend API

export interface Song {
  id: string;
  title: string;
  artistId: string;
  releaseYear: number;
  lyrics?: string;
  albumCover?: string;
  youtubeLink?: string;
  timesInTop2000: number;
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  wikipediaLink?: string;
  website?: string;
  photo?: string;
  timesInTop2000: number;
}

export interface Ranking {
  year: number;
  songId: string;
  position: number;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Playlist {
  id: string;
  userId: string;
  name: string;
  songIds: string[];
  createdAt: Date | string; // API returns string (ISO 8601), convert to Date if needed
}

export interface DJ {
  name: string;
  wikipediaLink: string;
}
