import { useState } from 'react';
import { IconDisc, IconGauge, IconWrench } from './Icons';

const SERVICES = [
  {
    icon: <IconWrench />,
    title: 'Mantenimiento',
    hint: '// preventive & corrective',
    specs: [
      ['Intervalo', '5,000 km'],
      ['Aceite', 'Sintético 10W-40'],
      ['Filtros', 'K&N / OEM'],
      ['Sincronización', 'Carburadores / TBI'],
      ['Diagnóstico', 'ECU Scan'],
    ],
    base: '$180,000 COP',
  },
  {
    icon: <IconGauge />,
    title: 'Tuning',
    hint: '// performance mapping',
    specs: [
      ['ECU', 'Remap avanzado'],
      ['Potencia', '+15–25% torque'],
      ['Mapeo', 'Dyno + telemetría'],
      ['Escape', 'Full system'],
      ['Filtro', 'Aire de alto flujo'],
    ],
    base: '$350,000 COP',
  },
  {
    icon: <IconDisc />,
    title: 'Frenos',
    hint: '// brake engineering',
    specs: [
      ['Pastillas', 'Ferodo / Brembo'],
      ['Discos', 'Flotantes / sólidos'],
      ['Líquido', 'DOT 5.1 racing'],
      ['Caliper', 'Overhaul completo'],
      ['ABS', 'Calibración'], 
    ],
    base: '$220,000 COP',
  },
];

function FlipCard({ service }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={`flip-card${flipped ? ' flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
      <div className="flip-card-inner">
        <div className="flip-front">
          <div className="flip-front-icon">{service.icon}</div>
          <div className="flip-front-title">{service.title}</div>
          <div className="flip-front-hint">{service.hint}</div>
        </div>
        <div className="flip-back">
          <div>
            <div className="flip-back-title">ESPECIFICACIONES // {service.title.toUpperCase()}</div>
            <div className="flip-back-specs">
              {service.specs.map(([k, v]) => (
                <div key={k}>{k}: <span>{v}</span></div>
              ))}
            </div>
          </div>
          <div className="flip-back-price">Base: {service.base}</div>
        </div>
      </div>
    </div>
  );
}

export function Servicios() {
  return (
    <section className="section services-section" id="servicios">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-label reveal">// Capacidades del taller</div>
        <h2 className="section-title reveal">NUESTROS <em>SERVICIOS</em></h2>
        <div className="divider-line reveal" />
        <p className="section-sub reveal">Precisión mecánica y telemetría avanzada. Explorando los límites del rendimiento en el corazón de Neiva.</p>
        <div className="flip-grid reveal-stagger">
          {SERVICES.map(s => <FlipCard key={s.title} service={s} />)}
        </div>
      </div>
    </section>
  );
}
