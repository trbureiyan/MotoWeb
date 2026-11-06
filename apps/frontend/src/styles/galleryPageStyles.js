export const galleryPageStyles = (T) => `
    /* HORIZONTAL SCROLL GALLERY (TELEMETRY SHOWCASE) */
    .gallery-page-hs {
      position: relative;
      background: #000;
      color: #fff;
    }
    .hs-background {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }
    .hs-ui-layer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      pointer-events: none;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .hs-ui-layer .gallery-back-btn {
      pointer-events: auto;
      position: fixed;
      top: 1.5rem;
      left: 1.5rem;
      z-index: 100;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px);
      border-color: rgba(255,255,255,0.2);
    }
    .hs-header {
      margin-top: auto;
      margin-bottom: 2rem;
      pointer-events: auto;
    }
    .hs-title {
      font-family: ${T.head};
      font-size: clamp(3rem, 8vw, 6rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      line-height: 1;
    }
    .hs-title em { color: ${T.orange}; font-style: normal; }
    .hs-wrapper {
      position: relative;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      z-index: 5;
    }
    .hs-content {
      display: flex;
      height: 100%;
      align-items: center;
      width: max-content;
      padding: 0;
    }
    .hs-spacer {
      width: 30vw;
      flex-shrink: 0;
    }
    .hs-item {
      width: 400px;
      height: 60vh;
      margin-right: 4vw;
      flex-shrink: 0;
      cursor: pointer;
      position: relative;
    }
    .hs-item-inner {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .hs-item-img-wrap {
      flex: 1;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.1);
      background: #111;
    }
    .hs-item-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(80%) contrast(1.2);
      transition: filter 0.4s ease, transform 0.4s ease;
      display: block;
    }
    .hs-item:hover .hs-item-img {
      filter: grayscale(0%) contrast(1.1);
      transform: scale(1.05);
    }
    .hs-item-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255,98,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
      color: #fff;
    }
    .hs-item:hover .hs-item-overlay { opacity: 1; }
    .hs-item-meta { font-family: ${T.mono}; }
    .hs-item-meta h3 {
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.5rem;
      color: #fff;
    }
    .hs-stats {
      font-size: 0.75rem;
      color: ${T.orange};
      letter-spacing: 0.05em;
    }

    /* LIGHTBOX FS (TELEMETRY VIEW) */
    .lightbox-fs {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .lightbox-fs-close {
      position: absolute;
      top: 2rem;
      right: 2rem;
      z-index: 100;
      background: none;
      border: none;
      color: #fff;
      font-size: 3rem;
      line-height: 1;
      cursor: pointer;
      font-family: ${T.mono};
      mix-blend-mode: difference;
    }
    .lightbox-fs-img-container {
      position: relative;
      width: 100vw;
      height: 100vh;
    }
    .lightbox-hero-img {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .lightbox-hero-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .lightbox-telemetry {
      position: absolute;
      bottom: 4rem;
      left: 4rem;
      z-index: 20;
      pointer-events: none;
    }
    .lightbox-telemetry h2 {
      font-family: ${T.head};
      font-size: clamp(2rem, 5vw, 4rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      margin-bottom: 2rem;
      color: #fff;
    }
    .telemetry-grid {
      display: flex;
      gap: 2rem;
    }
    .t-box {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-family: ${T.mono};
    }
    .t-box span {
      font-size: 0.65rem;
      color: ${T.muted};
      letter-spacing: 0.2em;
    }
    .t-box strong {
      font-size: 1.1rem;
      color: ${T.orange};
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    @media (max-width: 768px) {
      .hs-item { width: 300px; height: 50vh; }
      .lightbox-telemetry { bottom: 2rem; left: 2rem; right: 2rem; }
      .telemetry-grid { flex-direction: column; gap: 1rem; }
    }
  `;
