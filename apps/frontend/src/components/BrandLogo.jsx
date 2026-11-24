import { useState } from 'react';

const BRAND_SLUG_MAP = {
  yamaha: 'yamahamotorcorporation'
};

const BRAND_DOMAINS = {
  yamaha: 'yamaha-motor.eu',
  triumph: 'triumphmotorcycles.com',
  kawasaki: 'kawasaki.com',
  aprilia: 'aprilia.com'
};

function getLogoSources(brand) {
  const slug = (brand.slug || brand.name || '').toLowerCase().trim();
  const simpleIconSlug = BRAND_SLUG_MAP[slug] || encodeURIComponent(slug);
  const simpleIconUrl = `https://cdn.simpleicons.org/${simpleIconSlug}`;
  const sources = brand.logoUrl ? [brand.logoUrl, simpleIconUrl] : [simpleIconUrl];
  const domain = BRAND_DOMAINS[slug];
  if (domain) sources.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
  return [...new Set(sources.filter(Boolean))];
}

export function BrandLogo({ brand, className = '', alt = '', allowTextFallback = false, onError }) {
  const sources = getLogoSources(brand);
  const [sourceIndex, setSourceIndex] = useState(0);

  if (sourceIndex >= sources.length) {
    if (allowTextFallback) {
      return <span className={className}>{brand.name}</span>;
    }
    return null;
  }

  return (
    <img
      className={className}
      src={sources[sourceIndex]}
      alt={alt || brand.name}
      onError={(e) => {
        setSourceIndex(index => index + 1);
        if (onError) onError(e);
      }}
    />
  );
}
