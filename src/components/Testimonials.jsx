import { useEffect, useRef, useState } from 'react';

function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return [count, ref];
}

function MetricCell({ prefix = '', value, suffix = '', label }) {
  const [count, ref] = useCountUp(value);
  return (
    <div className="metric-cell" ref={ref}>
      <div className="metric-value">{prefix}{count}{suffix}</div>
      <div className="metric-label">{label}</div>
    </div>
  );
}

const STATIC_TESTIMONIALS = [
  {
    quote: 'El mejor tuning que le han hecho a mi moto. La respuesta en bajas revoluciones es increíble y la entrega de potencia lineal me quitó 2 segundos en el circuito.',
    bike: 'Kawasaki ZX-10R',
  },
  {
    quote: 'Mantenimiento impecable. Salen de aquí sin que nada quede al aire. Confíen en el taller para moto.',
    bike: 'Yamaha R6',
  },
  {
    quote: 'No le dejo mi moto a nadie más. El dyno muestra exactamente lo que le hacen a tu moto, pura transparencia y resultados reales en cada marcha.',
    bike: 'BMW S1000RR',
  },
];

export function Testimonials() {
  const [carouselRef, setCarouselRef] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=3&inc=name,picture')
      .then(res => res.json())
      .then(data => {
        const dynamicTestimonials = data.results.map((user, i) => ({
          quote: STATIC_TESTIMONIALS[i].quote,
          name: `${user.name.first} ${user.name.last}`,
          bike: STATIC_TESTIMONIALS[i].bike,
          picture: user.picture.medium,
          initial: user.name.first.charAt(0)
        }));
        setTestimonials(dynamicTestimonials);
      })
      .catch(() => {
        // Fallback
        setTestimonials(STATIC_TESTIMONIALS.map((t, i) => ({ ...t, name: `Piloto ${i+1}`, initial: `P${i+1}` })));
      })
      .finally(() => setLoading(false));
  }, []);

  let isDown = false;
  let startX;
  let scrollLeft;

  const handleMouseDown = (e) => {
    if(!carouselRef) return;
    isDown = true;
    startX = e.pageX - carouselRef.offsetLeft;
    scrollLeft = carouselRef.scrollLeft;
  };
  const handleMouseLeave = () => { isDown = false; };
  const handleMouseUp = () => { isDown = false; };
  const handleMouseMove = (e) => {
    if (!isDown || !carouselRef) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="section testimonials-section">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-label reveal">// Lo que dicen nuestros pilotos</div>
        <h2 className="section-title reveal">PRUEBA SOCIAL: <em>TESTIMONIOS DEL PADDOCK</em></h2>
        <div className="divider-line reveal" />
        <div 
          className="carousel-container reveal-stagger"
          ref={setCarouselRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {loading ? (
            <div style={{ textAlign: 'center', width: '100%', padding: '2rem 0' }} uk-spinner="ratio: 1.5"></div>
          ) : (
            testimonials.map((t, i) => (
              <div key={i} className="carousel-item">
                <div className="bento-card">
                  <p className="bento-quote">"{t.quote}"</p>
                  <div className="bento-rider">
                    {t.picture ? (
                      <img src={t.picture} alt={t.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div className="bento-avatar">{t.initial}</div>
                    )}
                    <div>
                      <div className="bento-name">{t.name}</div>
                      <div className="bento-sub">{t.bike}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <MetricsRow />
      </div>
    </section>
  );
}

function MetricsRow() {
  const [f1Races, setF1Races] = useState(500);

  useEffect(() => {
    fetch('http://ergast.com/api/f1/current.json')
      .then(res => res.json())
      .then(data => {
        const total = data.MRData.total || data.MRData.RaceTable.Races.length;
        setF1Races(parseInt(total, 10));
      })
      .catch(e => console.error("F1 API Error:", e));
  }, []);

  return (
    <div className="metrics-row reveal-stagger">
      <MetricCell prefix="+" value={f1Races} label="Mapeos completados" />
      <MetricCell value={15} suffix=" Años" label="De experiencia técnica" />
      <MetricCell prefix="+" value={300} label="Velocidad Max km/h" />
    </div>
  );
}
