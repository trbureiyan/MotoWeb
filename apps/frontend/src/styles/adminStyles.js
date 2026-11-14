export const adminStyles = (T) => `
  /* ==========================================================
     ADMIN PANEL STYLES (MOTO.TALLER)
     ========================================================== */
  .admin-root {
    min-height: 100vh;
    background: ${T.bg0};
    color: ${T.text};
    font-family: ${T.body};
    padding-bottom: 4rem;
  }

  /* TOPBAR */
  .admin-topbar {
    background: ${T.bg1};
    border-bottom: 1px solid ${T.border};
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .admin-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .admin-logo {
    font-family: ${T.head};
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: #fff;
    text-transform: uppercase;
  }
  .admin-logo span {
    color: ${T.orange};
  }
  .admin-badge {
    font-family: ${T.mono};
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;
    background: ${T.orangeGlow};
    border: 1px solid ${T.orange};
    color: ${T.orange};
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .admin-topbar-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .admin-user-info {
    font-family: ${T.mono};
    font-size: 0.75rem;
    color: ${T.muted};
    display: none;
  }
  @media (min-width: 768px) {
    .admin-user-info { display: block; }
  }
  .admin-user-info strong {
    color: ${T.text};
  }
  .admin-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    color: ${T.muted};
    background: transparent;
    border: 1px solid ${T.border};
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
  }
  .admin-icon-btn:hover {
    color: ${T.orange};
    border-color: ${T.orange};
  }
  .admin-icon-btn:disabled {
    opacity: 0.5;
    cursor: wait;
  }
  .admin-icon-btn.spinning svg {
    animation: admin-spin 0.7s linear infinite;
  }
  @keyframes admin-spin {
    to { transform: rotate(360deg); }
  }
  .admin-refreshing {
    font-family: ${T.mono};
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${T.orange};
    white-space: nowrap;
  }

  /* NAV TABS */
  .admin-tabs-nav {
    background: ${T.bg1};
    border-bottom: 1px solid ${T.border};
    padding: 0 1.5rem;
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .admin-tabs-nav::-webkit-scrollbar {
    display: none;
  }
  .admin-tab-btn {
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: ${T.muted};
    font-family: ${T.mono};
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    padding: 1rem 0.85rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 1 0;
    gap: 0.5rem;
    white-space: nowrap;
    transition: all 0.2s ease;
    text-transform: uppercase;
  }
  .admin-tab-btn:hover {
    color: ${T.text};
  }
  .admin-tab-btn.active {
    color: ${T.orange};
    border-bottom-color: ${T.orange};
    background: ${T.orangeGlow};
  }
  .admin-tab-badge {
    font-family: ${T.mono};
    font-size: 0.6rem;
    background: ${T.bg3};
    color: ${T.muted};
    padding: 0.1rem 0.4rem;
    border-radius: 2px;
  }
  .admin-tab-btn.active .admin-tab-badge {
    background: ${T.orange};
    color: #000;
    font-weight: 700;
  }

  /* MAIN CONTENT */
  .admin-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  .admin-header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .admin-view-title {
    font-family: ${T.head};
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 0 0 0.25rem 0;
  }
  .admin-view-sub {
    font-family: ${T.mono};
    font-size: 0.75rem;
    color: ${T.muted};
    margin: 0;
  }

  /* STATS ROW */
  .admin-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .admin-stat-card {
    background: ${T.bg1};
    border: 1px solid ${T.border};
    border-left: 3px solid ${T.border};
    padding: 1.1rem 1.25rem;
    transition: border-color 0.2s;
  }
  .admin-stat-card.highlight {
    border-left-color: ${T.orange};
  }
  .admin-stat-label {
    font-family: ${T.mono};
    font-size: 0.68rem;
    color: ${T.muted};
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }
  .admin-stat-value {
    font-family: ${T.head};
    font-size: 1.8rem;
    font-weight: 800;
    color: #fff;
    line-height: 1;
  }

  /* TOOLBAR: SEARCH & FILTERS */
  .admin-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
    background: ${T.bg1};
    border: 1px solid ${T.border};
    padding: 0.85rem 1rem;
  }
  .admin-search-wrap {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 240px;
    background: ${T.bg2};
    border: 1px solid ${T.border};
    padding: 0.45rem 0.75rem;
  }
  .admin-search-input {
    background: transparent;
    border: none;
    color: ${T.text};
    font-family: ${T.mono};
    font-size: 0.78rem;
    outline: none;
    width: 100%;
  }
  .admin-search-input::placeholder {
    color: ${T.muted};
  }
  .admin-filter-group {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    overflow-x: auto;
  }
  .admin-filter-btn {
    background: ${T.bg2};
    border: 1px solid ${T.border};
    color: ${T.muted};
    font-family: ${T.mono};
    font-size: 0.68rem;
    padding: 0.4rem 0.75rem;
    cursor: pointer;
    letter-spacing: 0.08em;
    white-space: nowrap;
    text-transform: uppercase;
    transition: all 0.15s;
  }
  .admin-filter-btn:hover {
    color: ${T.text};
    border-color: ${T.muted};
  }
  .admin-filter-btn.active {
    background: ${T.orange};
    border-color: ${T.orange};
    color: #000;
    font-weight: 700;
  }

  /* TABLES & CARDS */
  .admin-table-container {
    background: ${T.bg1};
    border: 1px solid ${T.border};
    overflow-x: auto;
  }
  .admin-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.8rem;
  }
  .admin-table th {
    background: ${T.bg2};
    border-bottom: 1px solid ${T.border};
    padding: 0.85rem 1rem;
    font-family: ${T.mono};
    font-size: 0.68rem;
    color: ${T.orange};
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 600;
    white-space: nowrap;
  }
  .admin-table td {
    padding: 0.95rem 1rem;
    border-bottom: 1px solid ${T.border};
    vertical-align: middle;
  }
  .admin-table tr:last-child td {
    border-bottom: none;
  }
  .admin-table tr:hover td {
    background: rgba(255, 98, 0, 0.03);
  }

  /* STATUS BADGES */
  .badge-status {
    display: inline-block;
    font-family: ${T.mono};
    font-size: 0.65rem;
    font-weight: 700;
    padding: 0.25rem 0.55rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: 1px solid transparent;
  }
  .badge-status.pending {
    background: rgba(255, 98, 0, 0.15);
    border-color: ${T.orangeDim};
    color: ${T.orange};
  }
  .badge-status.confirmed {
    background: rgba(59, 130, 246, 0.15);
    border-color: #2563eb;
    color: #60a5fa;
  }
  .badge-status.completed {
    background: rgba(34, 197, 94, 0.15);
    border-color: #16a34a;
    color: #4ade80;
  }
  .badge-status.cancelled {
    background: rgba(239, 68, 68, 0.15);
    border-color: #dc2626;
    color: #f87171;
  }
  .badge-status.active {
    background: rgba(34, 197, 94, 0.15);
    border-color: #16a34a;
    color: #4ade80;
  }
  .badge-status.inactive {
    background: rgba(136, 136, 136, 0.15);
    border-color: #555;
    color: #aaa;
  }

  /* ACTION BUTTONS */
  .admin-actions-cell {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .btn-action-icon {
    background: ${T.bg2};
    border: 1px solid ${T.border};
    color: ${T.text};
    padding: 0.4rem 0.6rem;
    font-family: ${T.mono};
    font-size: 0.68rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    transition: all 0.15s;
    text-transform: uppercase;
  }
  .btn-action-icon:hover {
    border-color: ${T.orange};
    color: ${T.orange};
  }
  .btn-action-icon.danger:hover {
    border-color: #ef4444;
    color: #ef4444;
  }
  .btn-action-icon.success:hover {
    border-color: #22c55e;
    color: #22c55e;
  }

  /* MODAL IN ADMIN */
  .admin-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    animation: fadeIn 0.2s ease;
  }
  .admin-modal-card {
    background: ${T.bg1};
    border: 1px solid ${T.border};
    border-top: 2px solid ${T.orange};
    width: 100%;
    max-width: 500px;
    padding: 2rem;
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
  }
  .admin-form-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 1rem;
  }
  .admin-form-label {
    font-family: ${T.mono};
    font-size: 0.68rem;
    color: ${T.orange};
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
  .admin-form-input, .admin-form-textarea, .admin-form-select {
    background: ${T.bg2};
    border: 1px solid ${T.border};
    color: ${T.text};
    font-family: ${T.mono};
    font-size: 0.82rem;
    padding: 0.75rem 0.85rem;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
    box-sizing: border-box;
  }
  .admin-form-input:focus, .admin-form-textarea:focus, .admin-form-select:focus {
    border-color: ${T.orange};
  }
  .admin-form-textarea {
    min-height: 80px;
    resize: vertical;
  }

  /* NOVEDADES */
  .admin-novedad-list {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    max-width: 260px;
  }
  .admin-novedad-line {
    display: flex;
    align-items: flex-start;
    gap: 0.35rem;
    font-size: 0.75rem;
    line-height: 1.3;
  }
  .admin-novedad-more {
    font-family: ${T.mono};
    font-size: 0.66rem;
    color: ${T.muted};
  }
  .admin-novedad-dot {
    display: inline-block;
    flex: 0 0 auto;
    width: 7px;
    height: 7px;
    margin-top: 0.28rem;
    border-radius: 50%;
    background: ${T.muted};
  }
  .admin-novedad-dot.open { background: ${T.orange}; }
  .admin-novedad-dot.scheduled { background: #f5c542; }
  .admin-novedad-dot.resolved { background: #3ecf8e; }
  .admin-novedad-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
  .admin-check-inline {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: ${T.mono};
    font-size: 0.68rem;
    color: ${T.muted};
    cursor: pointer;
    white-space: nowrap;
  }
  .admin-check-inline input {
    accent-color: ${T.orange};
  }
  .admin-novedad-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 110px 130px auto;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  .admin-novedad-row .admin-form-input {
    width: 100%;
    box-sizing: border-box;
  }
  .admin-novedad-readonly {
    list-style: none;
    margin: 0;
    padding: 0.75rem;
    background: ${T.bg0};
    border: 1px solid ${T.border};
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    font-size: 0.78rem;
  }
  .admin-novedad-readonly li {
    display: flex;
    align-items: flex-start;
    gap: 0.45rem;
  }
  @media (max-width: 768px) {
    .admin-novedad-row {
      grid-template-columns: 1fr;
    }
  }

  /* CASCADA DE CADENAS */
  .admin-chain-label {
    display: inline-block;
    margin-bottom: 0.35rem;
    padding: 0.12rem 0.4rem;
    border: 1px solid rgba(255, 98, 0, 0.45);
    color: ${T.orange};
    font-family: ${T.mono};
    font-size: 0.58rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .admin-chain-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    margin-top: 0.45rem;
    padding: 0.22rem 0.5rem;
    background: transparent;
    border: 1px solid ${T.border};
    color: ${T.muted};
    font-family: ${T.mono};
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
  }
  .admin-chain-toggle:hover,
  .admin-chain-toggle[aria-expanded="true"] {
    color: ${T.orange};
    border-color: rgba(255, 98, 0, 0.55);
    background: rgba(255, 98, 0, 0.06);
  }
  .admin-table tr.admin-chain-root td:first-child {
    box-shadow: inset 2px 0 0 rgba(255, 98, 0, 0.55);
  }
  .admin-table tr.admin-chain-row td {
    background: ${T.bg0};
  }
  .admin-table tr.admin-chain-row:hover td {
    background: rgba(255, 98, 0, 0.06);
  }
  .admin-table tr.admin-chain-row td:first-child {
    position: relative;
    padding-left: 2.1rem;
    border-left: 2px solid rgba(255, 98, 0, 0.3);
  }
  .admin-table tr.admin-chain-row td:first-child::before {
    content: "";
    position: absolute;
    left: 0.95rem;
    top: 0;
    bottom: 50%;
    width: 1px;
    background: rgba(255, 98, 0, 0.35);
  }
  .admin-table tr.admin-chain-row td:first-child::after {
    content: "";
    position: absolute;
    left: 0.95rem;
    top: 50%;
    width: 0.8rem;
    height: 1px;
    background: rgba(255, 98, 0, 0.35);
  }

  /* EMPTY STATE */
  .admin-empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: ${T.muted};
    font-family: ${T.mono};
    font-size: 0.82rem;
  }

  /* RESPONSIVE CARDS FOR SMALL SCREENS */
  @media (max-width: 768px) {
    .admin-container {
      padding: 1.25rem 1rem;
    }
    .admin-table th, .admin-table td {
      padding: 0.65rem 0.75rem;
    }
  }

  /* ==========================================================
     RECORD CARDS — rediseño de citas, servicios, marcas,
     usuarios y pagos (galería no se toca)
     ========================================================== */
  .admin-inline-error {
    margin: 0 0 1rem;
    padding: 0.75rem 1rem;
    color: #ffb4a3;
    background: rgba(180, 45, 20, 0.18);
    border: 1px solid rgba(255, 98, 0, 0.4);
    font-size: 0.78rem;
  }
  .admin-inline-error--top {
    margin: 1rem auto 0;
    max-width: 1200px;
  }
  .admin-section-sub {
    font-family: ${T.mono};
    font-size: 0.72rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: ${T.orange};
    margin: 0 0 0.9rem;
  }
  .admin-card-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* --- Tarjeta de cita --- */
  .apt-card {
    background: ${T.bg1};
    border: 1px solid ${T.border};
    border-left: 4px solid ${T.border};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.28);
    overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .apt-card:hover {
    border-left-color: ${T.orange};
  }
  .apt-card.has-chain {
    border-left-color: ${T.orange};
  }
  .apt-main-row {
    display: grid;
    grid-template-columns: 1.3fr 1.9fr 1.7fr 1.9fr 2.1fr 1.2fr 1.3fr;
    gap: 1rem;
    padding: 1.1rem 1.25rem;
    align-items: start;
  }
  .apt-cell { min-width: 0; }
  .apt-cell h4 {
    margin: 0 0 0.3rem;
    font-size: 0.85rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }
  .apt-cell p {
    margin: 0;
    font-family: ${T.mono};
    font-size: 0.72rem;
    color: ${T.muted};
    line-height: 1.4;
    overflow-wrap: anywhere;
  }
  .apt-cell h4.apt-date { font-family: ${T.mono}; }
  .apt-cell p.apt-id { font-size: 0.64rem; letter-spacing: 0.04em; }
  .apt-cell h4.apt-brand { color: ${T.orange}; letter-spacing: 0.04em; }
  .apt-cell-muted { font-size: 0.75rem; color: ${T.muted}; }
  .apt-cell-note { display: block; margin-top: 0.3rem; font-size: 0.72rem; color: ${T.text}; }
  .apt-novedad-list { display: grid; gap: 0.25rem; }
  .apt-cell-status { display: flex; flex-direction: column; gap: 0.4rem; align-items: flex-start; }
  .apt-audit {
    font-family: ${T.mono};
    font-size: 0.6rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${T.muted};
  }
  .apt-cell-actions {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    align-items: stretch;
  }
  .apt-cell-actions .btn-action-icon {
    justify-content: center;
    white-space: nowrap;
  }
  .apt-chain-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-top: 0.55rem;
    padding: 0.28rem 0.6rem;
    background: transparent;
    border: 1px solid ${T.orange};
    color: ${T.orange};
    font-family: ${T.mono};
    font-size: 0.62rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.15s;
  }
  .apt-chain-toggle:hover,
  .apt-chain-toggle[aria-expanded="true"] {
    background: rgba(255, 98, 0, 0.12);
  }
  .apt-sub-container {
    background: ${T.bg0};
    border-top: 1px solid ${T.border};
    padding: 1rem 1.25rem 1.25rem 2.4rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }
  .apt-sub-item {
    background: ${T.bg1};
    border: 1px solid ${T.border};
    border-left: 2px solid rgba(255, 98, 0, 0.4);
    padding: 0.9rem 1rem;
  }
  .apt-sub-item .apt-main-row { padding: 0; }
  .apt-sub-tag {
    display: inline-block;
    margin-bottom: 0.4rem;
    padding: 0.12rem 0.45rem;
    border: 1px solid rgba(255, 98, 0, 0.5);
    color: ${T.orange};
    font-family: ${T.mono};
    font-size: 0.56rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* --- Tarjetas genéricas de registro --- */
  .admin-record-card {
    background: ${T.bg1};
    border: 1px solid ${T.border};
    border-left: 3px solid ${T.border};
    padding: 1.1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    transition: border-color 0.2s, background 0.2s;
  }
  .admin-record-card:hover {
    border-left-color: ${T.orange};
    background: ${T.bg2};
  }
  .admin-record-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .admin-record-title {
    margin: 0;
    font-family: ${T.head};
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: #fff;
  }
  .admin-record-title--brand { color: ${T.orange}; }
  .admin-record-desc {
    margin: 0;
    font-size: 0.78rem;
    color: ${T.muted};
    line-height: 1.5;
  }
  .admin-record-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1.5rem;
    font-family: ${T.mono};
    font-size: 0.7rem;
    color: ${T.muted};
    letter-spacing: 0.04em;
  }
  .admin-record-meta strong { color: ${T.text}; font-weight: 600; }
  .admin-record-amount {
    font-family: ${T.mono};
    font-size: 0.9rem;
    font-weight: 700;
    color: ${T.orange};
    white-space: nowrap;
  }
  .admin-record-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 0.5rem;
  }
  .admin-role-field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    min-width: 180px;
  }
  .admin-role-select {
    padding: 0.5rem 0.6rem;
    font-size: 0.72rem;
    text-transform: uppercase;
  }
  .admin-role-tag.confirmed { color: #60a5fa; }
  .admin-role-tag.active { color: #4ade80; }
  .admin-role-tag.pending { color: ${T.orange}; }

  @media (max-width: 1024px) {
    .apt-main-row {
      grid-template-columns: 1fr 1fr;
      gap: 0.85rem;
    }
    .apt-cell-actions { flex-direction: row; flex-wrap: wrap; }
  }
  @media (max-width: 640px) {
    .apt-main-row {
      grid-template-columns: 1fr;
    }
    .apt-sub-container { padding: 0.85rem 0.9rem 0.9rem 1.2rem; }
  }
`;
