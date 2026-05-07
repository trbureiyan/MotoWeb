import { useState } from 'react';
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
