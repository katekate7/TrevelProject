// Configuration SEO pour différentes pages de l'application
export const seoConfig = {
  // Page d'accueil
  home: {
    title: "Travel Planner - Travel Planner Intelligent | Voyage Pas Cher & Itinéraires",
    description: "Découvrez Travel Planner, votre travel planner intelligent. Planifiez vos voyages pas cher, consultez la météo travel, créez votre checklist de valise et découvrez des itinéraires worldwide écoresponsables.",
    keywords: "travel planner, voyage pas cher, planificateur voyage, météo travel, itinéraire touristique worldwide, voyage écoresponsable, guide voyage"
  },
  
  // Page météo
  weather: {
    title: "Météo Travel - Prévisions Météorologiques pour Voyageurs",
    description: "Consultez la météo travel pour votre destination. Prévisions météorologiques détaillées pour planifier votre voyage parfait avec Travel Planner.",
    keywords: "météo travel, weather forecast travel, prévisions météo voyage, météo destination, weather planning"
  },
  
  // Page itinéraires
  itineraries: {
    title: "Itinéraires Touristiques Worldwide - Guides de Voyage",
    description: "Découvrez des itinéraires touristiques worldwide avec Travel Planner. Que visiter à Rome, Paris, et autres destinations. Guides de voyage détaillés et conseils d'experts.",
    keywords: "itinéraire touristique worldwide, que visiter à Rome, guide voyage Paris, destinations touristiques, travel guide"
  },
  
  // Page checklist
  checklist: {
    title: "Checklist de Valise - Choses à Emporter pour un Voyage",
    description: "Créez votre checklist de valise parfaite avec Travel Planner. Liste complète des choses à emporter pour un voyage, conseils de packing et astuces voyage.",
    keywords: "checklist de valise, choses à emporter pour un voyage, packing list, liste voyage, préparation voyage"
  },
  
  // Page voyage écoresponsable
  ecoTravel: {
    title: "Voyage Écoresponsable - Travel Planner Durable",
    description: "Voyagez de manière écoresponsable avec Travel Planner. Découvrez comment réduire l'impact environnemental de vos voyages et adopter un tourisme durable.",
    keywords: "voyage écoresponsable, tourisme durable, travel éco-friendly, voyage vert, sustainable travel"
  },
  
  // Page destinations
  destinations: {
    title: "Destinations Voyage - Guide Touristique Mondial",
    description: "Explorez les meilleures destinations voyage avec Travel Planner. Guides touristiques détaillés, conseils locaux et itinéraires personnalisés pour chaque destination.",
    keywords: "destinations voyage, guide touristique, travel destinations, lieux à visiter, voyage worldwide"
  },
  
  // Page planification
  planning: {
    title: "Planificateur de Voyage - Organisez votre Trip Parfait",
    description: "Utilisez notre planificateur de voyage intelligent. Organisez chaque détail de votre trip : réservations, itinéraires, budget et plus avec Travel Planner.",
    keywords: "planificateur voyage, travel planner, organisateur voyage, planification trip, voyage organisé"
  }
};

// Fonction utilitaire pour générer les mots-clés SEO dynamiques
export const generateSEOKeywords = (baseKeywords, additionalKeywords = []) => {
  const defaultKeywords = [
    "travel planner",
    "voyage pas cher",
    "météo travel",
    "itinéraire touristique worldwide",
    "checklist de valise",
    "voyage écoresponsable"
  ];
  
  return [...defaultKeywords, ...baseKeywords, ...additionalKeywords].join(", ");
};

// Fonction pour générer l'URL canonique
export const generateCanonicalUrl = (path = "") => {
  const baseUrl = "https://Travel Planner.com";
  return `${baseUrl}${path}`;
};
