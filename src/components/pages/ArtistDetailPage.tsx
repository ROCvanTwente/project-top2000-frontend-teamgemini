import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, Music, Globe } from 'lucide-react';
import type { Artist, Song } from '../../types';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ArtistDetailPageProps {
  artistId: string;
  onNavigate: (page: string, params?: any) => void;
}

export function ArtistDetailPage({ artistId, onNavigate }: ArtistDetailPageProps) {
  const [artist, _setArtist] = useState<Artist | null>(null);
  const [artistSongs, _setArtistSongs] = useState<Song[]>([]);

  useEffect(() => {
    // TODO: Fetch artist and their songs from your backend API
    // Example: fetch(`/api/artists/${artistId}`), fetch(`/api/songs?artistId=${artistId}`)
  }, [artistId]);

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
          onClick={() => onNavigate('artists')}
          className="flex items-center gap-2 text-[var(--bright-blue)] hover:text-[var(--vivid-purple)] transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Terug naar alle artiesten
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Artist Image */}
            <div className="md:w-1/3 bg-gradient-to-br from-[var(--bright-blue)] to-[var(--vivid-purple)] p-8 flex items-center justify-center">
              {artist.photo ? (
                <ImageWithFallback
                  src={artist.photo}
                  alt={artist.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-white text-center">
                  <Music size={80} className="mx-auto mb-4" />
                  <h2 className="text-white">{artist.name}</h2>
                </div>
              )}
            </div>

            {/* Artist Info */}
            <div className="md:w-2/3 p-8">
              <h1 className="mb-4">{artist.name}</h1>

              <div className="flex flex-wrap gap-4 mb-6">
                {artist.wikipediaLink && (
                  <a
                    href={artist.wikipediaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--bright-blue)] text-[var(--bright-blue)] rounded-lg hover:bg-[var(--bright-blue)] hover:text-white transition-colors"
                  >
                    <ExternalLink size={18} />
                    Wikipedia
                  </a>
                )}
                {artist.website && (
                  <a
                    href={artist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--vivid-purple)] text-[var(--vivid-purple)] rounded-lg hover:bg-[var(--vivid-purple)] hover:text-white transition-colors"
                  >
                    <Globe size={18} />
                    Officiële website
                  </a>
                )}
              </div>

              {artist.bio && (
                <div className="mb-6">
                  <h3 className="mb-3">Biografie</h3>
                  <p className="text-gray-700 leading-relaxed">{artist.bio}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl text-[var(--bright-blue)] mb-1">{artistSongs.length}</div>
                    <div className="text-sm text-gray-600">Nummers in TOP 2000</div>
                  </div>
                  <div>
                    <div className="text-3xl text-[var(--vivid-purple)] mb-1">{artist.timesInTop2000}</div>
                    <div className="text-sm text-gray-600">Jaren genoteerd</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Songs List */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2>Nummers in de TOP 2000</h2>
            <span className="text-gray-600">{artistSongs.length} {artistSongs.length === 1 ? 'nummer' : 'nummers'}</span>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-100">
              {artistSongs.map(song => (
                <div
                  key={song.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onNavigate('song-detail', { songId: song.id })}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="mb-1 hover:text-[var(--bright-blue)]">{song.title}</h3>
                      <p className="text-gray-600 text-sm">Uitgegeven in {song.releaseYear}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">{song.timesInTop2000}x genoteerd</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
