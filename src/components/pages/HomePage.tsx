import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { songs, artists, rankings } from '../../data/mockData';

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  // Get top 5 for 2024
  const top5Rankings = rankings
    .filter(r => r.year === 2024)
    .sort((a, b) => a.position - b.position)
    .slice(0, 5);

  const top5Songs = top5Rankings.map(ranking => {
    const song = songs.find(s => s.id === ranking.songId);
    const artist = song ? artists.find(a => a.id === song.artistId) : null;
    return { ranking, song, artist };
  });

  return (
    <div className="min-h-screen">
      {/* Carousel */}
      <div className="relative h-[500px] overflow-hidden">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ImageWithFallback
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white max-w-7xl mx-auto">
                <h2 className="mb-2">{image.title}</h2>
                <p className="text-xl">{image.description}</p>
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Top 5 2024 */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-black"></div>
              <h2>Top 5 van 2024</h2>
            </div>
            <div className="space-y-4">
              {top5Songs.map(({ ranking, song, artist }) => {
                if (!song || !artist) return null;
                return (
                  <div
                    key={ranking.songId}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-black transition-all cursor-pointer group"
                    onClick={() => onNavigate('song-detail', { songId: song.id })}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white">
                        <span className="text-xl">{ranking.position}</span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="group-hover:underline transition-colors">
                          {song.title}
                        </h3>
                        <p className="text-gray-600">{artist.name}</p>
                      </div>
                      <Play className="text-black opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => onNavigate('rankings')}
              className="mt-6 w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg transition-colors"
            >
              Bekijk volledige lijst 2024
            </button>
          </div>

          {/* Welcome Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-black"></div>
              <h2>Welkom bij de TOP 2000</h2>
            </div>
            <div className="prose max-w-none">
              <p>
                Welkom bij de officiële TOP 2000 website! Hier vind je alles over de grootste muzieklijst van Nederland. 
                Elk jaar, tussen Kerst en Oud & Nieuw, brengt NPO Radio 2 de TOP 2000: een lijst van de beste nummers 
                aller tijden, samengesteld door de luisteraars.
              </p>
              <p>
                Op deze website kun je:
              </p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-start gap-2">
                  <span className="text-black">•</span>
                  <span>De volledige lijsten van alle jaren bekijken</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black">•</span>
                  <span>Gedetailleerde informatie vinden over artiesten en nummers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black">•</span>
                  <span>Je eigen persoonlijke afspeellijsten samenstellen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black">•</span>
                  <span>De ontwikkeling van nummers door de jaren heen volgen</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-black p-6 rounded-lg text-white text-center">
                <div className="text-3xl mb-2">2000+</div>
                <div className="text-sm">Nummers</div>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg text-white text-center">
                <div className="text-3xl mb-2">25+</div>
                <div className="text-sm">Edities</div>
              </div>
              <div className="bg-gray-600 p-6 rounded-lg text-white text-center">
                <div className="text-3xl mb-2">24/7</div>
                <div className="text-sm">Toegankelijk</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}