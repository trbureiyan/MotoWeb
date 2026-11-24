import { useCallback, useEffect, useState } from 'react';
import { IconRefresh, IconChart } from './Icons';

const RANGES = [
  { value: '7d', label: '7 DÍAS' },
  { value: '30d', label: '30 DÍAS' },
  { value: '90d', label: '90 DÍAS' }
];

const formatNumber = (value) => Number(value || 0).toLocaleString('es-CO');

/**
 * Dashboard de analítica (solo admin).
 * Lee page_views agregadas por el backend y permite consolidar el mes en workshop_stats.
 */
export function AnalyticsDashboard({ reloadSignal = 0 }) {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rolling, setRolling] = useState(false);
  const [rollupMsg, setRollupMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/analytics/summary?range=${range}`, { credentials: 'include' });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.message || 'No se pudo cargar la analítica.');
      setData(json);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    load();
  }, [load, reloadSignal]);

  const handleRollup = async () => {
    setRolling(true);
    setRollupMsg('');
    try {
      const now = new Date();
      const response = await fetch('/api/analytics/rollup', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 })
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.message || 'No se pudo consolidar el mes.');
      setRollupMsg(`MES ${json.periodMonth}/${json.periodYear} CONSOLIDADO`);
    } catch (requestError) {
      setRollupMsg(requestError.message);
    } finally {
      setRolling(false);
    }
  };

  const totals = data?.totals || { views: 0, uniqueUsers: 0, authenticated: 0, anonymous: 0 };
  const bySection = data?.bySection || [];
  const byDevice = data?.byDevice || [];
  const timeseries = data?.timeseries || [];
  const maxSection = Math.max(1, ...bySection.map(item => item.count));
  const maxTime = Math.max(1, ...timeseries.map(item => item.count));

  return (
    <section>
      <div className="admin-header-row">
        <div>
          <h1 className="admin-view-title">ANALÍTICA DE NAVEGACIÓN</h1>
          <p className="admin-view-sub">Secciones y eventos más usados, dispositivos y visitas por día (fuente: page_views).</p>
        </div>
        <div className="analytics-toolbar">
          <div className="analytics-range" role="group" aria-label="Rango de tiempo">
            {RANGES.map(item => (
              <button
                key={item.value}
                type="button"
                className={`analytics-range-btn${range === item.value ? ' active' : ''}`}
                onClick={() => setRange(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={`admin-icon-btn${loading ? ' spinning' : ''}`}
            onClick={load}
            disabled={loading}
            aria-label="Actualizar analítica"
            title="Actualizar analítica"
          >
            <IconRefresh size={16} />
          </button>
          <button
            type="button"
            className="btn-orange analytics-rollup-btn"
            onClick={handleRollup}
            disabled={rolling}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem' }}
          >
            <IconChart size={14} />
            {rolling ? 'CONSOLIDANDO…' : 'CONSOLIDAR MES'}
          </button>
        </div>
      </div>

      {error && <p role="alert" className="admin-inline-error">{error}</p>}
      {rollupMsg && <p className="analytics-rollup-msg">{rollupMsg}</p>}

      <div className="analytics-kpi-grid">
        <article className="analytics-kpi-card">
          <span className="analytics-kpi-value">{formatNumber(totals.views)}</span>
          <span className="analytics-kpi-label">VISTAS TOTALES</span>
        </article>
        <article className="analytics-kpi-card">
          <span className="analytics-kpi-value">{formatNumber(totals.uniqueUsers)}</span>
          <span className="analytics-kpi-label">USUARIOS ÚNICOS</span>
        </article>
        <article className="analytics-kpi-card">
          <span className="analytics-kpi-value">{formatNumber(totals.authenticated)}</span>
          <span className="analytics-kpi-label">SESIONES AUTENTICADAS</span>
        </article>
        <article className="analytics-kpi-card">
          <span className="analytics-kpi-value">{formatNumber(totals.anonymous)}</span>
          <span className="analytics-kpi-label">VISITAS ANÓNIMAS</span>
        </article>
      </div>

      <div className="analytics-panels">
        <div className="analytics-panel">
          <h2 className="analytics-panel-title">SECCIONES MÁS VISITADAS</h2>
          {bySection.length ? (
            <div className="analytics-bars">
              {bySection.map(item => (
                <div className="analytics-bar-row" key={item.section}>
                  <span className="analytics-bar-label">{item.section}</span>
                  <span className="analytics-bar-track">
                    <span className="analytics-bar-fill" style={{ width: `${Math.round((item.count / maxSection) * 100)}%` }} />
                  </span>
                  <span className="analytics-bar-value">{formatNumber(item.count)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="analytics-empty">AÚN NO HAY VISITAS REGISTRADAS EN ESTE RANGO.</p>
          )}
        </div>

        <div className="analytics-panel">
          <h2 className="analytics-panel-title">DISPOSITIVOS</h2>
          {byDevice.length ? (
            <div className="analytics-bars">
              {byDevice.map(item => (
                <div className="analytics-bar-row" key={item.device}>
                  <span className="analytics-bar-label">{item.device}</span>
                  <span className="analytics-bar-track">
                    <span className="analytics-bar-fill" style={{ width: `${Math.round((item.count / Math.max(1, ...byDevice.map(d => d.count))) * 100)}%` }} />
                  </span>
                  <span className="analytics-bar-value">{formatNumber(item.count)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="analytics-empty">SIN DATOS DE DISPOSITIVO.</p>
          )}
        </div>
      </div>

      <div className="analytics-panel analytics-panel--wide">
        <h2 className="analytics-panel-title">VISITAS POR DÍA</h2>
        {timeseries.length ? (
          <div className="analytics-time-chart" role="img" aria-label="Visitas por día">
            {timeseries.map(item => (
              <div className="analytics-time-col" key={item.date} title={`${item.date}: ${item.count}`}>
                <span className="analytics-time-bar" style={{ height: `${Math.max(4, Math.round((item.count / maxTime) * 100))}%` }} />
                <span className="analytics-time-date">{item.date.slice(5)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="analytics-empty">AÚN NO HAY VISITAS REGISTRADAS EN ESTE RANGO.</p>
        )}
      </div>
    </section>
  );
}
