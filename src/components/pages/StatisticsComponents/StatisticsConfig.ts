export interface StatistiekOptie {
  id: number;
  label: string;
  endpoint: string;
  needsYear: boolean;
  description: string;
}

export const STATISTIEK_OPTIES: StatistiekOptie[] = [
  { 
    id: 1, 
    label: "Grootste Dalers", 
    endpoint: "dalers", 
    needsYear: true,
    description: "Een overzicht van nummers die de meeste plaatsen zijn gezakt ten opzichte van de vorige editie."
  },
  { 
    id: 2, 
    label: "Grootste Stijgers", 
    endpoint: "stijgers", 
    needsYear: true,
    description: "De nummers die de grootste sprong omhoog hebben gemaakt vergeleken met het jaar ervoor."
  },
  { 
    id: 3, 
    label: "De Evergreens", 
    endpoint: "evergreens", 
    needsYear: false,
    description: "De onverwoestbare klassiekers die sinds de start nog nooit een editie van de Top 2000 hebben overgeslagen."
  },
  { 
    id: 4, 
    label: "Nieuwe Binnenkomers", 
    endpoint: "nieuwe-binnenkomers", 
    needsYear: true,
    description: "Nummers die vorig jaar niet in de lijst stonden, maar dit jaar wel een plek hebben veroverd."
  },
  { 
    id: 5, 
    label: "Verdwenen uit de lijst", 
    endpoint: "verdwenen", 
    needsYear: true,
    description: "Nummers die vorig jaar nog in de lijst stonden, maar dit jaar helaas zijn uitgevallen."
  },
  { 
    id: 6, 
    label: "Opnieuw Binnen", 
    endpoint: "opnieuw-binnen", 
    needsYear: true,
    description: "Nummers die al eens eerder in de lijst stonden, eruit vielen, en nu weer terugkeren (Re-entry)."
  },
  { 
    id: 7, 
    label: "Stabiel", 
    endpoint: "stabiel", 
    needsYear: true,
    description: "Nummers die precies op dezelfde positie staan als vorig jaar."
  },
  { 
    id: 8, 
    label: "Aansluitende Posities", 
    endpoint: "aansluitende-posities", 
    needsYear: true,
    description: "Statistiek over nummers die direct op elkaar volgende posities innemen in de lijst."
  },
  { 
    id: 9, 
    label: "Eenmalige Noteringen", 
    endpoint: "eenmalige-noteringen", 
    needsYear: false,
    description: "Unieke nummers die slechts één keer in de hele geschiedenis van de Top 2000 hebben gestaan (Eendagsvliegen)."
  },
  { 
    id: 10, 
    label: "Top Artiesten per Jaar", 
    endpoint: "top-artiesten", 
    needsYear: true,
    description: "Welke artiesten hadden in dit specifieke jaar de meeste noteringen in de Top 2000?"
  },
];