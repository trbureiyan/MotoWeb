import { useEffect, useState, useMemo } from 'react';
import { BrandLogo } from './BrandLogo';

const TARGET_FALLBACK_NAMES = [
  'DUCATI',
  'BMW',
  'KTM',
  'YAMAHA',
  'KAWASAKI',
  'HONDA',
  'SUZUKI',
  'TRIUMPH',
  'APRILIA',
  'HUSQVARNA'
];

const FALLBACK_BRANDS = TARGET_FALLBACK_NAMES.map(name => ({
  name,
  slug: name.toLowerCase(),
  logoUrl: ''
}));

export function BrandsCarousel() {
  const [brands, setBrands] = useState(FALLBACK_BRANDS);
  const [failedSlugs, setFailedSlugs] = useState(new Set());

  useEffect(() => {
    fetch('/api/brands')
      .then(response => {
        if (!response.ok) throw new Error('No fue posible cargar las marcas.');
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error('La respuesta de marcas no es válida.');
        const activeBrands = data.filter(brand => brand.isActive !== false);
        setBrands(activeBrands.length ? activeBrands : FALLBACK_BRANDS);
      })
      .catch(() => setBrands(FALLBACK_BRANDS));
  }, []);

  // Strict filtering: filter out any brands whose logos fail to load
  const verifiedBrands = useMemo(() => {
    const list = brands.length ? brands : FALLBACK_BRANDS;
    return list.filter(brand => {
      if (!brand) return false;
      const slug = (brand.slug || brand.name || '').toLowerCase().trim();
      return !failedSlugs.has(slug);
    });
  }, [brands, failedSlugs]);

  // Triple the items for a silky smooth seamless loop without jumping on ultra-wide screens
  const marqueeItems = useMemo(() => {
    if (verifiedBrands.length === 0) return [];
    if (verifiedBrands.length >= 6) {
      return [...verifiedBrands, ...verifiedBrands, ...verifiedBrands];
    }
    return [...verifiedBrands, ...verifiedBrands, ...verifiedBrands, ...verifiedBrands];
  }, [verifiedBrands]);

  if (verifiedBrands.length === 0) return null;

  return (
    <section className="brand-carousel" aria-label="Marcas de motocicletas con las que trabajamos">
      <div className="brand-carousel-title-row">
        <h3 className="brand-carousel-title">MARCAS</h3>
      </div>

      <div className="brand-carousel-viewport">
        <div className={`brand-carousel-track${marqueeItems.length > 1 ? ' animated' : ''}`}>
          {marqueeItems.map((brand, index) => {
            const slug = (brand.slug || brand.name || '').toLowerCase().trim();
            return (
              <div
                className="brand-carousel-item"
                key={`${brand.id || slug}-${index}`}
                aria-hidden={index >= verifiedBrands.length}
                title={brand.name}
              >
                <BrandLogo
                  brand={brand}
                  className="brand-carousel-logo"
                  alt={brand.name}
                  allowTextFallback={false}
                  onError={() => {
                    setFailedSlugs(prev => new Set(prev).add(slug));
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
