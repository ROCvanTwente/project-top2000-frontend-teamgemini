import { Calendar, Radio, Trophy, Users } from 'lucide-react';

export function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-[var(--bright-blue)] to-[var(--vivid-purple)]"></div>
          <h1>Geschiedenis van de TOP 2000</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="prose max-w-none">
            <p>
              De Top 2000 is een jaarlijkse muzieklijst die sinds 1999 wordt uitgezonden door NPO Radio 2. 
              De lijst wordt ieder jaar samengesteld op basis van stemmen van luisteraars en bevat de 2000 
              populairste nummers aller tijden.
            </p>

            <h2 className="flex items-center gap-2 mt-8 mb-4">
              <Calendar className="text-black" size={24} />
              Belangrijke Momenten
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-black pl-6">
                <h3>1999 - Het Begin</h3>
                <p>
                  De Top 2000 werd voor het eerst uitgezonden tussen Kerst en Oud & Nieuw. 
                  Het idee ontstond bij Radio 2-dj Jeroen van Inkel, die een lijst wilde maken 
                  van de beste nummers van de vorige eeuw.
                </p>
              </div>

              <div className="border-l-4 border-gray-600 pl-6">
                <h3>2000-2010 - Groeiende Populariteit</h3>
                <p>
                  De Top 2000 groeide uit tot een heus evenement. Steeds meer luisteraars gingen 
                  stemmen en het aantal stemmen steeg van enkele duizenden naar meer dan een miljoen.
                </p>
              </div>

              <div className="border-l-4 border-black pl-6">
                <h3>2010-2020 - Nationale Traditie</h3>
                <p>
                  De Top 2000 werd een onmisbaar onderdeel van de feestdagen. Veel Nederlanders 
                  plannen hun activiteiten rond hun favoriete nummers in de lijst.
                </p>
              </div>

              <div className="border-l-4 border-gray-600 pl-6">
                <h3>Heden - Digitaal Tijdperk</h3>
                <p>
                  Met de komst van streaming en sociale media is de Top 2000 ook online een groot 
                  succes. Luisteraars kunnen de lijst volgen via apps en websites, en delen hun 
                  favoriete momenten op sociale media.
                </p>
              </div>
            </div>

            <h2 className="flex items-center gap-2 mt-8 mb-4">
              <Trophy className="text-black" size={24} />
              Weetjes
            </h2>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-black text-xl">•</span>
                <span>Bohemian Rhapsody van Queen staat het vaakst op nummer 1</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black text-xl">•</span>
                <span>Meer dan 15.000 verschillende nummers zijn ooit in de Top 2000 gestaan</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black text-xl">•</span>
                <span>De gemiddelde leeftijd van de nummers is ongeveer 35 jaar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black text-xl">•</span>
                <span>Engels is veruit de meest voorkomende taal in de lijst</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Radio className="mx-auto mb-4 text-black" size={48} />
            <h3 className="mb-2">NPO Radio 2</h3>
            <p className="text-gray-600 text-sm">
              De thuisbasis van de Top 2000 sinds 1999
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="mx-auto mb-4 text-[var(--vivid-purple)]" size={48} />
            <h3 className="mb-2">Miljoenen Stemmers</h3>
            <p className="text-gray-600 text-sm">
              Jaarlijks stemmen miljoenen luisteraars
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Calendar className="mx-auto mb-4 text-[var(--midnight-blue)]" size={48} />
            <h3 className="mb-2">Traditioneel</h3>
            <p className="text-gray-600 text-sm">
              Elke jaar tussen 25 december en 31 december
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}