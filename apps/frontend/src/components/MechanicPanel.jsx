import { useState } from 'react';
import { AppointmentsBoard } from './AppointmentsBoard';
import { IconWrench, IconRefresh } from './Icons';
import { T } from '../styles/tokens';

/**
 * Interfaz exclusiva del rol "mecánico".
 * Solo expone el apartado de citas del taller, sin la facultad de cancelar.
 */
export function MechanicPanel({ onBack, loggedInUser }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshKey(key => key + 1);
    // El tablero recarga en segundo plano; liberamos el feedback visual pronto.
    window.setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <div className="admin-root">
      <header className="admin-topbar">
        <div className="admin-brand">
          <span className="admin-logo">MOTO.<span>TALLER</span></span>
          <span className="admin-badge">PANEL MECÁNICO</span>
        </div>

        <div className="admin-topbar-actions">
          <div className="admin-user-info">
            <IconWrench size={14} />
            MECÁNICO: <strong>{loggedInUser?.name || 'MECÁNICO'}</strong>
          </div>
          <button
            type="button"
            className={`admin-icon-btn${refreshing ? ' spinning' : ''}`}
            onClick={handleRefresh}
            aria-label="Actualizar contenido"
            title="Actualizar contenido"
          >
            <IconRefresh size={16} />
          </button>
          <button className="btn-outline" onClick={onBack} style={{ fontSize: '0.7rem', padding: '0.45rem 0.85rem' }}>
            ← VOLVER AL SITIO
          </button>
        </div>
      </header>

      <main className="admin-container">
        <AppointmentsBoard canCancel={false} reloadSignal={refreshKey} />
      </main>
    </div>
  );
}
