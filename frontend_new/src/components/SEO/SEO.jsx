import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = "Travel Planner - Planificateur de Voyage Intelligent | Travel Planner",
  description = "Planifiez votre voyage parfait avec Travel Planner. Travel planner intelligent avec météo travel, itinéraires worldwide, checklist de valise et voyage écoresponsable.",
  keywords = "travel planner, voyage pas cher, météo travel, itinéraire touristique worldwide, checklist de valise, voyage écoresponsable",
  url = "https://Travel Planner.com",
  image = "/images/logo-social.png",
  type = "website",
  noIndex = false
}) => {
  const siteTitle = "Travel Planner - Travel Planner";
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;

  return (
    <Helmet>
      {/* Titre principal */}
      <title>{fullTitle}</title>
      
      {/* Meta tags SEO de base */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Contrôle d'indexation */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* URL canonique */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph (Facebook, LinkedIn, etc.) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:site_name" content="Travel Planner Travel Planner" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Schema.org pour les données structurées */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Travel Planner",
          "description": description,
          "url": url,
          "applicationCategory": "TravelApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
          },
          "creator": {
            "@type": "Organization",
            "name": "Travel Planner Team"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
