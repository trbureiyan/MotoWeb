export const responsiveStyles = (T) => `
    /* RESPONSIVE BREAKPOINTS */
    @media (max-width: 768px) {
      .nav-root { padding: 0 1rem; }
      .nav-area-right { gap: .55rem !important; }
      .nav-user { max-width: 5rem; overflow: hidden; text-overflow: ellipsis; }
      .nav-links { display: none; }
      .nav-mobile-toggle { display: block; }
      .nav-desktop-cta { display: none; }

      .nav-login-btn {
        width: 38px;
        height: 38px;
        padding: 0;
        border: 1px solid ${T.border};
        color: ${T.muted};
      }
      .nav-login-btn:hover {
        color: ${T.orange};
        border-color: ${T.orange};
      }
      .nav-login-text { display: none; }
      .nav-login-icon { display: flex; align-items: center; justify-content: center; }

      .hero {
        min-height: auto;
        padding: 6rem 1.25rem 3.5rem;
        flex-direction: column !important;
        justify-content: center;
        align-items: center;
      }
      .hero-video-bg {
        opacity: 0.35;
      }
      .hero-inner {
        max-width: 100%;
        width: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 2;
      }
      .hero-label {
        font-size: 0.72rem;
        justify-content: center;
        margin-bottom: 1rem;
      }
      .hero-h1 {
        font-size: clamp(2.4rem, 11vw, 4.2rem);
        line-height: 0.95;
        margin-bottom: 1.25rem;
        word-break: break-word;
      }
      .hero-sub {
        font-size: 0.95rem;
        line-height: 1.6;
        max-width: 460px;
        margin: 0 auto 2rem;
      }
      .hero-actions {
        flex-direction: column;
        align-items: center;
        gap: 0.85rem;
        width: 100%;
      }
      .hero-actions .btn-orange,
      .hero-actions a {
        width: min(100%, 280px);
      }
      .hero-actions .btn-outline {
        width: 100%;
      }
      .hero-stat-row {
        position: static !important;
        margin-top: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2.25rem;
        width: 100%;
        z-index: 2;
      }
      .hero-stat-item {
        text-align: center;
      }
      .hero-stat-value {
        font-size: 1.6rem;
      }
      .hero-stat-label {
        font-size: 0.65rem;
        letter-spacing: 0.08em;
      }

      .brand-carousel {
        padding: 1.35rem 0 1.25rem !important;
      }
      .brand-carousel-title-row {
        margin-bottom: 0.85rem !important;
      }
      .brand-carousel-title {
        font-size: 0.62rem !important;
        letter-spacing: 0.25em !important;
      }
      .brand-carousel-viewport {
        width: 100% !important;
        mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%) !important;
        -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%) !important;
      }
      .brand-carousel-track {
        gap: 1rem !important;
      }
      .brand-carousel-item {
        width: auto !important;
        height: 42px !important;
        padding: 0 1rem !important;
      }
      .brand-carousel-logo {
        height: 28px !important;
        width: auto !important;
        max-width: 90px !important;
      }

      .section { padding: 4rem 1rem; }
      .section-title { font-size: clamp(1.8rem, 6vw, 2.8rem); }

      .flip-grid { grid-template-columns: 1fr; gap: 1rem; }
      .flip-card { height: 320px; }

      .carousel-container { gap: 1rem; padding: 0.5rem 0 2rem; }
      .carousel-item { min-width: 280px; max-width: 320px; }

      .metrics-row {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        margin-top: 2.5rem;
        width: 100%;
        box-sizing: border-box;
      }
      .metric-cell {
        padding: 1.5rem 0.5rem !important;
        box-sizing: border-box;
      }
      .metric-value {
        font-size: 1.85rem !important;
      }
      .metric-label {
        font-size: 0.65rem !important;
        letter-spacing: 0.05em !important;
      }

      .review-modal-overlay {
        padding: 1rem !important;
      }
      .review-modal {
        padding: 1.75rem 1.25rem !important;
        max-width: 100% !important;
        max-height: 88vh !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .review-modal h2 {
        font-size: 1.2rem !important;
      }
      .review-modal-actions {
        flex-direction: column-reverse !important;
        gap: 0.75rem !important;
      }
      .review-modal-actions button {
        width: 100% !important;
      }

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
      .nav-root.is-notifications .nav-area-center { display: none; }
      .nav-logo { font-size: 1.05rem; }
      .nav-mobile-menu { top: 56px; padding: 0.75rem 1rem; }
      .nav-login-btn, .nav-icon-btn, .nav-notifications {
        width: 34px;
        height: 34px;
      }
      .nav-root .btn-orange {
        padding: 0.45rem 0.65rem;
        font-size: 0.62rem;
      }

      .hero { min-height: auto; padding: 4.5rem 1rem 2.5rem; }
      .hero-h1 { font-size: clamp(2rem, 12vw, 3.2rem); }
      .hero-sub { font-size: 0.88rem; margin-bottom: 1.5rem; }
      .hero-stat-row { gap: 1.5rem; margin-top: 2.25rem; }
      .hero-stat-value { font-size: 1.35rem; }
      .hero-stat-label { font-size: 0.6rem; }

      .brand-carousel {
        padding: 1.15rem 0 1rem !important;
      }
      .brand-carousel-title-row {
        margin-bottom: 0.75rem !important;
      }
      .brand-carousel-title {
        font-size: 0.58rem !important;
        letter-spacing: 0.22em !important;
      }
      .brand-carousel-track {
        gap: 0.75rem !important;
      }
      .brand-carousel-item {
        width: auto !important;
        height: 36px !important;
        padding: 0 0.8rem !important;
      }
      .brand-carousel-logo {
        height: 24px !important;
        width: auto !important;
        max-width: 78px !important;
      }

      .section { padding: 3rem 1rem; }

      .flip-card { height: 280px; }

      .carousel-item { min-width: 260px; max-width: 300px; }

      .metrics-row {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        margin-top: 2rem;
        width: 100%;
        box-sizing: border-box;
      }
      .metric-cell {
        padding: 1.25rem 0.25rem !important;
        overflow: hidden;
      }
      .metric-value {
        font-size: 1.4rem !important;
        margin-bottom: 0.25rem;
      }
      .metric-label {
        font-size: 0.58rem !important;
        letter-spacing: 0.03em !important;
        line-height: 1.25;
      }

      .review-modal-overlay {
        padding: 0.75rem !important;
      }
      .review-modal {
        padding: 1.5rem 1rem !important;
        max-height: 90vh !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .review-modal h2 {
        font-size: 1.1rem !important;
      }
      .star-picker-btn {
        padding: 0.1rem !important;
      }
      .star-picker-buttons {
        gap: 0.35rem !important;
      }
      .review-form-input, .review-form-textarea {
        font-size: 0.85rem !important;
        padding: 0.65rem 0.75rem !important;
      }

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
