import { useState } from 'react';
import { IconX } from './Icons';
import { T } from '../styles/tokens';

const BRANDS = ['DUCATI', 'BMW', 'KTM', 'YAMAHA', 'TRIUMPH', 'SUZUKI', 'HONDA', 'KAWASAKI', 'OTRO'];
const MOTIVOS = ['MANTENIMIENTO PREVENTIVO', 'TUNING ECU / MAPEO', 'FRENOS', 'DIAGNÓSTICO', 'PREPARACIÓN CIRCUITO', 'OTRO'];

export function BookingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ brand: '', motivo: '', fecha: '', nombre: '', telefono: '', modelo: '' });

  const update = (key, val) => setData(d => ({ ...d, [key]: val }));

  const steps = [
    { label: 'PASO 01', title: 'SELECCIONA LA MARCA', sub: 'Elige la marca de tu moto' },
    { label: 'PASO 02', title: 'MOTIVO DE INGRESO', sub: 'Define el tipo de servicio requerido' },
    { label: 'PASO 03', title: 'FECHA Y MODELO', sub: 'Agenda tu cita con nosotros' },
    { label: 'PASO 04', title: 'DATOS DEL PILOTO', sub: 'Información para confirmar tu reserva' },
  ];

  const canNext = () => {
    if (step === 0) return !!data.brand;
    if (step === 1) return !!data.motivo;
    if (step === 2) return !!data.fecha && !!data.modelo;
    if (step === 3) return !!data.nombre && !!data.telefono;
    return false;
  };

  const [done, setDone] = useState(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><IconX /></button>

        {done ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ color: T.orange, fontSize: '2.5rem', marginBottom: '1rem' }}>✓</div>
            <div className="modal-title">CITA CONFIRMADA</div>
            <p style={{ color: T.muted, fontSize: '0.85rem', marginTop: '0.75rem', fontFamily: T.mono }}>
              Recibirás confirmación en breve, {data.nombre}. ¡Nos vemos en el paddock!
            </p>
            <button className="btn-orange" style={{ marginTop: '1.5rem' }} onClick={onClose}>CERRAR</button>
          </div>
        ) : (
          <>
            <div className="modal-stepper">
              {steps.map((_, i) => (
                <div key={i} className={`modal-step-dot${i <= step ? ' active' : ''}`} />
              ))}
            </div>
            <div className="modal-step-label">{steps[step].label} / {steps.length}</div>
            <div className="modal-title">{steps[step].title}</div>
            <p className="modal-sub">{steps[step].sub}</p>

            {step === 0 && (
              <div className="brand-grid">
                {BRANDS.map(b => (
                  <button
                    key={b}
                    className={`brand-btn${data.brand === b ? ' selected' : ''}`}
                    onClick={() => update('brand', b)}
                  >{b}</button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                {MOTIVOS.map(m => (
                  <button
                    key={m}
                    className={`brand-btn${data.motivo === m ? ' selected' : ''}`}
                    style={{ textAlign: 'left', padding: '0.85rem 1rem' }}
                    onClick={() => update('motivo', m)}
                  >{m}</button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div>
                <input
                  className="modal-input"
                  placeholder="Modelo y cilindraje (ej: BMW S1000RR 2022)"
                  value={data.modelo}
                  onInput={e => update('modelo', e.target.value)}
                />
                <input
                  className="modal-input"
                  type="date"
                  value={data.fecha}
                  onInput={e => update('fecha', e.target.value)}
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <input
                  className="modal-input"
                  placeholder="Nombre completo"
                  value={data.nombre}
                  onInput={e => update('nombre', e.target.value)}
                />
                <input
                  className="modal-input"
                  placeholder="Teléfono o WhatsApp"
                  value={data.telefono}
                  onInput={e => update('telefono', e.target.value)}
                />
              </div>
            )}

            <div className="modal-actions">
              {step > 0
                ? <button className="btn-back" onClick={() => setStep(s => s - 1)}>← ATRÁS</button>
                : <div />
              }
              {step < steps.length - 1
                ? <button className="btn-orange" disabled={!canNext()} onClick={() => setStep(s => s + 1)} style={{ opacity: canNext() ? 1 : 0.4 }}>SIGUIENTE →</button>
                : <button className="btn-orange" disabled={!canNext()} onClick={() => setDone(true)} style={{ opacity: canNext() ? 1 : 0.4 }}>CONFIRMAR CITA</button>
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}
