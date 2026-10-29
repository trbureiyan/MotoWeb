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
import { AdminPanel } from './components/AdminPanel';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [showModal, setShowModal] = useState(false);
  const [activeView, setActiveView] = useState('home');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [pendingBooking, setPendingBooking] = useState(null);
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

  const showAdminPanel = () => {
    setActiveView('admin');
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
        <Login onBack={showHome} onLogin={handleLogin} />
      ) : activeView === 'admin' ? (
        <AdminPanel onBack={showHome} loggedInUser={loggedInUser} />
      ) : <>
      <Navbar 
        onBooking={() => setShowModal(true)} 
        isGallery={activeView === 'gallery'} 
        onBack={showHome} 
        onLogin={showLogin}
        onLogout={handleLogout}
        onAdmin={showAdminPanel}
        loggedInUser={loggedInUser}
      />
      {activeView === 'gallery' ? (
        <GalleryPage onBack={showHome} />
      ) : (
        <>
          <Hero onBooking={() => setShowModal(true)} />
          <Servicios />
          <Testimonials />
          <Gallery onViewMore={showGalleryPage} />
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
