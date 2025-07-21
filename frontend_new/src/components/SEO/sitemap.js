// Utility for generating dynamic sitemap data for SEO
export const sitemapRoutes = [
  {
    path: '/',
    priority: 1.0,
    changefreq: 'daily',
    title: 'Accueil - Travel Planner',
    description: 'Planificateur de voyage intelligent pour voyages pas cher'
  },
  {
    path: '/start',
    priority: 0.9,
    changefreq: 'weekly',
    title: 'Commencer - Travel Planner',
    description: 'Commencez à planifier votre voyage parfait'
  },
  {
    path: '/dashboard',
    priority: 0.8,
    changefreq: 'daily',
    title: 'Dashboard - Mes Voyages',
    description: 'Gérez tous vos voyages et itinéraires'
  },
  {
    path: '/trips',
    priority: 0.8,
    changefreq: 'weekly',
    title: 'Liste des Voyages - Travel Planner',
    description: 'Consultez tous vos voyages planifiés'
  }
];

// Fonction pour générer le sitemap XML (pour usage serveur)
export const generateSitemap = () => {
  const baseUrl = 'https://Travel Planner.com';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapRoutes.map(route => `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <priority>${route.priority}</priority>
    <changefreq>${route.changefreq}</changefreq>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('')}
</urlset>`;
};

// Données structurées Schema.org pour différents types de contenu
export const generateStructuredData = (type, data) => {
  const baseStructure = {
    "@context": "https://schema.org",
    "@type": type
  };

  switch (type) {
    case 'TravelPlan':
      return {
        ...baseStructure,
        "name": data.name,
        "description": data.description,
        "itinerary": data.itinerary,
        "estimatedCost": data.cost,
        "startDate": data.startDate,
        "endDate": data.endDate
      };
    
    case 'TouristDestination':
      return {
        ...baseStructure,
        "name": data.name,
        "description": data.description,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": data.latitude,
          "longitude": data.longitude
        },
        "image": data.image,
        "touristType": "leisure"
      };
    
    case 'WeatherForecast':
      return {
        ...baseStructure,
        "datePublished": new Date().toISOString(),
        "expires": data.expires,
        "weatherCondition": data.condition,
        "temperature": data.temperature
      };
    
    default:
      return baseStructure;
  }
};
