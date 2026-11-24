// Telemetría ligera hacia la tabla page_views.
// Usa navigator.sendBeacon para no bloquear la navegación; cae a fetch keepalive
// cuando no está disponible. Nunca debe romper la UI: todos los fallos son silenciosos.
const ENDPOINT = '/api/analytics/views';

export const trackView = (section, event = 'view') => {
  if (!section || !event) return;
  const payload = JSON.stringify({ section, event });

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([payload], { type: 'application/json' });
      if (navigator.sendBeacon(ENDPOINT, blob)) return;
    }
  } catch {
    // continúa con fetch
  }

  try {
    fetch(ENDPOINT, {
      method: 'POST',
      credentials: 'include',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: payload
    }).catch(() => {});
  } catch {
    // silencioso
  }
};
