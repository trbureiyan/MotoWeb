import { useState } from 'react';

export function Navbar({ onBooking, isGallery, onBack, onLogin, onLogout, onAdmin, loggedInUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const handleLogoClick = () => {
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`nav-root ${isGallery ? 'is-gallery' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="nav-area-left" style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
        {isGallery ? (
          <button className="btn-outline" onClick={onBack} style={{ fontSize: '0.65rem' }}>
            ← VOLVER
          </button>
        ) : (
          <button className="nav-logo" type="button" onClick={handleLogoClick} aria-label="Ir al inicio">
            MOTO.Taller
          </button>
        )}
      </div>

      <div className="nav-area-center" style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
        {isGallery ? (
          <span style={{ fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Galería de Fotos
          </span>
        ) : (
          <ul className="nav-links">
            <li><a href="#servicios">Servicios</a></li>
            <li><a href="#taller">El Taller</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        )}
      </div>

      <div className="nav-area-right" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
        {loggedInUser?.role === 'admin' && (
          <button className="btn-outline" type="button" onClick={onAdmin} style={{ borderColor: '#ff6200', color: '#ff6200', fontSize: '0.7rem', whiteSpace: 'nowrap', padding: '0.5rem 0.85rem' }}>
            PANEL ADMIN
          </button>
        )}

        {!isGallery && (loggedInUser ? (
          <>
            <span className="nav-user" aria-label={`Usuario conectado: ${loggedInUser.name}`}>
              {loggedInUser.name}
            </span>
            <button className="nav-logout" type="button" onClick={onLogout}>
              CERRAR SESIÓN
            </button>
          </>
        ) : (
          <button className="nav-login" type="button" onClick={onLogin}>
            INICIAR SESIÓN
          </button>
        ))}

        <button className="btn-orange" onClick={onBooking} style={{ whiteSpace: 'nowrap' }}>
          RESERVAR CITA
        </button>

        {!isGallery && (
          <button className="nav-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle mobile menu">
            {mobileMenuOpen ? '×' : '☰'}
          </button>
        )}
      </div>

      <div className={`nav-mobile-menu ${mobileMenuOpen && !isGallery ? 'open' : ''}`}>
        {!isGallery && (
          <ul className="nav-mobile-links">
            {loggedInUser?.role === 'admin' && (
              <li>
                <button type="button" onClick={() => { closeMobileMenu(); onAdmin && onAdmin(); }} style={{ background: 'none', border: 'none', color: '#ff6200', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Panel de Administrador
                </button>
              </li>
            )}
            <li><a href="#servicios" onClick={closeMobileMenu}>Servicios</a></li>
            <li><a href="#taller" onClick={closeMobileMenu}>El Taller</a></li>
            <li><a href="#contacto" onClick={closeMobileMenu}>Contacto</a></li>
          </ul>
        )}
      </div>
    </nav>
  );
}
