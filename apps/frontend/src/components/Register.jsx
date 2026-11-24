import { useState } from 'react';

export function Register({ onBack, onRegister, onLogin }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error?.[0] || 'No fue posible crear la cuenta.');
      onRegister(data);
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
      <section className="login-panel" aria-labelledby="register-title">
        <button className="login-back" type="button" onClick={onBack}>← VOLVER AL INICIO</button>
        <div className="login-form-wrap">
          <span className="login-kicker">CREA TU CUENTA</span>
          <h1 id="register-title">ÚNETE A<br /><em>MOTO.TALLER.</em></h1>
          <p className="login-description">Regístrate para reservar y seguir tus servicios.</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="register-name">NOMBRE COMPLETO</label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Tu nombre"
            />
            <label htmlFor="register-email">CORREO ELECTRÓNICO</label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="tu@correo.com"
            />
            <label htmlFor="register-phone">TELÉFONO</label>
            <input
              id="register-phone"
              type="tel"
              autoComplete="tel"
              required
              minLength={7}
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              placeholder="Tu número de teléfono"
            />
            <label htmlFor="register-password">CONTRASEÑA</label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={5}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Mínimo 5 caracteres"
            />
            {error && <p className="login-error" role="alert">{error}</p>}
            <button className="btn-orange login-submit" type="submit" disabled={loading}>
              {loading ? 'CREANDO CUENTA…' : 'CREAR CUENTA'} <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="login-footnote">
            ¿Ya tienes cuenta? <button className="login-link" type="button" onClick={onLogin}>Inicia sesión aquí</button>
          </p>
        </div>
        <span className="login-panel-mark">MOTO.TALLER <span>© 2026</span></span>
      </section>
    </main>
  );
}
