import { useEffect, useState } from 'react';
import { BrandLogo } from './BrandLogo';

const FALLBACK_BRANDS = ['DUCATI', 'BMW', 'KTM', 'YAMAHA', 'TRIUMPH', 'SUZUKI', 'HONDA', 'KAWASAKI', 'APRILIA']
  .map(name => ({ name, slug: name.toLowerCase(), logoUrl: '' }));

export function BrandsCarousel() {
  const [brands, setBrands] = useState(FALLBACK_BRANDS);

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

  const loopBrands = brands.length > 1 ? [...brands, ...brands] : brands;

  return (
    <section className="brand-carousel" aria-label="Marcas de motocicletas con las que trabajamos">
      <div className="brand-carousel-label">MANEJAMOS ESTAS MARCAS:</div>
      <div className="brand-carousel-viewport">
        <div className={`brand-carousel-track${brands.length > 1 ? ' animated' : ''}`}>
          {loopBrands.map((brand, index) => (
            <div
              className="brand-carousel-item"
              key={`${brand.id || brand.slug}-${index}`}
              aria-hidden={index >= brands.length}
            >
              <BrandLogo brand={brand} className="brand-carousel-logo" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
