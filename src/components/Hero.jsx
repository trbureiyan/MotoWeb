export function Hero({ onBooking }) {
  return (
    <section className="hero">
      <video 
        className="hero-video-bg" 
        src="src/assets/vid/VideoBanner.mp4" 
        autoPlay 
        loop 
        muted 
        playsInline 
      />
      <div className="hero-grid-bg" />
      <div className="hero-glow" />
      <div className="hero-inner animate-up reveal">
        <div className="hero-label">Neiva, Huila - Colombia</div>
        <h1 className="hero-h1">
          Moto.<span>Taller</span>
        </h1>
        <p className="hero-sub">
          Ingeniería de alto cilindraje para verdaderos entusiastas. Telemetría avanzada y tuning de élite en el corazón del sur de Colombia.
        </p>
        <div className="hero-actions">
          <button className="btn-orange" onClick={onBooking}>AGENDAR SERVICIO</button>
          <a href="#taller"><button className="btn-outline">VER ESPECIFICACIONES</button></a>
        </div>
      </div>
      <div className="hero-stat-row">
        <div className="hero-stat-item">
          <div className="hero-stat-value">+500</div>
          <div className="hero-stat-label">Mapeos</div>
        </div>
        <div className="hero-stat-item">
          <div className="hero-stat-value">15</div>
          <div className="hero-stat-label">Años</div>
        </div>
        <div className="hero-stat-item">
          <div className="hero-stat-value">300+</div>
          <div className="hero-stat-label">km/h</div>
        </div>
      </div>
    </section>
  );
}
