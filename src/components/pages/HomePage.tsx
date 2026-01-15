import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import Top9Songs from '../Songs';
import Top9Artists from '../Artists';
// @ts-ignore
import { fetchFromAPI } from '../../api.js';

const carouselImages = [
  {
    url: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'TOP 2000 Live',
    description: 'Beleef de beste muziek aller tijden'
  },
  {
    url: 'https://images.unsplash.com/photo-1585692352038-83025e0333bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Radio 2 TOP 2000',
    description: 'Van 25 december tot 31 december'
  },
  {
    url: 'https://images.unsplash.com/photo-1629426958038-a4cb6e3830a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Klassiekers & Legendes',
    description: 'De tijdloze songs die generaties verbinden'
  }
];

interface Top5Song {
  songId: number;
  position: number;
  title: string;
  artist: string;
  releaseYear: number | null;
}

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [top5, setTop5] = useState<Top5Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTop5 = async () => {
      try {
        setLoading(true);
        setError(null);
        setTop5([]);

        const data: Top5Song[] = await fetchFromAPI('top5songs/2024');
        setTop5(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? 'Fout bij ophalen van Top 5');
        setTop5([]);
      } finally {
        setLoading(false);
      }
    };

    loadTop5();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Carousel */}
      <div style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
        {carouselImages.map((image, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 1s'
            }}
          >
            <ImageWithFallback
              src={image.url}
              alt={image.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3), transparent)'
            }}>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '2rem',
                color: 'white',
                maxWidth: '1280px',
                margin: '0 auto'
              }}>
                <h2>{image.title}</h2>
                <p style={{ fontSize: '1.25rem' }}>{image.description}</p>
              </div>
            </div>
          </div>
        ))}

        <button onClick={prevSlide} className="carousel-btn left">‹</button>
        <button onClick={nextSlide} className="carousel-btn right">›</button>
      </div>

      {/* Top 9 Songs */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        <Top9Songs onNavigate={onNavigate} />
      </div>

      {/* Top 9 Artists */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        <Top9Artists onNavigate={onNavigate} />
      </div>

      {/* Top 5 2024 */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1rem' }}>
        <div className="responsive-grid-2">
          <div>
            <h2>Top 5 van 2024</h2>

            {loading && <p>Bezig met laden...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && top5.map(song => (
              <div
                key={song.songId}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '0.75rem'
                }}
              >
                <strong>{song.position}</strong>
                <div>
                  <div>{song.title}</div>
                  <div style={{ color: '#374151' }}>{song.artist}</div>
                  {song.releaseYear && (
                    <small>{song.releaseYear}</small>
                  )}
                </div>
              </div>
            ))}

            {!loading && !error && top5.length === 0 && (
              <p>Geen data gevonden.</p>
            )}

            <button
              onClick={() => onNavigate('rankings')}
              style={{
                marginTop: '1rem',
                width: '100%',
                backgroundColor: 'black',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none'
              }}
            >
              Bekijk volledige lijst 2024
            </button>
          </div>

          {/* Welcome */}
          <div>
            <h2>Welkom bij de TOP 2000</h2>
            <p>
              Hier vind je alles over de grootste muzieklijst van Nederland.
              Ontdek nummers, artiesten en edities door de jaren heen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
