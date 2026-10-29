import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { IconX } from './Icons';
import { T } from '../styles/tokens';

const TARGET_BRANDS = ['DUCATI', 'BMW', 'KTM', 'YAMAHA', 'TRIUMPH', 'SUZUKI', 'HONDA', 'KAWASAKI'];
const FALLBACK_BRANDS = [...TARGET_BRANDS, 'OTRO'];
const MOTIVOS = ['MANTENIMIENTO PREVENTIVO', 'TUNING ECU / MAPEO', 'FRENOS', 'DIAGNÓSTICO', 'PREPARACIÓN CIRCUITO', 'OTRO'];

export function BookingModal({ onClose, loggedInUser, onRequireLogin, initialData }) {
  const [step, setStep] = useState(initialData?.step ?? 0);
  const [data, setData] = useState(initialData?.data || {
    brand: '',
    otraMarca: '',
    motivo: '',
    otroMotivo: '',
    fecha: '',
    modelo: ''
  });
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [done, setDone] = useState(false);
  const modalRef = useRef();

  useGSAP(() => {
    gsap.from('.modal-overlay', { opacity: 0, duration: 0.4, ease: 'power2.out' });
    gsap.from('.modal-box', { 
      y: 50, 
      opacity: 0, 
      duration: 0.6, 
      ease: 'back.out(1.5)',
      delay: 0.1
    });
  }, { scope: modalRef });

  useEffect(() => {
    setLoadingBrands(true);
    fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/motorcycle?format=json')
      .then(r => r.json())
      .then(d => {
        const results = d.Results || [];
        const verified = TARGET_BRANDS.filter(target =>
          results.some(r => r.MakeName?.toUpperCase().trim() === target)
        );
        if (verified.length > 0) {
          setBrands([...verified, 'OTRO']);
        } else {
          setBrands(FALLBACK_BRANDS);
        }
      })
      .catch(() => setBrands(FALLBACK_BRANDS))
      .finally(() => setLoadingBrands(false));
  }, []);

  const update = (key, val) => {
    setData(d => ({ ...d, [key]: val }));
  };

  const steps = [
    { label: 'PASO 01', title: 'SELECCIONA LA MARCA', sub: 'Elige la marca de tu moto' },
    { label: 'PASO 02', title: 'MOTIVO DE INGRESO', sub: 'Define el tipo de servicio requerido' },
    { label: 'PASO 03', title: 'FECHA Y MODELO', sub: 'Agenda tu cita con nosotros' },
    { label: 'PASO 04', title: 'RESUMEN DE TU CITA', sub: 'Revisa los detalles antes de confirmar' },
  ];

  const canNext = () => {
    if (step === 0) {
      if (!data.brand) return false;
      if (data.brand === 'OTRO') return (data.otraMarca || '').trim().length > 1;
      return true;
    }
    if (step === 1) {
      if (!data.motivo) return false;
      if (data.motivo === 'OTRO') return (data.otroMotivo || '').trim().length > 2;
      return true;
    }
    if (step === 2) return data.fecha && data.modelo.trim().length > 2;
    if (step === 3) return true;
    return false;
  };

  const today = new Date().toISOString().split('T')[0];

  const displayBrand = data.brand === 'OTRO' 
    ? (data.otraMarca ? data.otraMarca.trim().toUpperCase() : 'OTRO')
    : data.brand;

  const displayMotivo = data.motivo === 'OTRO'
    ? (data.otroMotivo ? `OTRO: ${data.otroMotivo.trim().toUpperCase()}` : 'OTRO')
    : data.motivo;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClose();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Cerrar modal"
      ref={modalRef}
    >
      <div
        className="modal-box"
        onClick={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Reserva de cita"
        tabIndex={-1}
      >
        <button className="modal-close" onClick={onClose}><IconX /></button>

        {done ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ color: T.orange, fontSize: '2.5rem', marginBottom: '1rem' }}>✓</div>
            <div className="modal-title">CITA CONFIRMADA</div>
            <p style={{ color: T.muted, fontSize: '0.85rem', marginTop: '0.75rem', fontFamily: T.mono }}>
              Recibirás confirmación en breve{loggedInUser?.name ? `, ${loggedInUser.name}` : ''}. ¡Nos vemos en el paddock!
            </p>
            <button className="btn-orange" style={{ marginTop: '1.5rem' }} onClick={onClose}>CERRAR</button>
          </div>
        ) : (
          <>
            <div className="modal-stepper">
              {steps.map((stepItem, i) => (
                <div key={stepItem.label} className={`modal-step-dot${i <= step ? ' active' : ''}`} />
              ))}
            </div>
            <div className="modal-step-label">{steps[step].label} / {steps.length}</div>
            <div className="modal-title">{steps[step].title}</div>
            <p className="modal-sub">{steps[step].sub}</p>

            {step === 0 && (
              <div>
                <div className="brand-grid">
                  {loadingBrands ? (
                    <div
                      style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '2rem 0' }}
                      data-uk-spinner="ratio: 1.5"
                      role="status"
                      aria-live="polite"
                      aria-busy="true"
                    ></div>
                  ) : (
                    brands.map(b => (
                      <button
                        key={b}
                        type="button"
                        className={`brand-btn${data.brand === b ? ' selected' : ''}`}
                        onClick={() => update('brand', b)}
                      >{b}</button>
                    ))
                  )}
                </div>

                {data.brand === 'OTRO' && (
                  <input
                    className="modal-input"
                    autoFocus
                    style={{ marginTop: '0.5rem', marginBottom: 0 }}
                    placeholder="Especifícanos la marca de tu moto (ej: Royal Enfield, Bajaj, Aprilia)"
                    value={data.otraMarca || ''}
                    onChange={e => update('otraMarca', e.target.value)}
                  />
                )}
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                {MOTIVOS.map(m => (
                  <div key={m} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <button
                      type="button"
                      className={`brand-btn${data.motivo === m ? ' selected' : ''}`}
                      style={{ textAlign: 'left', padding: '0.85rem 1rem' }}
                      onClick={() => update('motivo', m)}
                    >{m}</button>
                    {m === 'OTRO' && data.motivo === 'OTRO' && (
                      <input
                        className="modal-input"
                        autoFocus
                        style={{ marginTop: '0.2rem', marginBottom: 0 }}
                        placeholder="Especifiquenos su servicio deseado"
                        value={data.otroMotivo || ''}
                        onChange={e => update('otroMotivo', e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div>
                <input
                  className="modal-input"
                  placeholder="Modelo y cilindraje (ej: BMW S1000RR 2022)"
                  value={data.modelo}
                  onChange={e => update('modelo', e.target.value)}
                />
                <input
                  className="modal-input"
                  type="date"
                  min={today}
                  value={data.fecha}
                  onChange={e => update('fecha', e.target.value)}
                  onKeyDown={e => e.preventDefault()}
                  onPaste={e => e.preventDefault()}
                  onDrop={e => e.preventDefault()}
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            )}

            {step === 3 && (
              <div className="booking-summary">
                <div className="summary-card">
                  <div className="summary-card-title">DETALLES DE LA RESERVA</div>
                  <div className="summary-row">
                    <span className="summary-label">MARCA:</span>
                    <span className="summary-value">{displayBrand || 'NO DEFINIDA'}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">MODELO:</span>
                    <span className="summary-value">{data.modelo || 'NO DEFINIDO'}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">SERVICIO:</span>
                    <span className="summary-value">{displayMotivo || 'NO DEFINIDO'}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">FECHA SOLICITADA:</span>
                    <span className="summary-value">{data.fecha || 'NO DEFINIDA'}</span>
                  </div>
                </div>

                {loggedInUser ? (
                  <div className="summary-card">
                    <div className="summary-card-title">DATOS DEL PILOTO (DE TU CUENTA)</div>
                    <div className="summary-row">
                      <span className="summary-label">PILOTO:</span>
                      <span className="summary-value">{loggedInUser.name}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">CONTACTO / TEL:</span>
                      <span className="summary-value">{loggedInUser.phone || 'NO REGISTRADO'}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">CORREO:</span>
                      <span className="summary-value" style={{ textTransform: 'lowercase' }}>{loggedInUser.email}</span>
                    </div>
                  </div>
                ) : (
                  <div className="summary-alert">
                    <div style={{ fontSize: '1.2rem', lineHeight: 1 }}>⚠️</div>
                    <div>
                      <div className="summary-alert-title">INICIO DE SESIÓN REQUERIDO</div>
                      <p className="summary-alert-text">
                        Para registrar tu cita con un nombre y teléfono válidos, debes iniciar sesión con tu cuenta. Tus datos seleccionados se conservarán.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="modal-actions">
              {step > 0
                ? <button className="btn-back" onClick={() => setStep(s => s - 1)}>← ATRÁS</button>
                : <div />
              }
              {step < steps.length - 1 ? (
                <button
                  className="btn-orange"
                  disabled={!canNext()}
                  onClick={() => setStep(s => s + 1)}
                  style={{ opacity: canNext() ? 1 : 0.4 }}
                >
                  SIGUIENTE →
                </button>
              ) : loggedInUser ? (
                <button
                  className="btn-orange"
                  disabled={!canNext()}
                  onClick={() => setDone(true)}
                  style={{ opacity: canNext() ? 1 : 0.4 }}
                >
                  CONFIRMAR CITA
                </button>
              ) : (
                <button
                  className="btn-orange"
                  onClick={() => onRequireLogin && onRequireLogin({ step: 3, data })}
                >
                  INICIAR SESIÓN PARA CONFIRMAR →
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
