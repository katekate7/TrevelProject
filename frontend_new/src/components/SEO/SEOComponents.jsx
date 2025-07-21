import React from 'react';

// Composant pour les titres sémantiques avec RGAA compliance
export const SEOHeading = ({ 
  level = 1, 
  children, 
  className = '', 
  id = null,
  ariaLabel = null 
}) => {
  const HeadingTag = `h${level}`;
  
  return React.createElement(
    HeadingTag,
    {
      className: `seo-heading ${className}`,
      id,
      'aria-label': ariaLabel,
      // RGAA: structure hiérarchique des titres
      role: 'heading',
      'aria-level': level
    },
    children
  );
};

// Composant pour les sections sémantiques
export const SEOSection = ({ 
  children, 
  ariaLabel, 
  className = '', 
  headingId = null 
}) => (
  <section 
    className={`seo-section ${className}`}
    aria-labelledby={headingId}
    aria-label={!headingId ? ariaLabel : undefined}
    role="region"
  >
    {children}
  </section>
);

// Composant pour les listes sémantiques (pour checklist, itinéraires)
export const SEOList = ({ 
  items, 
  ordered = false, 
  className = '', 
  ariaLabel = null 
}) => {
  const ListTag = ordered ? 'ol' : 'ul';
  
  return (
    <ListTag 
      className={`seo-list ${className}`}
      aria-label={ariaLabel}
      role="list"
    >
      {items.map((item, index) => (
        <li key={index} role="listitem" className="seo-list-item">
          {item}
        </li>
      ))}
    </ListTag>
  );
};

// Composant pour les liens avec SEO optimisé
export const SEOLink = ({ 
  href, 
  children, 
  external = false, 
  className = '',
  ariaLabel = null,
  title = null
}) => (
  <a
    href={href}
    className={`seo-link ${className}`}
    aria-label={ariaLabel}
    title={title}
    {...(external && {
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-describedby': 'external-link-description'
    })}
  >
    {children}
    {external && <span className="sr-only"> (ouvre dans un nouvel onglet)</span>}
  </a>
);

// Composant pour les images optimisées SEO
export const SEOImage = ({ 
  src, 
  alt, 
  title = null, 
  className = '',
  width = null,
  height = null,
  loading = 'lazy'
}) => (
  <img
    src={src}
    alt={alt}
    title={title}
    className={`seo-image ${className}`}
    width={width}
    height={height}
    loading={loading}
    // RGAA: images décoratives doivent avoir alt=""
    role={alt ? 'img' : 'presentation'}
    aria-hidden={!alt}
  />
);

// Composant pour les breadcrumbs (fil d'Ariane)
export const SEOBreadcrumb = ({ items, className = '' }) => (
  <nav aria-label="Fil d'Ariane" className={`seo-breadcrumb ${className}`}>
    <ol role="list" className="breadcrumb-list">
      {items.map((item, index) => (
        <li key={index} role="listitem" className="breadcrumb-item">
          {index < items.length - 1 ? (
            <>
              <SEOLink href={item.href} ariaLabel={`Aller à ${item.label}`}>
                {item.label}
              </SEOLink>
              <span aria-hidden="true" className="breadcrumb-separator"> / </span>
            </>
          ) : (
            <span aria-current="page" className="breadcrumb-current">
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);
