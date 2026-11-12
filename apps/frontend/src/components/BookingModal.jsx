import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { IconX } from './Icons';
import { BrandLogo } from './BrandLogo';
import { T } from '../styles/tokens';

const TARGET_BRANDS = ['DUCATI', 'BMW', 'KTM', 'YAMAHA', 'TRIUMPH', 'SUZUKI', 'HONDA', 'KAWASAKI', 'APRILIA'];
const FALLBACK_BRANDS = TARGET_BRANDS.map(name => ({ name, slug: name.toLowerCase(), logoUrl: '' }));
const MOTIVOS = ['DIAGNÓSTICO', 'REVISIÓN', 'MANTENIMIENTO PREVENTIVO'];
const CUSTOM_BRAND = 'CUSTOM';

function BrandOption({ brand, selected, onClick }) {
  return (
    <button
      type="button"
      className={`brand-btn brand-logo-btn${selected ? ' selected' : ''}`}
      onClick={onClick}
      aria-label={brand.name}
      title={brand.name}
    >
      <BrandLogo brand={brand} className="brand-option-logo" />
    </button>
  );
}

export function BookingModal({ onClose, loggedInUser, onRequireLogin, initialData }) {
  const [step, setStep] = useState(initialData?.step ?? 0);
  const [data, setData] = useState(initialData?.data || {
    brand: '',
    brandName: '',
    brandRequestId: '',
    brandRequestName: '',
    brandRequestOpen: false,
    motivo: '',
    fecha: '',
    modelo: ''
  });
  const [brandRequestOpen, setBrandRequestOpen] = useState(initialData?.data?.brandRequestOpen || false);
  const [brandRequestLoading, setBrandRequestLoading] = useState(false);
  const [brandRequestError, setBrandRequestError] = useState('');
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
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
    fetch('/api/brands')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) throw new Error('No hay marcas disponibles');
        setBrands(data.filter(brand => brand.isActive !== false));
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
      if (data.brand === CUSTOM_BRAND) return Boolean(data.brandRequestId && data.brandName);
      return true;
    }
    if (step === 1) {
      return MOTIVOS.includes(data.motivo);
    }
    if (step === 2) return data.fecha && data.modelo.trim().length > 2;
    if (step === 3) return true;
    return false;
  };

  const today = new Date().toISOString().split('T')[0];

  const selectedBrand = brands.find(brand => brand.slug === data.brand || brand.name === data.brand);
  const displayBrand = data.brand === CUSTOM_BRAND
    ? data.brandName
    : selectedBrand?.name || data.brandName || data.brand;

  const displayMotivo = data.motivo;

  const confirmAppointment = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(data.brand === CUSTOM_BRAND
            ? { brandRequestId: data.brandRequestId }
            : { brand: data.brand }),
          service: data.motivo,
          motorcycleModel: data.modelo,
          requestedDate: data.fecha
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'No fue posible registrar la cita.');
      setDone(true);
      window.dispatchEvent(new Event('notifications:updated'));
      window.dispatchEvent(new Event('appointments:updated'));
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitBrandRequest = async (event) => {
    event.preventDefault();
    setBrandRequestError('');
    if (!loggedInUser) {
      onRequireLogin?.({
        step,
        data: { ...data, brandRequestOpen: true }
      });
      return;
    }

    setBrandRequestLoading(true);
    try {
      const response = await fetch('/api/brands/requests', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.brandRequestName })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'No fue posible enviar la solicitud.');
      setData(current => ({
        ...current,
        brand: CUSTOM_BRAND,
        brandName: result.name,
        brandRequestId: result.id,
        brandRequestOpen: false
      }));
      setBrandRequestOpen(false);
    } catch (error) {
      setBrandRequestError(error.message || 'No se pudo conectar con el servidor.');
    } finally {
      setBrandRequestLoading(false);
    }
  };

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
                    <>
                      {brands.map(brand => (
                        <BrandOption
                          key={brand.id || brand.slug}
                          brand={brand}
                          selected={data.brand === brand.slug || data.brand === brand.name}
                          onClick={() => setData(current => ({
                            ...current,
                            brand: brand.slug || brand.name,
                            brandName: brand.name,
                            brandRequestId: ''
                          }))}
                        />
                      ))}
                      <button
                        type="button"
                        className="brand-btn brand-other-btn"
                        onClick={() => {
                          setBrandRequestError('');
                          setBrandRequestOpen(true);
                          update('brandRequestOpen', true);
                        }}
                      >
                        <span aria-hidden="true">+</span> OTRA MARCA
                      </button>
                    </>
                  )}
                </div>
                {data.brand === CUSTOM_BRAND && (
                  <p className="brand-review-note">Marca en revisión. Puedes reservar mientras el taller revisa la solicitud.</p>
                )}
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                {MOTIVOS.map(m => (
                  <button
                    key={m}
                    type="button"
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
                  {data.brand === CUSTOM_BRAND && (
                    <p className="brand-review-note">La marca se guardará en la cita con el nombre sugerido y quedará pendiente de revisión por el taller.</p>
                  )}
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

                {submitError && (
                  <div className="summary-alert" role="alert">
                    <div>
                      <div className="summary-alert-title">NO SE PUDO REGISTRAR LA CITA</div>
                      <p className="summary-alert-text">{submitError}</p>
                    </div>
                  </div>
                )}

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
                  onClick={confirmAppointment}
                  disabled={!canNext() || submitting}
                  style={{ opacity: canNext() && !submitting ? 1 : 0.4 }}
                >
                  {submitting ? 'REGISTRANDO...' : 'CONFIRMAR CITA'}
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
      {brandRequestOpen && (
        <div
          className="brand-request-overlay"
          onClick={event => {
            event.stopPropagation();
            setBrandRequestOpen(false);
            update('brandRequestOpen', false);
          }}
          onKeyDown={event => {
            event.stopPropagation();
            if (event.key === 'Escape') {
              setBrandRequestOpen(false);
              update('brandRequestOpen', false);
            }
          }}
        >
          <section
            className="brand-request-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="brand-request-title"
            onClick={event => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              aria-label="Cerrar"
              onClick={() => {
                setBrandRequestOpen(false);
                update('brandRequestOpen', false);
              }}
            >
              <IconX />
            </button>
            <div className="modal-step-label">SOLICITUD DE MARCA</div>
            <h2 className="modal-title" id="brand-request-title">¿NO ENCUENTRAS TU MARCA?</h2>
            <p className="modal-sub">
              Envía el nombre y el taller revisará la solicitud. El equipo administrador agregará el identificador y el logo.
            </p>
            <form onSubmit={submitBrandRequest}>
              <label className="brand-request-label" htmlFor="brand-request-name">NOMBRE DE LA MARCA</label>
              <input
                className="modal-input"
                id="brand-request-name"
                autoFocus
                maxLength={80}
                required
                minLength={2}
                value={data.brandRequestName || ''}
                onChange={event => update('brandRequestName', event.target.value)}
                placeholder="Ej. Royal Enfield"
              />
              {brandRequestError && <p className="login-error" role="alert">{brandRequestError}</p>}
              {!loggedInUser && (
                <p className="brand-review-note">Para enviar una sugerencia necesitas iniciar sesión. El nombre escrito se conservará.</p>
              )}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-back"
                  onClick={() => {
                    setBrandRequestOpen(false);
                    update('brandRequestOpen', false);
                  }}
                >
                  CANCELAR
                </button>
                <button
                  className="btn-orange"
                  type="submit"
                  disabled={brandRequestLoading || (loggedInUser && (data.brandRequestName || '').trim().length < 2)}
                >
                  {brandRequestLoading ? 'ENVIANDO…' : loggedInUser ? 'ENVIAR SOLICITUD' : 'INICIAR SESIÓN →'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
