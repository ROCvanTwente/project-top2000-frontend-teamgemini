import { useState } from 'react';

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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '3rem 0' }}>
      <div style={{ maxWidth: '896px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ width: '4px', height: '3rem', backgroundColor: 'black' }}></div>
          <h1>Veelgestelde Vragen</h1>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2rem', flexShrink: 0 }}>❓</span>
            <p style={{ color: '#4b5563' }}>
              Hieronder vind je antwoorden op de meest gestelde vragen over de Top 2000. 
              Staat je vraag er niet bij? Neem dan contact met ons op via de contactpagina.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <h3 style={{ paddingRight: '1rem', margin: 0 }}>{faq.question}</h3>
                <span style={{ 
                  flexShrink: 0, 
                  fontSize: '1.5rem',
                  color: openIndex === index ? 'black' : '#9ca3af'
                }}>
                  {openIndex === index ? '▲' : '▼'}
                </span>
              </button>
              {openIndex === index && (
                <div style={{ padding: '0 1.5rem 1rem 1.5rem', color: '#4b5563' }}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ 
          marginTop: '2rem', 
          backgroundColor: 'black', 
          borderRadius: '8px',
          padding: '2rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Nog meer vragen?</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Neem contact met ons op voor meer informatie over de Top 2000
          </p>
          <a
            href="#contact"
            style={{
              display: 'inline-block',
              backgroundColor: 'white',
              color: 'black',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none'
            }}
          >
            Naar contactpagina
          </a>
        </div>
      </div>
    </div>
  );
}