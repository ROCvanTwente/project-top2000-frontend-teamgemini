import { useState, useEffect } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
// @ts-ignore
import { fetchFromAPI } from "../../api.js";
import "../../styles/HomePage.css";

// Carousel images data
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

// Top 5 Song Interface
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
        const data: any = await fetchFromAPI("top5songs/2024");
        setTop5(Array.isArray(data.$values) ? data.$values : []);
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
    if (urlParams.get("success") === "true") {
      setSuccessMessage("Liedje succesvol opgeslagen!");
      window.history.replaceState(null, "", "/");
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length,
    );

  return (
    <div className="homePageContainer" style={{ minHeight: "100vh", position: "relative" }}>
      {loading && (
        <div className="fixedLoadingOverlay">
          <div className="loadingSpinnerContainer">
            <div className="loadingSpinner">
              <div className="loadingSpinnerBorder"></div>
              <div className="loadingSpinnerAnimated"></div>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Laden...</h2>
            <p className="text-white/80">Even geduld</p>
            <div className="loadingDots">
              <span className="loadingDot"></span>
              <span className="loadingDot"></span>
              <span className="loadingDot"></span>
            </div>
          </div>
        </div>
      )}

      {successMessage && <div className="successMessage">{successMessage}</div>}

      <div className="carouselDiv">
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
{/* Dots onder de Slideshow */}
        <div className="carouselDotContainer">
          {carouselImages.map((_, index) => (
            <span
              key={index}
              className={`carouselDot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
{/* Slideshow arrows */}
        <button className="carouselArrow left" onClick={prevSlide}>
          ‹
        </button>
        <button className="carouselArrow right" onClick={nextSlide}>
          ›
        </button>
      </div>

      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1rem" }}
      >
        <div className="responsive-grid-2">
          <div>
            {/* Top 5 songs ophalen */}
            <h2>Top 5 van 2024</h2>
            {loading && <p>Bezig met laden...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading &&
              !error &&
              top5.map((song) => (
                <div
                  key={song.songId}
                  className="top5Card cursor-pointer"
                  onClick={() =>
                    onNavigate("song-detail", { songId: song.songId })
                  }
                >
                  <strong>{song.position}</strong>
                  <div>
                    <div>
                      <strong>{song.title}</strong>
                    </div>
                    <div className="top5CardArtist">{song.artist}</div>
                    {song.releaseYear && <small>{song.releaseYear}</small>}
                  </div>
                </div>
              ))}
            {!loading && !error && top5.length === 0 && (
              <p>Geen data gevonden.</p>
            )}
            <button
              className="top5Button"
              onClick={() => onNavigate("rankings")}
            >
              Bekijk volledige lijst 2024
            </button>
          </div>
          {/* Extra informatie website */}
          <div>
            <div className="welcomeHeader">
              <div className="welcomeLine"></div>
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
{/* Design buttons */}
            <div className="welcomeGridStats">
              <div className="welcomeStat black">
                <div style={{ fontSize: "1.875rem", marginBottom: "0.5rem" }}>
                  2000+
                </div>
                <div style={{ fontSize: "0.875rem" }}>Nummers</div>
              </div>
              <div className="welcomeStat gray1">
                <div style={{ fontSize: "1.875rem", marginBottom: "0.5rem" }}>
                  25+
                </div>
                <div style={{ fontSize: "0.875rem" }}>Edities</div>
              </div>
              <div className="welcomeStat gray2">
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
