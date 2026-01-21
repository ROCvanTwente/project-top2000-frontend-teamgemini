import { useState, useEffect } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
// @ts-ignore
import { fetchFromAPI } from "../../api.js";

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1756978303719-57095d8bd250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "TOP 2000 Live",
    description: "Beleef de beste muziek aller tijden",
  },
  {
    url: "https://images.unsplash.com/photo-1585692352038-83025e0333bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Radio 2 TOP 2000",
    description: "Van 25 december tot 31 december",
  },
  {
    url: "https://images.unsplash.com/photo-1629426958038-a4cb6e3830a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Klassiekers & Legendes",
    description: "De tijdloze songs die generaties verbinden",
  },
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadTop5 = async () => {
      try {
        setLoading(true);
        setError(null);
        setTop5([]);

        const data: Top5Song[] = await fetchFromAPI("top5songs/2024");
        setTop5(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Fout bij ophalen van Top 5");
        setTop5([]);
      } finally {
        setLoading(false);
      }
    };

    loadTop5();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setSuccessMessage('Liedje succesvol opgeslagen!');
      window.history.replaceState(null, '', '/');
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, []);
  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide(prev => (prev + 1) % carouselImages.length);
  }, 5000);

  return () => clearInterval(interval);
}, []);


  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  // Auto change every 4 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}> 
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mx-auto mb-4 w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-red-500/30"></div>
              <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Laden...</h2>
            <p className="text-white/80">Even geduld</p>
            <div className="mt-4 flex items-center justify-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></span>
              <span
                className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.15s" }}
              ></span>
              <span
                className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              ></span>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#00f541ff',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            fontSize: '16px',
            fontWeight: 'bold',
            animation: 'fadeIn 0.5s ease-in-out',
            maxWidth: '300px',
            textAlign: 'center'
          }}
        >
          {successMessage}
        </div>
      )}

      <div style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
        {carouselImages.map((image, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              inset: 0,
              opacity: index === currentSlide ? 1 : 0,
              transition: "opacity 1s",
            }}
          >
            <ImageWithFallback
              src={image.url}
              alt={image.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3), transparent)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "2rem",
                  color: "white",
                  maxWidth: "1280px",
                  margin: "0 auto",
                }}
              >
                <h2>{image.title}</h2>
                <p style={{ fontSize: "1.25rem" }}>{image.description}</p>
              </div>
            </div>
          </div>
        ))}
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
  {carouselImages.map((_, index) => (
    <span
      key={index}
      onClick={() => setCurrentSlide(index)}
      style={{
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
      }}
    ></span>
  ))}
</div>


        {/* Arrows */}
        <button
          onClick={prevSlide}
          style={{
            position: "absolute",
            top: "50%",
            left: "1rem",
            transform: "translateY(-50%)",
            fontSize: "2rem",
            background: "rgba(0,0,0,0.4)",
            border: "none",
            padding: "0.5rem 1rem",
            color: "white",
            cursor: "pointer",
            zIndex: 10,
            borderRadius: "6px",
          }}
        >
          ‹
        </button>

        <button
          onClick={nextSlide}
          style={{
            position: "absolute",
            top: "50%",
            right: "1rem",
            transform: "translateY(-50%)",
            fontSize: "2rem",
            background: "rgba(0,0,0,0.4)",
            border: "none",
            padding: "0.5rem 1rem",
            color: "white",
            cursor: "pointer",
            zIndex: 10,
            borderRadius: "6px",
          }}
        >
          ›
        </button>
      </div>

      {/* Top 5 2024 */}
      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1rem" }}
      >
        <div className="responsive-grid-2">
          <div>
            <h2>Top 5 van 2024</h2>

            {loading && <p>Bezig met laden...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading &&
              !error &&
              top5.map((song) => (
                <div
                  key={song.songId}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    background: "#f3f4f6",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <strong>{song.position}</strong>
                  <div>
                    <div><strong>{song.title}</strong></div>
                    <div style={{ color: "#374151" }}>{song.artist}</div>
                    {song.releaseYear && <small>{song.releaseYear}</small>}
                  </div>
                </div>
              ))}

            {!loading && !error && top5.length === 0 && (
              <p>Geen data gevonden.</p>
            )}

            <button
              onClick={() => onNavigate("rankings")}
              style={{
                marginTop: "1rem",
                width: "100%",
                backgroundColor: "black",
                color: "white",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "none",
              }}
            >
              Bekijk volledige lijst 2024
            </button>
          </div>

          {/* Welcome Section */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "2rem",
                  backgroundColor: "black",
                }}
              ></div>
              <h2 style={{ margin: 0 }}>Welkom bij de TOP 2000</h2>
            </div>
            <div>
              <p>
                Welkom bij de officiële TOP 2000 website! Hier vind je alles
                over de grootste muzieklijst van Nederland. Elk jaar, tussen
                Kerst en Oud & Nieuw, brengt NPO Radio 2 de TOP 2000: een lijst
                van de beste nummers aller tijden, samengesteld door de
                luisteraars.
              </p>
              <p>Op deze website kun je:</p>
              <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
                <li
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ color: "black" }}>•</span>
                  <span>De volledige lijsten van alle jaren bekijken</span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ color: "black" }}>•</span>
                  <span>
                    Gedetailleerde informatie vinden over artiesten en nummers
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ color: "black" }}>•</span>
                  <span>Je eigen persoonlijke afspeellijsten samenstellen</span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ color: "black" }}>•</span>
                  <span>
                    De ontwikkeling van nummers door de jaren heen volgen
                  </span>
                </li>
              </ul>
            </div>

            <div
              style={{
                marginTop: "2rem",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  backgroundColor: "black",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.875rem", marginBottom: "0.5rem" }}>
                  2000+
                </div>
                <div style={{ fontSize: "0.875rem" }}>Nummers</div>
              </div>
              <div
                style={{
                  backgroundColor: "#1f2937",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.875rem", marginBottom: "0.5rem" }}>
                  25+
                </div>
                <div style={{ fontSize: "0.875rem" }}>Edities</div>
              </div>
              <div
                style={{
                  backgroundColor: "#4b5563",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.875rem", marginBottom: "0.5rem" }}>
                  24/7
                </div>
                <div style={{ fontSize: "0.875rem" }}>Toegankelijk</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}