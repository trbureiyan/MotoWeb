import { useState } from 'react';
import { IconZoomIn } from './Icons';

const GALLERY_ITEMS = [
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', label: 'BMW S1000RR — Tuning ECU' },
  { src: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&q=80', label: 'Yamaha R1 — Suspensión' },
  { src: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80', label: 'Kawasaki ZX-10R — Frenos Brembo' },
  { src: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80', label: 'Ducati V4 — Mapeo Dyno' },
  { src: 'https://www.motofichas.com/images/cache/10-honda-cb1000-hornet-sp-2025-estudio-negro-01-739-a.jpg', label: 'Honda CBR — Mantenimiento' },
  { src: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=600&q=80', label: 'Suzuki GSX-R — Full Service' },
  { src: 'https://www.moto.ch/wp-content/uploads/2024/12/Honda-CB1000-Hornet_01-1300x867.jpg', label: 'Honda CB1000 Hornet SP' },
];

export function Gallery() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section className="section gallery-section" id="taller">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-label reveal">// Proyectos recientes</div>
        <h2 className="section-title reveal">EL <em>TALLER</em></h2>
        <div className="divider-line reveal" />
        <p className="section-sub reveal">Cada moto que entra al paddock recibe atención de nivel competitivo.</p>
        <div className="gallery-masonry reveal-stagger">
          {GALLERY_ITEMS.map((item, i) => (
            <div key={i} className="gallery-item" onClick={() => setLightbox(item)}>
              <img src={item.src} alt={item.label} loading="lazy" />
              <div className="gallery-item-overlay">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IconZoomIn />
                  <div className="gallery-item-label">{item.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕ CERRAR</button>
            <img src={lightbox.src} alt={lightbox.label} />
            <div className="lightbox-caption">{lightbox.label}</div>
          </div>
        </div>
      )}
    </section>
  );
}
