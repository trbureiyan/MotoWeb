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

const TESTIMONIALS = [
  {
    quote: 'El mejor tuning que le han hecho a mi moto. La respuesta en bajas revoluciones es increíble y la entrega de potencia lineal me quitó 2 segundos en el circuito.',
    name: 'Carlos M.',
    bike: 'Kawasaki ZX-10R',
    initial: 'C',
    featured: true,
  },
  {
    quote: 'Mantenimiento impecable. Salen de aquí sin que nada quede al aire. Confíen en el taller para moto.',
    name: 'Andrés G.',
    bike: 'Yamaha R6',
    initial: 'A',
  },
  {
    quote: 'No le dejo mi moto a nadie más. El dyno muestra exactamente lo que le hacen a tu moto, pura transparencia y resultados reales en cada marcha.',
    name: 'Felipe G.',
    bike: 'BMW S1000RR',
    initial: 'F',
  },
];

export function Testimonials() {
  return (
    <section className="section testimonials-section">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-label">// Lo que dicen nuestros pilotos</div>
        <h2 className="section-title">PRUEBA SOCIAL: <em>TESTIMONIOS DEL PADDOCK</em></h2>
        <div className="divider-line" />
        <div className="bento-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`bento-card${t.featured ? ' featured' : ''}`}>
              <p className="bento-quote">"{t.quote}"</p>
              <div className="bento-rider">
                <div className="bento-avatar">{t.initial}</div>
                <div>
                  <div className="bento-name">{t.name}</div>
                  <div className="bento-sub">{t.bike}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="metrics-row">
          <MetricCell prefix="+" value={500} label="Mapeos completados" />
          <MetricCell value={15} suffix=" Años" label="De experiencia técnica" />
          <MetricCell value={300} suffix="km/h+" label="Velocidad máxima validada" />
        </div>
      </div>
    </section>
  );
}
