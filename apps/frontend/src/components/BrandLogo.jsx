import { useState } from 'react';

const BRAND_DOMAINS = {
  yamaha: 'yamaha-motor.eu',
  triumph: 'triumphmotorcycles.com',
  kawasaki: 'kawasaki.com',
  aprilia: 'aprilia.com'
};

function getLogoSources(brand) {
  const simpleIconUrl = `https://cdn.simpleicons.org/${encodeURIComponent(brand.slug)}`;
  const sources = brand.logoUrl ? [brand.logoUrl, simpleIconUrl] : [simpleIconUrl];
  const domain = BRAND_DOMAINS[brand.slug];
  if (domain) sources.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
  return [...new Set(sources.filter(Boolean))];
}

export function BrandLogo({ brand, className = '', alt = '' }) {
  const sources = getLogoSources(brand);
  const [sourceIndex, setSourceIndex] = useState(0);

  if (sourceIndex >= sources.length) {
    return <span className={className}>{brand.name}</span>;
  }

  return (
    <img
      className={className}
      src={sources[sourceIndex]}
      alt={alt}
      onError={() => setSourceIndex(index => index + 1)}
    />
  );
}
