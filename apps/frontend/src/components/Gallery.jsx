import { useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { IconZoomIn } from "./Icons";
import { GridDistortion } from "./GridDistortion";
import { GradientBlinds } from "./GradientBlinds";
import { GradualBlur } from "./GradualBlur";

gsap.registerPlugin(ScrollTrigger, Flip);

function GalleryGrid({
  items,
  variant = "masonry",
  onSelect,
  animated = true,
  className = "",
}) {
  return (
    <div
      className={`gallery-${variant}${animated ? " reveal-stagger" : ""}${className ? ` ${className}` : ""}`}
    >
      {items.map((item) => (
        <button
          key={item.id}
          className="gallery-item"
          onClick={() => onSelect(item)}
        >
          <img src={item.src} alt={item.label} loading="lazy" />
          <span className="gallery-item-overlay">
            <span
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <IconZoomIn />
              <span className="gallery-item-label">{item.label}</span>
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

export function GalleryImageModal({ onClose, onSave }) {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({ imageUrl, caption });
      onClose();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="gallery-image-modal-overlay" onClick={(event) => {
      if (event.target === event.currentTarget && !saving) onClose();
    }}>
      <form className="gallery-image-modal" onSubmit={submit} aria-labelledby="gallery-image-modal-title" role="dialog" aria-modal="true">
        <button className="gallery-image-modal-close" type="button" onClick={onClose} aria-label="Cerrar" disabled={saving}>
          ×
        </button>
        <h2 id="gallery-image-modal-title">Agregar imagen a la galería</h2>
        <label htmlFor="gallery-image-url">Enlace de la imagen</label>
        <input
          id="gallery-image-url"
          type="url"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="https://..."
          required
          autoFocus
        />
        <label htmlFor="gallery-image-caption">Descripción (opcional)</label>
        <input
          id="gallery-image-caption"
          type="text"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          maxLength={200}
          placeholder="Ej. Yamaha R1 - Suspensión"
        />
        {error && <p className="gallery-image-modal-error" role="alert">{error}</p>}
        <div className="gallery-image-modal-actions">
          <button type="button" className="btn-outline" onClick={onClose} disabled={saving}>Cancelar</button>
          <button type="submit" className="btn-orange" disabled={saving}>
            {saving ? 'GUARDANDO…' : 'AGREGAR IMAGEN'}
          </button>
        </div>
      </form>
    </div>
  );
}

function GalleryImageActions({ isAdmin, onAddImage }) {
  return isAdmin ? (
    <button className="btn-outline gallery-add-image-btn" onClick={onAddImage}>
      AGREGAR IMAGEN
    </button>
  ) : null;
}

function GalleryLoadingState({ loading, error, empty }) {
  if (loading) return <p className="gallery-status" role="status">Cargando galería…</p>;
  if (error) return <p className="gallery-status gallery-status-error" role="alert">{error}</p>;
  if (empty) return <p className="gallery-status">Aún no hay imágenes en la galería.</p>;
  return null;
}

export function Gallery({ onViewMore, items, isAdmin, onAddImage, loading, error }) {
  const [lightbox, setLightbox] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const featuredItems = items.slice(0, 3);

  return (
    <section className="section gallery-section" id="taller">
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="section-label reveal">Trabajos recientes del taller</div>
        <h2 className="section-title reveal">
          EL <em>TALLER</em>
        </h2>
        <div className="divider-line reveal" />
        <p className="section-sub reveal">
          Cada moto que entra al paddock recibe atencion de nivel competitivo y un reporte claro del trabajo.
        </p>
        <GalleryLoadingState loading={loading} error={error} empty={!items.length} />
        {!loading && !error && featuredItems.length > 0 && (
          <GalleryGrid items={featuredItems} variant="featured" onSelect={setLightbox} />
        )}
        <div className="gallery-actions reveal">
          <GalleryImageActions isAdmin={isAdmin} onAddImage={() => setShowImageModal(true)} />
          <button className="btn-orange" onClick={onViewMore}>
            VER MÁS
          </button>
        </div>
      </div>
      {lightbox && (
        <div
          className="lightbox-overlay"
          role="button"
          tabIndex={0}
          aria-label="Cerrar imagen"
          onClick={() => setLightbox(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setLightbox(null);
            }
          }}
        >
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close"
              onClick={() => setLightbox(null)}
            >
              × CERRAR
            </button>
            <div
              style={{ position: "relative", width: "90vw", height: "80vh" }}
            >
              <GridDistortion
                imageSrc={lightbox.src}
                grid={20}
                mouse={0.15}
                strength={0.25}
              />
            </div>
            <div className="lightbox-caption">
              {lightbox.label}
            </div>
          </div>
        </div>
      )}
      {showImageModal && (
        <GalleryImageModal onClose={() => setShowImageModal(false)} onSave={onAddImage} />
      )}
    </section>
  );
}

export function GalleryPage({ onBack, items, isAdmin, onAddImage, loading, error }) {
  const containerRef = useRef(null);
  const scrollWrapperRef = useRef(null);
  const scrollContentRef = useRef(null);
  const [activeItem, setActiveItem] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  useGSAP(
    () => {
      // Horizontal scroll pinning
      const content = scrollContentRef.current;

      // Calculate total scroll distance
      const totalScroll = content.scrollWidth - window.innerWidth;

      if (totalScroll > 0) {
        gsap.to(content, {
          x: () => -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: scrollWrapperRef.current,
            start: "top top",
            end: () => `+=${totalScroll}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      // Entrance animation
      gsap.from(".hs-item", {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: scrollWrapperRef.current,
          start: "top 50%",
        },
      });
    },
    { scope: containerRef, dependencies: [items.length] },
  );

  const openItem = (item, e) => {
    const cardImg = e.currentTarget.querySelector(".hs-item-img");
    const state = Flip.getState(cardImg);
    setActiveItem({ item, state, element: cardImg });
  };

  const closeItem = () => {
    setActiveItem(null);
  };

  useLayoutEffect(() => {
    if (!activeItem) return;

    // We wait for the DOM to update with the lightbox active, then animate
    const lightboxImg = document.querySelector(".lightbox-hero-img");
    if (lightboxImg && activeItem.state) {
      Flip.from(activeItem.state, {
        targets: [lightboxImg],
        duration: 0.8,
        ease: "power4.inOut",
        absolute: true,
        onComplete: () => {
          // Animation complete, could fade in grid distortion if needed
        },
      });

      gsap.fromTo(
        ".lightbox-telemetry",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.4,
          ease: "power2.out",
        },
      );
    }
  }, [activeItem]);

  return (
    <main className="gallery-page-hs" ref={containerRef}>
      <div className="hs-background">
        <GradientBlinds
          gradientColors={["#050505", "#1a0d00", "#2a0a00", "#000000"]}
          blindCount={24}
          spotlightRadius={0.7}
        />
      </div>

      <div className="hs-ui-layer">
        <div className="hs-header">
          <div className="section-label">Archivo completo del taller</div>
          <GalleryImageActions isAdmin={isAdmin} onAddImage={() => setShowImageModal(true)} />
        </div>
      </div>

      <div className="hs-wrapper" ref={scrollWrapperRef}>
        <div className="hs-content" ref={scrollContentRef}>
          {/* Spacer for initial title */}
          <div className="hs-spacer" />

          {!loading && !error && items.map((item) => (
            <div
              key={item.id}
              className="hs-item"
              onClick={(e) => openItem(item, e)}
              role="button"
              tabIndex={0}
              aria-label={`Abrir detalle de ${item.label}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openItem(item, e);
                }
              }}
            >
              <div className="hs-item-inner">
                <div className="hs-item-img-wrap">
                  <img
                    src={item.src}
                    alt={item.label}
                    className="hs-item-img"
                    loading="lazy"
                    decoding="async"
                    data-flip-id={`img-${item.id}`}
                  />
                  <div className="hs-item-overlay">
                    <IconZoomIn />
                  </div>
                </div>
                <div className="hs-item-meta">
                  <h3>{item.label}</h3>
                </div>
              </div>
            </div>
          ))}

          <div className="hs-spacer" />
        </div>
      </div>

      {activeItem && (
        <div
          className="lightbox-fs"
          onClick={closeItem}
          role="button"
          tabIndex={0}
          aria-label="Cerrar vista completa"
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              closeItem();
            }
          }}
        >
          <button className="lightbox-fs-close" onClick={closeItem}>
            ×
          </button>

          <div
            className="lightbox-fs-img-container"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* The element we flip TO */}
            <div
              className="lightbox-hero-img"
              data-flip-id={`img-${activeItem.item.id}`}
            >
              <GridDistortion
                imageSrc={activeItem.item.src}
                grid={20}
                mouse={0.1}
                strength={0.2}
                relaxation={0.92}
              />
            </div>

            <GradualBlur
              position="bottom"
              strength={4}
              divCount={8}
              height="30vh"
              zIndex={10}
              exponential={true}
            />
            <GradualBlur
              position="top"
              strength={2}
              divCount={5}
              height="15vh"
              zIndex={10}
              exponential={true}
            />

            <div className="lightbox-telemetry">
              <h2>{activeItem.item.label}</h2>
              <div className="telemetry-grid">
                <div className="t-box">
                  <span>STATUS</span>
                  <strong>OPTIMIZED</strong>
                </div>
                <div className="t-box">
                  <span>SPECS</span>
                  <strong>{activeItem.item.label}</strong>
                </div>
                <div className="t-box">
                  <span>SYSTEM</span>
                  <strong>ONLINE</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {(loading || error || (!items.length && !loading)) && (
        <div className="gallery-page-status">
          <GalleryLoadingState loading={loading} error={error} empty={!items.length} />
        </div>
      )}
      {showImageModal && (
        <GalleryImageModal onClose={() => setShowImageModal(false)} onSave={onAddImage} />
      )}
    </main>
  );
}
