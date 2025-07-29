/**
 * @fileoverview SEO Component for Travel Planner Application
 * 
 * This component provides comprehensive SEO metadata management using react-helmet-async.
 * It handles title tags, meta descriptions, Open Graph data, Twitter Cards, and other
 * essential SEO elements for the travel planning application.
 * 
 * Features:
 * - Dynamic title and meta tag generation
 * - Open Graph protocol support for social media sharing
 * - Twitter Card optimization
 * - Canonical URL management
 * - Localization support (French)
 * - Travel-specific metadata
 * 
 * @author Travel Planner Development Team
 * @version 1.0.0
 */

// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component - Manages all SEO-related metadata for pages
 * 
 * This component uses react-helmet-async to dynamically manage document head elements,
 * providing comprehensive SEO optimization including social media sharing, search engine
 * optimization, and travel-specific metadata.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.title] - Page-specific title (will be appended with site name)
 * @param {string} [props.description] - Page-specific meta description
 * @param {string} [props.keywords] - Page-specific keywords for SEO
 * @param {string} [props.canonical] - Canonical URL path (relative to base URL)
 * @param {string} [props.ogImage] - Open Graph image path for social sharing
 * @param {string} [props.type="website"] - Open Graph type (website, article, etc.)
 * @param {string} [props.author="Travel Planner Travel App"] - Content author
 * @returns {JSX.Element} Helmet component with SEO metadata
 */
const SEO = ({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogImage, 
  type = "website",
  author = "Travel Planner Travel App"
}) => {
  // Default SEO values for the Travel Planner application
  const defaultTitle = "Travel Planner - Planificateur de Voyage Intelligent";
  const defaultDescription = "Planifiez votre voyage parfait avec Travel Planner. Trouvez des voyages pas cher, créez votre checklist de valise, consultez la météo et découvrez les meilleurs itinéraires touristiques.";
  const defaultKeywords = "voyage pas cher, choses à emporter pour un voyage, météo voyage, itinéraire touristique, checklist de valise, voyage écoresponsable, planificateur voyage";
  const baseUrl = "https://Travel Planner.com";

  // Process and combine props with defaults for optimal SEO
  const seoTitle = title ? `${title} | Travel Planner` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  const seoCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl;
  const seoImage = ogImage ? `${baseUrl}${ogImage}` : `${baseUrl}/images/logo-social.png`;

  return (
    <Helmet>
      {/* Basic SEO metadata for search engines */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={seoCanonical} />

      {/* Open Graph protocol for social media sharing (Facebook, LinkedIn, etc.) */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoCanonical} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card metadata for optimized Twitter sharing */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Additional metadata specific to travel content and French localization */}
      <meta property="article:author" content={author} />
      <meta name="geo.region" content="FR" />
      <meta name="geo.placename" content="France" />
    </Helmet>
  );
};

export default SEO;
