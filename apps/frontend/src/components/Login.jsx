import { useState } from 'react';

export function Login({ onBack, onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error?.[0] || 'No fue posible iniciar sesión.');
      onLogin(data);
    } catch (requestError) {
      setError(requestError.message || 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-image" aria-hidden="true">
        <div className="login-image-copy">
          <span className="login-kicker">MOTO.TALLER / ÁREA DE CLIENTES</span>
          <p>Tu próxima ruta<br />empieza aquí<span>.</span></p>
          <div className="login-image-line" />
          <span className="login-image-note">SERVICIO TÉCNICO · PASIÓN POR LAS MOTOS</span>
        </div>
      </div>
      <section className="login-panel" aria-labelledby="login-title">
        <button className="login-back" type="button" onClick={onBack}>← VOLVER AL INICIO</button>
        <div className="login-form-wrap">
          <span className="login-kicker">ACCESO SEGURO</span>
          <h1 id="login-title">BIENVENIDO<br /><em>DE NUEVO.</em></h1>
          <p className="login-description">Ingresa a tu cuenta para continuar.</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="login-email">CORREO ELECTRÓNICO</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="tu@correo.com"
            />
            <label htmlFor="login-password">CONTRASEÑA</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              minLength={5}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="••••••••"
            />
            {error && <p className="login-error" role="alert">{error}</p>}
            <button className="btn-orange login-submit" type="submit" disabled={loading}>
              {loading ? 'INGRESANDO…' : 'INICIAR SESIÓN'} <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="login-footnote">¿Necesitas ayuda? <a href="mailto:contacto@mototaller.com">Contáctanos</a></p>
        </div>
        <span className="login-panel-mark">MOTO.TALLER <span>© 2026</span></span>
      </section>
    </main>
  );
}
