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
    padding: 1rem 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
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
`;
