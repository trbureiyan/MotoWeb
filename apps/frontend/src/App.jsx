import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import { BookingModal } from './components/BookingModal';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Gallery, GalleryPage } from './components/Gallery';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Servicios } from './components/Servicios';
import { Testimonials } from './components/Testimonials';
import { Preloader } from './components/Preloader';
import { SoftCursor } from './components/SoftCursor';
import { Styles } from './styles/Styles';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { AdminPanel } from './components/AdminPanel';
import { MechanicPanel } from './components/MechanicPanel';
import { BrandsCarousel } from './components/BrandsCarousel';
import { NotificationsPage } from './components/NotificationsPage';
import { trackView } from './utils/analytics';

export const FALLBACK_GALLERY_IMAGES = [
  { id: 'g1', src: 'https://images.pexels.com/photos/17243626/pexels-photo-17243626.jpeg?auto=compress&cs=tinysrgb&w=1000', label: 'BMW S1000RR 2024 - Tuning ECU', displayOrder: 1 },
  { id: 'g2', src: 'https://images.pexels.com/photos/8532387/pexels-photo-8532387.png?auto=compress&cs=tinysrgb&w=1000', label: 'Yamaha R1 - Suspensión', displayOrder: 2 },
  { id: 'g3', src: 'https://images.pexels.com/photos/30180721/pexels-photo-30180721.jpeg?auto=compress&cs=tinysrgb&w=1000', label: 'Kawasaki ZX-10R - Frenos Brembo', displayOrder: 3 },
  { id: 'g4', src: 'https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?w=1000&q=70&auto=format&fit=crop', label: 'Ducati Panigale V4 - Mapeo Dyno', displayOrder: 4 },
  { id: 'g5', src: 'https://images.pexels.com/photos/33203558/pexels-photo-33203558.jpeg?auto=compress&cs=tinysrgb&w=1000', label: 'Honda CBR 1000RR-R - Mantenimiento', displayOrder: 5 },
  { id: 'g6', src: 'https://images.pexels.com/photos/17900720/pexels-photo-17900720.jpeg?auto=compress&cs=tinysrgb&w=1000', label: 'Suzuki GSX-R 1000 - Full Service', displayOrder: 6 },
  { id: 'g7', src: 'https://www.moto.ch/wp-content/uploads/2024/12/Honda-CB1000-Hornet_01-1300x867.jpg', label: 'Honda CB1000 Hornet SP 2024', displayOrder: 7 },
  { id: 'g8', src: 'https://images.pexels.com/photos/11605405/pexels-photo-11605405.jpeg?auto=compress&cs=tinysrgb&w=1000', label: 'Aprilia RSV4 - Puesta a punto', displayOrder: 8 },
  { id: 'g9', src: 'https://images.pexels.com/photos/27184237/pexels-photo-27184237.jpeg?auto=compress&cs=tinysrgb&w=1000', label: 'Ducati Multistrada v4 - Detalle final', displayOrder: 9 },
  { id: 'g10', src: 'https://images.pexels.com/photos/33522279/pexels-photo-33522279.jpeg?auto=compress&cs=tinysrgb&w=1000', label: 'Triumph Street Triple - Revisión general', displayOrder: 10 },
  { id: 'g11', src: 'https://images.unsplash.com/photo-1656767112164-f9f59766357d?q=70&w=1000&auto=format&fit=crop', label: 'KTM 1290 Super Duke - Diagnóstico ECU', displayOrder: 11 },
  { id: 'g12', src: 'https://images.pexels.com/photos/9064725/pexels-photo-9064725.jpeg?auto=compress&cs=tinysrgb&w=1000', label: 'BMW R nineT - Servicio premium', displayOrder: 12 },
];

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [showModal, setShowModal] = useState(false);
  const [activeView, setActiveView] = useState('home');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [galleryImages, setGalleryImages] = useState(FALLBACK_GALLERY_IMAGES);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState('');
  const appRef = useRef();

  useEffect(() => {
    fetch('/api/auth/profile', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(user => {
        if (user && (user.id || user._id || user.name)) {
          setLoggedInUser(user);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    trackView(activeView, 'view');
  }, [activeView]);

  const loadGallery = useCallback(() => {
    setGalleryLoading(true);
    setGalleryError('');
    return fetch('/api/gallery')
      .then(async (response) => {
        if (!response.ok) {
          let msg = 'No se pudo cargar la galería.';
          try { const body = await response.json(); msg = body?.message || msg; } catch { /* non-JSON */ }
          throw new Error(msg);
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setGalleryImages(data.map(image => ({
            id: image.id || image._id,
            src: image.imageUrl,
            label: image.caption || 'Trabajo del taller',
            displayOrder: image.displayOrder || 0
          })));
        }
      })
      .catch(error => {
        setGalleryError(error.message);
      })
      .finally(() => setGalleryLoading(false));
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const addGalleryImage = async ({ imageUrl, caption }) => {
    const response = await fetch('/api/gallery', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, caption })
    });
    let data;
    try { data = await response.json(); } catch { throw new Error('Error de conexión con el servidor.'); }
    if (!response.ok) throw new Error(data?.message || 'No se pudo agregar la imagen.');

    const image = {
      id: data.id || data._id,
      src: data.imageUrl,
      label: data.caption || 'Trabajo del taller',
      displayOrder: data.displayOrder || 0
    };
    setGalleryImages(current => [...current, image].sort((a, b) => a.displayOrder - b.displayOrder));
    setGalleryError('');
  };

  useGSAP(() => {
    // Reveal simple
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Reveal stagger
    gsap.utils.toArray('.reveal-stagger').forEach((container) => {
      gsap.fromTo(container.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    ScrollTrigger.refresh();
  }, { scope: appRef, dependencies: [activeView, galleryLoading, galleryImages.length] });

  const showGalleryPage = () => {
    setActiveView('gallery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showHome = () => {
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showLogin = () => {
    setActiveView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showRegister = () => {
    setActiveView('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showAdminPanel = () => {
    setActiveView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showMechanicPanel = () => {
    if (loggedInUser && loggedInUser.role !== 'mechanic') return;
    setActiveView('mechanic');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showNotifications = () => {
    if (loggedInUser?.role !== 'client') return;
    setActiveView('notifications');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openBooking = () => {
    trackView('booking', 'open');
    setShowModal(true);
  };

  const handleLogin = (user) => {
    setLoggedInUser(user);
    trackView('auth', 'login');
    if (user.role === 'admin') {
      showAdminPanel();
    } else if (user.role === 'mechanic') {
      showMechanicPanel();
    } else {
      showHome();
    }
    if (pendingBooking) {
      setShowModal(true);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('No fue posible cerrar la sesión.');
      }

      setLoggedInUser(null);
      showHome();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div ref={appRef}>
      <Preloader />
      <SoftCursor />
      <Styles />
      {activeView === 'login' ? (
        <Login onBack={showHome} onLogin={handleLogin} onRegister={showRegister} />
      ) : activeView === 'register' ? (
        <Register onBack={showHome} onRegister={handleLogin} onLogin={showLogin} />
      ) : activeView === 'admin' ? (
        <AdminPanel
          onBack={showHome}
          loggedInUser={loggedInUser}
          galleryImages={galleryImages}
          galleryLoading={galleryLoading}
          galleryError={galleryError}
          onAddGalleryImage={addGalleryImage}
          onRefreshGallery={loadGallery}
        />
      ) : activeView === 'mechanic' && loggedInUser?.role === 'mechanic' ? (
        <MechanicPanel
          onBack={showHome}
          loggedInUser={loggedInUser}
        />
      ) : <>
      <Navbar 
        onBooking={openBooking} 
        isGallery={activeView === 'gallery'} 
        isNotifications={activeView === 'notifications'}
        currentView={activeView}
        onBack={showHome} 
        onLogin={showLogin}
        onLogout={handleLogout}
        onAdmin={showAdminPanel}
        onMechanic={showMechanicPanel}
        onNotifications={showNotifications}
        loggedInUser={loggedInUser}
      />
      {activeView === 'notifications' && loggedInUser?.role === 'client' ? (
        <NotificationsPage />
      ) : activeView === 'gallery' ? (
        <GalleryPage
          onBack={showHome}
          items={galleryImages}
          isAdmin={loggedInUser?.role === 'admin'}
          onAddImage={addGalleryImage}
          loading={galleryLoading}
          error={galleryError}
        />
      ) : (
        <>
          <Hero onBooking={openBooking} />
          <BrandsCarousel />
          <Servicios />
          <Testimonials loggedInUser={loggedInUser} onRequireLogin={showLogin} />
          <Gallery
            onViewMore={showGalleryPage}
            items={galleryImages}
            isAdmin={loggedInUser?.role === 'admin'}
            onAddImage={addGalleryImage}
            loading={galleryLoading}
            error={galleryError}
          />
          <Contact onBooking={openBooking} />
          <Footer />
        </>
      )}
      {showModal && (
        <BookingModal 
          onClose={() => {
            setShowModal(false);
            setPendingBooking(null);
          }}
          loggedInUser={loggedInUser}
          initialData={pendingBooking}
          onRequireLogin={(bookingState) => {
            setPendingBooking(bookingState);
            setShowModal(false);
            showLogin();
          }}
        />
      )}
      </>}
    </div>
  );
}
