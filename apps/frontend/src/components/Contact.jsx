import { useState } from 'react';
import { IconRadar } from './Icons';
import { T } from '../styles/tokens';

function WorkshopInfo() {
  const [showRadar, setShowRadar] = useState(false);

  return (
    <div>
      <div className="info-block">
        <div className="info-row">
          <div className="info-item">
            <div className="info-item-label">
              <span style={{ color: T.orange, marginRight: '0.4rem' }}>◉</span>
              Coordenadas
            </div>
            <div className="info-item-value">
              Zona Industrial Sur<br/>
              <span>Calle 6 Sur #10-46</span><br/>
              Neiva, Huila
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-label">
              <span style={{ color: T.orange, marginRight: '0.4rem' }}>◎</span>
              Horario Operativo
            </div>
            <div className="info-item-value">
              <span>LUN–VIE</span>&nbsp; 08:00 – 18:00<br/>
              <span>SAB</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 08:00 – 14:00<br/>
              <span>DOM</span>&nbsp;&nbsp;&nbsp;&nbsp; Cerrado
            </div>
          </div>
        </div>
        <div className="contact-btns reveal-stagger">
          <button className="contact-btn whatsapp">WhatsApp Directo</button>
          <button className="contact-btn email">Email Soporte</button>
        </div>
        {showRadar ? (
          <div className="map-placeholder reveal" style={{ padding: 0, overflow: 'hidden' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15933.155!2d-75.282!3d2.927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sco!4v1700000000000!5m2!1sen!2sco"
              title="Mapa del taller"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(1) contrast(1.2) brightness(0.8)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        ) : (
          <div
            className="map-placeholder reveal"
            role="button"
            tabIndex={0}
            aria-label="Activar radar de ubicacion"
            onClick={() => setShowRadar(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowRadar(true);
              }
            }}
            style={{ cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = T.bg2}
            onMouseOut={e => e.currentTarget.style.background = T.bg3}
          >
            <div style={{ color: T.orange }}><IconRadar /></div>
            <div className="map-placeholder-label">Activar Radar de Ubicación</div>
            <div style={{ fontFamily: T.mono, fontSize: '0.62rem', color: T.muted }}>2.927° N, 75.282° W</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Contact({ onBooking }) {
  return (
    <section className="section contact-section" id="contacto">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-label reveal">Canal directo con el taller</div>
        <h2 className="section-title reveal">INICIA EL <em>SEGUIMIENTO</em></h2>
        <div className="divider-line reveal" />
        <p className="section-sub reveal">Ponte en contacto con nuestro equipo de ingenieros para programar tu servicio o consultar sobre preparaciones específicas de alto rendimiento.</p>
        <div className="contact-grid">
          <div className="reveal">
            <button type="button" className="btn-orange" onClick={onBooking}>AGENDAR CITA</button>
          </div>
          <div className="reveal">
            <WorkshopInfo />
          </div>
        </div>
      </div>
    </section>
  );
}
