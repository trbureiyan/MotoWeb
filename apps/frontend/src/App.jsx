import { useState, useRef, useEffect } from 'react';
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
import { BrandsCarousel } from './components/BrandsCarousel';
import { NotificationsPage } from './components/NotificationsPage';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [showModal, setShowModal] = useState(false);
  const [activeView, setActiveView] = useState('home');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
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
    fetch('/api/gallery')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || 'No se pudo cargar la galería.');
        setGalleryImages(data.map(image => ({
          id: image.id || image._id,
          src: image.imageUrl,
          label: image.caption || 'Trabajo del taller',
          displayOrder: image.displayOrder || 0
        })));
      })
      .catch(error => setGalleryError(error.message))
      .finally(() => setGalleryLoading(false));
  }, []);

  const addGalleryImage = async ({ imageUrl, caption }) => {
    const response = await fetch('/api/gallery', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, caption })
    });
    const data = await response.json();
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
  }, { scope: appRef, dependencies: [activeView] });

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

  const showNotifications = () => {
    if (loggedInUser?.role !== 'client') return;
    setActiveView('notifications');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (user) => {
    setLoggedInUser(user);
    if (user.role === 'admin') {
      showAdminPanel();
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
        />
      ) : <>
      <Navbar 
        onBooking={() => setShowModal(true)} 
        isGallery={activeView === 'gallery'} 
        isNotifications={activeView === 'notifications'}
        currentView={activeView}
        onBack={showHome} 
        onLogin={showLogin}
        onLogout={handleLogout}
        onAdmin={showAdminPanel}
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
          <Hero onBooking={() => setShowModal(true)} />
          <BrandsCarousel />
          <Servicios />
          <Testimonials />
          <Gallery
            onViewMore={showGalleryPage}
            items={galleryImages}
            isAdmin={loggedInUser?.role === 'admin'}
            onAddImage={addGalleryImage}
            loading={galleryLoading}
            error={galleryError}
          />
          <Contact />
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
