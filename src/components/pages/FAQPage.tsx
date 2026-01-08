import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Wanneer wordt de Top 2000 uitgezonden?',
    answer: 'De Top 2000 wordt elk jaar uitgezonden tussen 25 december (eerste kerstdag) om 08:00 uur en 31 december om 24:00 uur op NPO Radio 2.'
  },
  {
    question: 'Hoe kan ik stemmen voor de Top 2000?',
    answer: 'Stemmen kan via de officiële website van NPO Radio 2. Meestal opent de stemperiode eind november en kun je tot begin december stemmen op je favoriete nummers.'
  },
  {
    question: 'Hoeveel nummers mag ik opgeven?',
    answer: 'Je mag maximaal 35 nummers opgeven bij het stemmen. Deze nummers kunnen uit alle tijden komen en in willekeurige volgorde worden ingevoerd.'
  },
  {
    question: 'Waarom staat mijn favoriete nummer niet in de lijst?',
    answer: 'De lijst wordt volledig bepaald door de stemmen van luisteraars. Als een nummer niet voldoende stemmen krijgt, komt het niet in de Top 2000. Ook kunnen nieuwe nummers tijd nodig hebben om bekend genoeg te worden.'
  },
  {
    question: 'Kan ik de Top 2000 terugluisteren?',
    answer: 'Ja, alle nummers zijn na afloop beschikbaar via NPO Radio 2 Extra en diverse streamingdiensten. Ook kun je de lijst volgen via de website en apps.'
  },
  {
    question: 'Waarom verandert de volgorde elk jaar?',
    answer: 'De lijst wordt elk jaar opnieuw samengesteld op basis van nieuwe stemmen. Muziekvoorkeuren en nostalgie kunnen veranderen, waardoor nummers kunnen stijgen of dalen in de lijst.'
  },
  {
    question: 'Hoeveel mensen stemmen er gemiddeld?',
    answer: 'Jaarlijks stemmen meer dan 1,5 miljoen mensen mee aan de Top 2000. Het aantal stemmers groeit nog steeds elk jaar.'
  },
  {
    question: 'Welk nummer staat het vaakst op nummer 1?',
    answer: 'Bohemian Rhapsody van Queen heeft het vaakst de eerste plaats bereikt. Dit nummer wordt gezien als één van de grootste klassiekers in de muziekgeschiedenis.'
  },
  {
    question: 'Kunnen Nederlandstalige nummers ook in de lijst komen?',
    answer: 'Absoluut! Nederlandse artiesten en Nederlandstalige nummers doen het steeds beter in de lijst. Nummers van artiesten als Doe Maar, Boudewijn de Groot en Guus Meeuwis staan regelmatig hoog genoteerd.'
  },
  {
    question: 'Is er een app beschikbaar?',
    answer: 'Ja, NPO Radio 2 heeft een eigen app waarmee je de Top 2000 kunt volgen, notificaties kunt instellen voor je favoriete nummers en de lijst kunt bekijken.'
  }
];

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-black"></div>
          <h1>Veelgestelde Vragen</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <HelpCircle className="text-black flex-shrink-0" size={32} />
            <p className="text-gray-700">
              Hieronder vind je antwoorden op de meest gestelde vragen over de Top 2000. 
              Staat je vraag er niet bij? Neem dan contact met ons op via de contactpagina.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <h3 className="pr-4">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="flex-shrink-0 text-black" size={24} />
                ) : (
                  <ChevronDown className="flex-shrink-0 text-gray-400" size={24} />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-700">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-black rounded-lg p-8 text-white text-center">
          <h2 className="text-white mb-4">Nog meer vragen?</h2>
          <p className="mb-6">
            Neem contact met ons op voor meer informatie over de Top 2000
          </p>
          <a
            href="#contact"
            className="inline-block bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Naar contactpagina
          </a>
        </div>
      </div>
    </div>
  );
}