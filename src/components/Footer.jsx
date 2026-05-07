import { useState } from 'react';
import { T } from '../styles/tokens';
import { FaInstagram, FaFacebookF, FaYoutube, FaTiktok } from 'react-icons/fa';

export function Footer() {
  const [email, setEmail] = useState('');
  return (
    <footer className="footer">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="footer-grid">
          <div>
            <div className="footer-col-title">MOTO.TALLER LAB</div>
            <ul className="footer-links">
              <li><a href="#">Servicios</a></li>
              <li><a href="#taller">El Taller</a></li>
              <li><a href="#contacto">Contacto</a></li>
              <li><a href="#">Blog Técnico</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">LEGAL</div>
            <ul className="footer-links">
              <li><a href="#">Términos y Condiciones</a></li>
              <li><a href="#">Política de Privacidad</a></li>
              <li><a href="#">Garantía de Servicio</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">REDES</div>
            <div className="footer-social">
              <a href="#" className="social-btn" aria-label="Instagram"><FaInstagram size={18} /></a>
              <a href="#" className="social-btn" aria-label="Facebook"><FaFacebookF size={18} /></a>
              <a href="#" className="social-btn" aria-label="YouTube"><FaYoutube size={18} /></a>
              <a href="#" className="social-btn" aria-label="TikTok"><FaTiktok size={18} /></a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">ÚNETE AL PADDOCK</div>
            <p style={{ fontSize: '0.78rem', color: T.muted, marginBottom: '0.75rem', lineHeight: 1.6 }}>
              Noticias técnicas, promociones y novedades del taller directo a tu inbox.
            </p>
            <div className="newsletter-input-row">
              <input
                className="newsletter-input"
                placeholder="tu@email.com"
                value={email}
                onInput={e => setEmail(e.target.value)}
              />
              <button className="newsletter-btn">→</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 MOTOTaller. Neiva, Huila - Colombia. Todos los derechos reservados.</div>
          <div className="footer-logo-mark">MOTO.TALLER</div>
        </div>
      </div>
    </footer>
  );
}
