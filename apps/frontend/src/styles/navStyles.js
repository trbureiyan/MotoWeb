export const navStyles = (T) => `
    .nav-login { background: transparent; border: 0; color: ${T.muted}; padding: .6rem .25rem; font-family: ${T.mono}; font-size: .62rem; letter-spacing: .08em; cursor: pointer; white-space: nowrap; transition: color .2s; }
    .nav-login:hover { color: ${T.orange}; }
    /* NAVBAR */
    .nav-root {
      position: sticky;
      top: 0;
      z-index: 999;
      background: rgba(14,14,14,0.65);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding: 0 2rem;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-logo {
      font-family: ${T.head};
      font-weight: 900;
      font-size: 1.35rem;
      letter-spacing: 0.12em;
      color: ${T.orange};
      text-decoration: none;
      text-transform: uppercase;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
    }
    .nav-links { display: flex; gap: 2rem; list-style: none; }
    .nav-links a {
      font-family: ${T.head};
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${T.muted};
      text-decoration: none;
      transition: color 0.2s;
    }
    .nav-links a:hover { color: ${T.text}; }

    /* MOBILE NAV */
    .nav-mobile-toggle {
      display: none;
      background: none;
      border: none;
      color: ${T.text};
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.5rem;
    }
    .nav-mobile-menu {
      position: fixed;
      top: 64px;
      left: 0;
      right: 0;
      background: rgba(14,14,14,0.95);
      backdrop-filter: blur(16px);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding: 1rem 2rem;
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 998;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .nav-mobile-menu.open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
    .nav-mobile-links {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      list-style: none;
      width: 100%;
      align-items: center;
    }
    .nav-mobile-links a {
      font-family: ${T.head};
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${T.muted};
      text-decoration: none;
      padding: 0.75rem 0;
      transition: color 0.2s;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      width: fit-content;
      text-align: center;
    }
    .nav-mobile-links a:hover { color: ${T.text}; }
    .nav-mobile-cta {
      margin-top: 1.5rem;
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      width: 100%;
    }
    .nav-mobile-cta .btn-orange {
      width: 100%;
      max-width: 260px;
    }
  `;
