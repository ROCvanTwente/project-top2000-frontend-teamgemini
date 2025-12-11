import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const carouselImages = [
  {
    url: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBjcm93ZCUyMGZlc3RpdmFsfGVufDF8fHx8MTc2NDYyNzIzNnww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'TOP 2000 Live',
    description: 'Beleef de beste muziek aller tijden'
  },
  {
    url: 'https://images.unsplash.com/photo-1585692352038-83025e0333bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcmFkaW8lMjBtaWNyb3Bob25lfGVufDF8fHx8MTc2NDY4MDM1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Radio 2 TOP 2000',
    description: 'Van 25 december tot 31 december'
  },
  {
    url: 'https://images.unsplash.com/photo-1629426958038-a4cb6e3830a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZHMlMjBtdXNpY3xlbnwxfHx8fDE3NjQ2MzY0Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Klassiekers & Legendes',
    description: 'De tijdloze songs die generaties verbinden'
  }
];

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

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
                <h2 style={{ marginBottom: '0.5rem' }}>{image.title}</h2>
                <p style={{ fontSize: '1.25rem' }}>{image.description}</p>
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem'
          }}
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem'
          }}
        >
          ›
        </button>

        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem'
        }}>
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: index === currentSlide ? '2rem' : '0.75rem',
                height: '0.75rem',
                borderRadius: '9999px',
                backgroundColor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1rem' }}>
        <div className="responsive-grid-2">
          {/* Top 5 2024 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '4px', height: '2rem', backgroundColor: 'black' }}></div>
              <h2 style={{ margin: 0 }}>Top 5 van 2024</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Top 5 songs will be provided by backend/Razor */}
            </div>
            <button
              onClick={() => onNavigate('rankings')}
              style={{
                marginTop: '1.5rem',
                width: '100%',
                backgroundColor: 'black',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Bekijk volledige lijst 2024
            </button>
          </div>

          {/* Welcome Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '4px', height: '2rem', backgroundColor: 'black' }}></div>
              <h2 style={{ margin: 0 }}>Welkom bij de TOP 2000</h2>
            </div>
            <div>
              <p>
                Welkom bij de officiële TOP 2000 website! Hier vind je alles over de grootste muzieklijst van Nederland. 
                Elk jaar, tussen Kerst en Oud & Nieuw, brengt NPO Radio 2 de TOP 2000: een lijst van de beste nummers 
                aller tijden, samengesteld door de luisteraars.
              </p>
              <p>
                Op deze website kun je:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'black' }}>•</span>
                  <span>De volledige lijsten van alle jaren bekijken</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'black' }}>•</span>
                  <span>Gedetailleerde informatie vinden over artiesten en nummers</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'black' }}>•</span>
                  <span>Je eigen persoonlijke afspeellijsten samenstellen</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'black' }}>•</span>
                  <span>De ontwikkeling van nummers door de jaren heen volgen</span>
                </li>
              </ul>
            </div>

            <div style={{ 
              marginTop: '2rem', 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem'
            }}>
              <div style={{ 
                backgroundColor: 'black', 
                padding: '1.5rem', 
                borderRadius: '8px',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>2000+</div>
                <div style={{ fontSize: '0.875rem' }}>Nummers</div>
              </div>
              <div style={{ 
                backgroundColor: '#1f2937', 
                padding: '1.5rem', 
                borderRadius: '8px',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>25+</div>
                <div style={{ fontSize: '0.875rem' }}>Edities</div>
              </div>
              <div style={{ 
                backgroundColor: '#4b5563', 
                padding: '1.5rem', 
                borderRadius: '8px',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>24/7</div>
                <div style={{ fontSize: '0.875rem' }}>Toegankelijk</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}