/**
 * @fileoverview SEO Sitemap and Structured Data Utilities for Travel Planner
 * 
 * This module provides comprehensive SEO utilities for the Travel Planner application,
 * including sitemap generation, structured data creation, and route metadata management.
 * It supports XML sitemap generation and Schema.org structured data for better search
 * engine optimization and rich snippets.
 * 
 * Features:
 * - Dynamic sitemap generation with priority and frequency settings
 * - XML sitemap export functionality for server-side rendering
 * - Schema.org structured data for travel-specific content
 * - Support for TravelPlan, TouristDestination, and WeatherForecast schemas
 * - Configurable route metadata for SEO optimization
 * 
 * SEO Benefits:
 * - Improved search engine crawling and indexing
 * - Rich snippets for travel content
 * - Better content categorization and understanding
 * - Enhanced local SEO for travel destinations
 * 
 * @author Travel Planner Development Team
 * @version 1.0.0
 */

/**
 * Static route configuration for sitemap generation
 * 
 * Defines all main application routes with their SEO properties including
 * priority, change frequency, title, and description for optimal indexing.
 * 
 * @constant {Array<Object>} sitemapRoutes - Array of route objects with SEO metadata
 */
// Utility for generating dynamic sitemap data for SEO
export const sitemapRoutes = [
  {
    path: '/',
    priority: 1.0, // Highest priority for homepage
    changefreq: 'daily',
    title: 'Accueil - Travel Planner',
    description: 'Planificateur de voyage intelligent pour voyages pas cher'
  },
  {
    path: '/start',
    priority: 0.9, // High priority for entry point
    changefreq: 'weekly',
    title: 'Commencer - Travel Planner',
    description: 'Commencez à planifier votre voyage parfait'
  },
  {
    path: '/dashboard',
    priority: 0.8, // Important user area
    changefreq: 'daily',
    title: 'Dashboard - Mes Voyages',
    description: 'Gérez tous vos voyages et itinéraires'
  },
  {
    path: '/trips',
    priority: 0.8, // Travel content priority
    changefreq: 'weekly',
    title: 'Liste des Voyages - Travel Planner',
    description: 'Consultez tous vos voyages planifiés'
  }
];

/**
 * Generates XML sitemap for search engine submission
 * 
 * Creates a complete XML sitemap following the sitemaps.org standard,
 * including all configured routes with their priorities, change frequencies,
 * and last modification dates.
 * 
 * @function generateSitemap
 * @returns {string} Complete XML sitemap as string
 */
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

/**
 * Generates Schema.org structured data for rich snippets
 * 
 * Creates JSON-LD structured data for different content types to enable
 * rich snippets in search results. Supports travel-specific schemas for
 * better search engine understanding and enhanced result displays.
 * 
 * @function generateStructuredData
 * @param {string} type - Schema.org type (TravelPlan, TouristDestination, WeatherForecast)
 * @param {Object} data - Content data to structure
 * @returns {Object} Schema.org compliant structured data object
 */
// Données structurées Schema.org pour différents types de contenu
export const generateStructuredData = (type, data) => {
  // Base Schema.org structure with context and type
  const baseStructure = {
    "@context": "https://schema.org",
    "@type": type
  };

  // Generate specific structured data based on content type
  switch (type) {
    case 'TravelPlan':
      // Schema for travel itineraries and trip plans
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
      // Schema for travel destinations and attractions
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
      // Schema for weather information on travel pages
      return {
        ...baseStructure,
        "datePublished": new Date().toISOString(),
        "expires": data.expires,
        "weatherCondition": data.condition,
        "temperature": data.temperature
      };
    
    default:
      // Return base structure for unknown types
      return baseStructure;
  }
};
