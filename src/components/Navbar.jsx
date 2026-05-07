export function Navbar({ onBooking }) {
  return (
    <nav className="nav-root">
      <a className="nav-logo" href="#">MOTOAPP</a>
      <ul className="nav-links">
        <li><a href="#servicios">Servicios</a></li>
        <li><a href="#taller">El Taller</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
      <button className="btn-orange" onClick={onBooking}>RESERVAR CITA</button>
    </nav>
  );
}
