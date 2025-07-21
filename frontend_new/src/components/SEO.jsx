// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogImage, 
  type = "website",
  author = "Travel Planner Travel App"
}) => {
  const defaultTitle = "Travel Planner - Planificateur de Voyage Intelligent";
  const defaultDescription = "Planifiez votre voyage parfait avec Travel Planner. Trouvez des voyages pas cher, créez votre checklist de valise, consultez la météo et découvrez les meilleurs itinéraires touristiques.";
  const defaultKeywords = "voyage pas cher, choses à emporter pour un voyage, météo voyage, itinéraire touristique, checklist de valise, voyage écoresponsable, planificateur voyage";
  const baseUrl = "https://Travel Planner.com";

  const seoTitle = title ? `${title} | Travel Planner` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  const seoCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl;
  const seoImage = ogImage ? `${baseUrl}${ogImage}` : `${baseUrl}/images/logo-social.png`;

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={seoCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoCanonical} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Additional meta for travel content */}
      <meta property="article:author" content={author} />
      <meta name="geo.region" content="FR" />
      <meta name="geo.placename" content="France" />
    </Helmet>
  );
};

export default SEO;
