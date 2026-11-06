export const responsiveStyles = (T) => `
    /* RESPONSIVE BREAKPOINTS */
    @media (max-width: 768px) {
      .nav-root { padding: 0 1rem; }
      .nav-area-right { gap: .55rem !important; }
      .nav-user { max-width: 5rem; overflow: hidden; text-overflow: ellipsis; }
      .nav-links { display: none; }
      .nav-mobile-toggle { display: block; }
      .nav-desktop-cta { display: none; }

      .hero { min-height: 85vh; padding: 4rem 1rem 3rem; }
      .hero-inner { max-width: 100%; text-align: center; }
      .hero-label { font-size: 0.65rem; }
      .hero-h1 { font-size: clamp(2.5rem, 12vw, 6rem); }
      .hero-sub { font-size: 1rem; max-width: 100%; }
      .hero-actions { flex-direction: column; align-items: center; }
      .hero-stat-row {
        position: static;
        margin-top: 2rem;
        display: flex;
        justify-content: center;
        gap: 2rem;
      }
      .hero-stat-item { text-align: center; }

      .section { padding: 4rem 1rem; }
      .section-title { font-size: clamp(1.8rem, 6vw, 2.8rem); }

      .flip-grid { grid-template-columns: 1fr; gap: 1rem; }
      .flip-card { height: 320px; }

      .carousel-container { gap: 1rem; padding: 0.5rem 0 2rem; }
      .carousel-item { min-width: 280px; max-width: 320px; }

      .bento-card { padding: 2rem 1.5rem; }
      .bento-quote { font-size: 0.95rem; margin-bottom: 1.5rem; }
      .bento-avatar { width: 44px; height: 44px; }
      .bento-name { font-size: 0.85rem; }
      .bento-sub { font-size: 0.65rem; }

      .gallery-featured { grid-template-columns: 1fr; }
      .gallery-masonry { columns: 2; }

      .contact-grid { grid-template-columns: 1fr; gap: 2rem; }

      .footer-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
      .footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }

      .client-notifications-page { padding: 2.5rem 1rem; }
      .client-appointment-details { grid-template-columns: 1fr; }
      .client-appointment-reason { grid-column: auto; }
      .client-payment-row { align-items: flex-start; flex-direction: column; }
    }

    @media (max-width: 480px) {
      .nav-root { height: 56px; padding: 0 0.75rem; }
      .nav-logo { font-size: 1.1rem; }
      .nav-mobile-menu { top: 56px; padding: 0.75rem 1rem; }

      .hero { min-height: 80vh; padding: 3rem 1rem 2rem; }
      .hero-h1 { font-size: clamp(2rem, 14vw, 5rem); }
      .hero-stat-row { gap: 1.5rem; }

      .section { padding: 3rem 1rem; }

      .flip-card { height: 280px; }

      .carousel-item { min-width: 260px; max-width: 300px; }

      .modal-box { padding: 1.5rem; max-width: 95vw; }
      .brand-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .client-notifications-tabs button { padding: .7rem .55rem; font-size: .58rem; }
      .client-appointment-card, .client-notification-card { padding: 1rem; }
      .client-appointment-card-header { flex-direction: column; }
      .client-notification-card { align-items: flex-start; flex-direction: column; }
      .client-notifications-header h1 { font-size: 1.6rem; }

      .gallery-masonry { columns: 1; }
    }
  `;
