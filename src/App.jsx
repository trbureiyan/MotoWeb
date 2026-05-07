import { useState, useEffect } from 'react';
import { BookingModal } from './components/BookingModal';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Gallery } from './components/Gallery';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Servicios } from './components/Servicios';
import { Testimonials } from './components/Testimonials';
import { Styles } from './styles/Styles';

export function App() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.reveal, .reveal-stagger');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div>
      <Styles />
      <Navbar onBooking={() => setShowModal(true)} />
      <Hero onBooking={() => setShowModal(true)} />
      <Servicios />
      <Testimonials />
      <Gallery />
      <Contact />
      <Footer />
      {showModal && <BookingModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
