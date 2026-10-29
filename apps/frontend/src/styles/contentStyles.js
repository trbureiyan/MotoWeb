export const contentStyles = (T) => `
    /* SECTION COMMON */
    .section { padding: 6rem 2rem; }
    .section-label {
      font-family: ${T.body};
      font-size: 0.78rem;
      color: ${T.muted};
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
    }
    .section-title {
      font-size: clamp(2.1rem, 5vw, 3.2rem);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: -0.01em;
      line-height: 1.1;
      margin-bottom: 0.5rem;
    }
    .section-title em { color: ${T.orange}; font-style: normal; }
    .section-sub {
      color: ${T.muted};
      font-size: 1rem;
      margin-bottom: 3rem;
      max-width: 560px;
      line-height: 1.7;
    }
    .divider-line {
      width: 48px;
      height: 2px;
      background: ${T.orange};
      margin: 1rem 0 2rem;
    }

    /* FLIP CARDS */
    .flip-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .flip-card {
      height: 380px;
      perspective: 1200px;
      cursor: pointer;
    }
    .flip-card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      /* Animacion controlada por GSAP */
    }
    .flip-front, .flip-back {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 1px solid ${T.border};
      width: 100%;
      height: 100%;
    }
    .flip-front {
      background: ${T.bg2};
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 1.25rem;
      color: #fff;
      position: relative;
      overflow: hidden;
      background-color: transparent;
    }
    .flip-front-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      filter: brightness(0.92) saturate(1.05);
      z-index: 0;
    }
    .flip-front::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(14,14,14,0.05), rgba(14,14,14,0.7));
      pointer-events: none;
      z-index: 1;
    }
    .flip-front-content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      gap: 1rem;
      width: 100%;
      padding: 1.5rem;
      min-height: 100%;
      text-align: center;
    }
    .flip-front-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(0,0,0,0.45);
      border: 1px solid rgba(255,98,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${T.orange};
    }
    .flip-front-title {
      font-size: 1.2rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #fff;
    }
    .flip-front-hint {
      font-family: ${T.mono};
      font-size: 0.65rem;
      color: rgba(255,255,255,0.75);
      letter-spacing: 0.1em;
    }
    .flip-back {
      background: linear-gradient(180deg, ${T.bg3}, ${T.bg2});
      transform: rotateY(180deg);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      border-top: 2px solid ${T.orange};
    }
    .flip-back-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
    }
    .flip-back-title {
      font-family: ${T.body};
      font-size: 0.72rem;
      color: ${T.muted};
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .flip-back-name {
      font-family: ${T.head};
      font-size: 1rem;
      font-weight: 800;
      color: ${T.text};
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .flip-back-specs {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      font-family: ${T.mono};
      font-size: 0.78rem;
      color: ${T.muted};
    }
    .flip-back-specs li {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      border-bottom: 1px dashed rgba(255,255,255,0.08);
      padding-bottom: 0.45rem;
    }
    .flip-back-key { color: ${T.muted}; }
    .flip-back-val { color: ${T.text}; text-align: right; }
    .flip-back-price {
      font-family: ${T.mono};
      font-size: 1rem;
      font-weight: 700;
      color: ${T.orange};
      border-top: 1px solid ${T.border};
      padding-top: 1rem;
      margin-top: auto;
    }

    /* TESTIMONIALS CAROUSEL */
    .carousel-container {
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-snap-type: x mandatory;
      scrollbar-width: thin;
      scrollbar-color: ${T.orange} rgba(255,255,255,0.08);
      display: flex;
      gap: 1.5rem;
      padding: 1rem 0 1.25rem;
      scroll-behavior: smooth;
      cursor: grab;
      position: relative;
    }
    .carousel-container::-webkit-scrollbar { height: 4px; }
    .carousel-container::-webkit-scrollbar-track { background: rgba(255,255,255,0.08); }
    .carousel-container::-webkit-scrollbar-thumb {
      background: ${T.orange};
      border-radius: 999px;
    }
    .carousel-container:active { cursor: grabbing; }

    .carousel-indicators {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 0.5rem;
      padding: 1rem 0;
    }
    .carousel-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      border: none;
      cursor: pointer;
      transition: all 0.3s;
    }
    .carousel-dot.active {
      background: ${T.orange};
      transform: scale(1.2);
    }
    .carousel-dot:hover {
      background: rgba(255,98,0,0.7);
    }

    .carousel-item {
      min-width: 360px;
      max-width: 420px;
      flex: 0 0 auto;
      scroll-snap-align: start;
    }

    .bento-card {
      background: rgba(26,26,26, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255,98,0,0.08);
      border-radius: 16px;
      padding: 2.5rem 2rem;
      position: relative;
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .bento-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 60px rgba(255,98,0,0.15);
      border-color: rgba(255,98,0,0.2);
    }
    .bento-card::before {
      content: '"';
      position: absolute;
      top: 1rem;
      right: 1.5rem;
      font-size: 4rem;
      color: ${T.orange};
      opacity: 0.08;
      font-family: Georgia, serif;
      line-height: 1;
      transform: rotate(180deg);
    }
    .bento-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, ${T.orange}, ${T.orangeDim});
      opacity: 0;
      transition: opacity 0.3s;
    }
    .bento-card:hover::after { opacity: 1; }
    .bento-quote {
      font-size: 1rem;
      line-height: 1.8;
      color: ${T.text};
      margin-bottom: 2rem;
      font-style: italic;
      position: relative;
      z-index: 1;
    }
    .bento-rider {
      display: flex;
      align-items: center;
      gap: 1rem;
      position: relative;
      z-index: 1;
    }
    .bento-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${T.orange}, ${T.orangeDim});
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      color: #000;
      border: 2px solid rgba(255,98,0,0.2);
      box-shadow: 0 4px 12px rgba(255,98,0,0.3);
    }
    .bento-name {
      font-weight: 700;
      font-size: 0.9rem;
      color: ${T.text};
      margin-bottom: 0.25rem;
    }
    .bento-sub {
      font-family: ${T.mono};
      font-size: 0.7rem;
      color: ${T.muted};
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* METRICS */
    .metrics-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: ${T.border};
      border: 1px solid ${T.border};
      margin-top: 3rem;
    }
    .metric-cell {
      background: ${T.bg2};
      padding: 2.5rem 2rem;
      text-align: center;
    }
    .metric-value {
      font-family: ${T.mono};
      font-size: 3rem;
      font-weight: 700;
      color: ${T.orange};
      line-height: 1;
      margin-bottom: 0.5rem;
    }
    .metric-label {
      font-size: 0.72rem;
      color: ${T.muted};
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    /* GALLERY */
    .gallery-featured {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    .gallery-masonry {
      columns: 3;
      column-gap: 1rem;
    }
    .gallery-item {
      break-inside: avoid;
      margin-bottom: 1rem;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      display: block;
      width: 100%;
      border: 0;
      background: transparent;
      padding: 0;
      color: inherit;
      text-align: left;
    }
    .gallery-item img {
      width: 100%;
      aspect-ratio: 4 / 5;
      display: block;
      object-fit: cover;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      filter: grayscale(20%);
    }
    .gallery-featured .gallery-item {
      margin-bottom: 0;
      min-height: 360px;
    }
    .gallery-featured .gallery-item img {
      height: 100%;
      min-height: 360px;
    }
    .gallery-item:hover img { transform: scale(1.06); filter: grayscale(0%); }
    .gallery-item-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.3s;
      display: flex;
      align-items: flex-end;
      padding: 1rem;
    }
    .gallery-item:hover .gallery-item-overlay { opacity: 1; }
    .gallery-item-label {
      font-family: ${T.mono};
      font-size: 0.7rem;
      color: ${T.orange};
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .gallery-actions {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
    }
    .gallery-page {
      min-height: 70vh;
      background: ${T.bg2};
    }
    .gallery-page .gallery-item {
      transform-style: preserve-3d;
      will-change: transform, opacity;
      box-shadow: 0 12px 30px rgba(0,0,0,0.22);
    }
    .gallery-page .gallery-item img {
      will-change: transform, filter;
    }
    .gallery-page .gallery-item:hover img { transform: none; }
    .gallery-back-btn { margin-bottom: 2rem; }

    /* LIGHTBOX */
    .lightbox-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.95);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease;
    }
    .lightbox-content { position: relative; max-width: 90vw; max-height: 90vh; }
    .lightbox-content img { max-width: 90vw; max-height: 85vh; object-fit: contain; display: block; }
    .lightbox-close {
      position: absolute;
      top: -2rem;
      right: 0;
      background: none;
      border: none;
      color: ${T.orange};
      font-size: 1.5rem;
      cursor: pointer;
      font-family: ${T.mono};
    }
    .lightbox-caption {
      font-family: ${T.mono};
      font-size: 0.72rem;
      color: ${T.muted};
      text-align: center;
      margin-top: 0.75rem;
      letter-spacing: 0.1em;
    }

    /* TERMINAL CHAT */
    .contact-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 3rem;
      align-items: start;
    }
    .terminal-wrap {
      background: linear-gradient(180deg, rgba(18,18,18,0.98), rgba(12,12,12,0.98));
      border: 1px solid ${T.border};
      border-top: 2px solid ${T.orange};
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 12px 30px rgba(0,0,0,0.35);
    }
    .terminal-header {
      background: rgba(18,18,18,0.85);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-bottom: 1px solid ${T.border};
    }
    .terminal-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
    }
    .terminal-title {
      font-family: ${T.body};
      font-size: 0.75rem;
      color: ${T.text};
      margin-left: 0.5rem;
      letter-spacing: 0.06em;
    }
    .terminal-progress-bar {
      height: 3px;
      background: ${T.border};
      position: relative;
    }
    .terminal-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, ${T.orange}, ${T.orangeDim});
      transition: width 0.4s ease;
      box-shadow: 0 0 12px ${T.orangeGlow};
    }
    .terminal-messages {
      padding: 1.25rem;
      min-height: 300px;
      max-height: 350px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      font-family: ${T.body};
      font-size: 0.9rem;
      line-height: 1.6;
    }
    .terminal-messages::-webkit-scrollbar { width: 2px; }
    .terminal-messages::-webkit-scrollbar-thumb { background: ${T.orange}; }
    .msg-system, .msg-user, .msg-data {
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      border: 1px solid transparent;
      max-width: 85%;
    }
    .msg-system {
      font-size: 0.82rem;
      color: ${T.text};
      background: rgba(255,98,0,0.08);
      border-color: rgba(255,98,0,0.22);
    }
    .msg-system::before { content: '• '; color: ${T.orange}; }
    .msg-user {
      font-size: 0.85rem;
      color: ${T.text};
      align-self: flex-end;
      text-align: right;
      background: rgba(255,255,255,0.06);
      border-color: rgba(255,255,255,0.08);
    }
    .msg-user::before { content: ''; }
    .msg-data {
      font-size: 0.78rem;
      color: ${T.muted};
      background: rgba(255,255,255,0.03);
      border-color: rgba(255,255,255,0.06);
    }
    .msg-data::before { content: ''; }
    .terminal-input-row {
      border-top: 1px solid ${T.border};
      padding: 1rem 1.25rem;
      display: flex;
      gap: 0.75rem;
    }
    .terminal-input {
      flex: 1;
      background: rgba(0,0,0,0.2);
      border: 1px solid ${T.border};
      border-radius: 8px;
      outline: none;
      font-family: ${T.body};
      font-size: 0.9rem;
      color: ${T.text};
      caret-color: ${T.orange};
      padding: 0.6rem 0.75rem;
    }
    .terminal-input::placeholder { color: ${T.muted}; }
    .terminal-send {
      background: ${T.orange};
      border: none;
      color: #000;
      padding: 0.55rem 1rem;
      border-radius: 8px;
      font-family: ${T.head};
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      letter-spacing: 0.05em;
      transition: background 0.2s;
    }
    .terminal-send:hover { background: #ff8a00; }
    .terminal-options {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      padding: 0 1.25rem 1.25rem;
    }
    .terminal-option {
      font-family: ${T.body};
      font-size: 0.78rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid ${T.border};
      color: ${T.muted};
      padding: 0.45rem 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s;
      letter-spacing: 0.02em;
    }
    .terminal-option:hover {
      border-color: ${T.orange};
      color: ${T.orange};
      background: rgba(255,98,0,0.08);
    }

    /* WORKSHOP INFO */
    .info-block {
      background: ${T.bg2};
      border: 1px solid ${T.border};
      padding: 2rem;
    }
    .info-row {
      display: flex;
      gap: 2rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    .info-item { flex: 1; min-width: 130px; }
    .info-item-label {
      font-family: ${T.mono};
      font-size: 0.62rem;
      color: ${T.orange};
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .info-item-value {
      font-size: 0.85rem;
      color: ${T.text};
      line-height: 1.6;
    }
    .info-item-value span {
      font-family: ${T.mono};
      font-size: 0.78rem;
      color: ${T.muted};
    }
    .map-placeholder {
      background: ${T.bg3};
      border: 1px dashed ${T.border};
      height: 180px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: border-color 0.2s;
      margin-top: 1.5rem;
    }

    /* BOOKING SUMMARY */
    .booking-summary {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      margin-bottom: 1.5rem;
    }
    .summary-card {
      background: ${T.bg2};
      border: 1px solid ${T.border};
      padding: 0.9rem 1.1rem;
    }
    .summary-card-title {
      font-family: ${T.mono};
      font-size: 0.65rem;
      color: ${T.orange};
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-bottom: 0.65rem;
      border-bottom: 1px solid ${T.border};
      padding-bottom: 0.4rem;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.3rem 0;
      font-size: 0.8rem;
    }
    .summary-label {
      font-family: ${T.mono};
      color: ${T.muted};
      font-size: 0.72rem;
    }
    .summary-value {
      font-family: ${T.head};
      color: ${T.text};
      font-weight: 700;
      font-size: 0.82rem;
      text-transform: uppercase;
      text-align: right;
    }
    .summary-alert {
      background: rgba(255, 98, 0, 0.08);
      border: 1px solid ${T.orangeDim};
      padding: 0.85rem 1rem;
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
    }
    .summary-alert-title {
      font-family: ${T.head};
      font-size: 0.82rem;
      font-weight: 700;
      color: ${T.orange};
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }
    .summary-alert-text {
      font-size: 0.75rem;
      color: ${T.muted};
      margin: 0;
      line-height: 1.4;
    }
    .map-placeholder:hover { border-color: ${T.orange}; }
    .map-placeholder-label {
      font-family: ${T.mono};
      font-size: 0.7rem;
      color: ${T.muted};
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .contact-btns {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.25rem;
    }
    .contact-btn {
      flex: 1;
      padding: 0.7rem;
      text-align: center;
      font-family: ${T.mono};
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }
    .contact-btn.whatsapp { background: #25d366; color: #000; }
    .contact-btn.email { background: ${T.bg3}; color: ${T.text}; border: 1px solid ${T.border}; }
    .contact-btn.email:hover { border-color: ${T.orange}; color: ${T.orange}; }

    /* MODAL */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.88);
      z-index: 9000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.2s ease;
    }
    .modal-box {
      background: ${T.bg1};
      border: 1px solid ${T.border};
      border-top: 2px solid ${T.orange};
      width: 100%;
      max-width: 520px;
      padding: 2rem;
      position: relative;
    }
    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      color: ${T.muted};
      cursor: pointer;
      font-size: 1.2rem;
      transition: color 0.2s;
    }
    .modal-close:hover { color: ${T.orange}; }
    .modal-step-label {
      font-family: ${T.mono};
      font-size: 0.65rem;
      color: ${T.orange};
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .modal-title {
      font-size: 1.3rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 0.5rem;
    }
    .modal-sub {
      font-size: 0.8rem;
      color: ${T.muted};
      margin-bottom: 2rem;
    }
    .modal-stepper {
      display: flex;
      gap: 4px;
      margin-bottom: 2rem;
    }
    .modal-step-dot {
      flex: 1;
      height: 3px;
      background: ${T.border};
      transition: background 0.3s;
    }
    .modal-step-dot.active { background: ${T.orange}; }
    .brand-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .brand-btn {
      background: ${T.bg2};
      border: 1px solid ${T.border};
      color: ${T.text};
      padding: 0.9rem;
      text-align: center;
      font-family: ${T.head};
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      cursor: pointer;
      transition: all 0.15s;
      text-transform: uppercase;
    }
    .brand-btn:hover, .brand-btn.selected {
      border-color: ${T.orange};
      color: ${T.orange};
      background: ${T.orangeGlow};
    }
    .modal-input {
      width: 100%;
      background: ${T.bg2};
      border: 1px solid ${T.border};
      color: ${T.text};
      padding: 0.85rem 1rem;
      font-family: ${T.mono};
      font-size: 0.82rem;
      outline: none;
      transition: border-color 0.2s;
      margin-bottom: 0.75rem;
    }
    .modal-input:focus { border-color: ${T.orange}; }
    .modal-input::placeholder { color: ${T.muted}; }
    .modal-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
    }

    /* FOOTER */
    .footer {
      background: linear-gradient(180deg, rgba(18,18,18,0.7) 0%, rgba(14,14,14,0.95) 100%);
      backdrop-filter: blur(10px);
      position: relative;
      border-top: 1px solid rgba(255, 255, 255, 0.03);
      padding: 4rem 2rem 2rem;
      box-shadow: 0 -10px 40px rgba(0,0,0,0.4);
    }
    .footer-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin-bottom: 3rem;
    }
    .footer-col-title {
      font-family: ${T.mono};
      font-size: 0.65rem;
      color: ${T.orange};
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }
    .footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
    .footer-links a {
      font-size: 0.82rem;
      color: ${T.muted};
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer-links a:hover { color: ${T.orange}; }
    .footer-social { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .social-btn {
      width: 36px; height: 36px;
      border: 1px solid ${T.border};
      background: ${T.bg2};
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${T.muted};
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .social-btn:hover { border-color: ${T.orange}; color: ${T.orange}; }
    .newsletter-input-row {
      display: flex;
      margin-top: 0.5rem;
    }
    .newsletter-input {
      flex: 1;
      background: ${T.bg3};
      border: 1px solid ${T.border};
      border-right: none;
      color: ${T.text};
      padding: 0.65rem 0.9rem;
      font-family: ${T.mono};
      font-size: 0.75rem;
      outline: none;
    }
    .newsletter-input::placeholder { color: ${T.muted}; }
    .newsletter-btn {
      background: ${T.orange};
      border: none;
      color: #000;
      padding: 0.65rem 1rem;
      font-family: ${T.mono};
      font-size: 0.7rem;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 0.06em;
      transition: background 0.2s;
    }
    .newsletter-btn:hover { background: #ff8a00; }
    .footer-bottom {
      border-top: 1px solid ${T.border};
      padding-top: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .footer-copy {
      font-family: ${T.mono};
      font-size: 0.68rem;
      color: ${T.muted};
      letter-spacing: 0.08em;
    }
    .footer-logo-mark {
      font-family: ${T.head};
      font-weight: 900;
      font-size: 0.9rem;
      color: ${T.orange};
      letter-spacing: 0.12em;
    }

    .services-section { background: ${T.bg1}; }
    .testimonials-section { background: ${T.bg0}; }
    .gallery-section { background: ${T.bg2}; }
    .contact-section { background: ${T.bg1}; }
  `;
