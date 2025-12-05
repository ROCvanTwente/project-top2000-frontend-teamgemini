import React from 'react';
import { ArrowLeft, Music } from 'lucide-react';
import { artists, songs } from '../../data/mockData';

interface ArtistSongsPageProps {
  artistId: string;
  onNavigate: (page: string, params?: any) => void;
}

export function ArtistSongsPage({ artistId, onNavigate }: ArtistSongsPageProps) {
  const artist = artists.find(a => a.id === artistId);
  const artistSongs = songs.filter(s => s.artistId === artistId);

  if (!artist) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2>Artiest niet gevonden</h2>
          <button
            onClick={() => onNavigate('artists')}
            className="mt-4 text-[var(--bright-blue)] hover:underline"
          >
            Terug naar overzicht
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => onNavigate('artist-detail', { artistId })}
          className="flex items-center gap-2 text-[var(--bright-blue)] hover:text-[var(--vivid-purple)] transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Terug naar {artist.name}
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-[var(--bright-blue)] to-[var(--vivid-purple)]"></div>
          <div>
            <h1>Alle nummers van {artist.name}</h1>
            <p className="text-gray-600">{artistSongs.length} {artistSongs.length === 1 ? 'nummer' : 'nummers'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-100">
            {artistSongs.map(song => (
              <div
                key={song.id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onNavigate('song-detail', { songId: song.id })}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[var(--bright-blue)] to-[var(--vivid-purple)] rounded-lg flex items-center justify-center text-white">
                    <Music size={24} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="mb-1 hover:text-[var(--bright-blue)]">{song.title}</h3>
                    <p className="text-gray-600 text-sm">Uitgegeven in {song.releaseYear}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm px-3 py-1 bg-[var(--bright-blue)] text-white rounded-full">
                      {song.timesInTop2000}x genoteerd
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {artistSongs.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Geen nummers gevonden voor deze artiest
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
