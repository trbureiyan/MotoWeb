import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useGSAP } from '@gsap/react';
import { animateMetricValue, animateTestimonialsSection } from '../animations/testimonialsAnimations';
import { IconStar, IconEye, IconEyeSlash, IconTrash } from './Icons';

function MetricCell({ prefix = '', value, suffix = '', label }) {
  const valueRef = useRef(null);

  useGSAP(() => {
    animateMetricValue(valueRef.current, value);
  }, { dependencies: [value] });

  return (
    <div className="metric-cell">
      <div className="metric-value">
        {prefix}<span ref={valueRef}>0</span>{suffix}
      </div>
      <div className="metric-label">{label}</div>
    </div>
  );
}

const STATIC_TESTIMONIALS = [
  {
    id: 't1',
    comment: 'El mejor tuning que le han hecho a mi moto. La respuesta en bajas revoluciones es increíble y la entrega de potencia lineal me quitó 2 segundos en el circuito.',
    name: 'Carlos Restrepo',
    motorcycle: 'Kawasaki ZX-10R',
    rating: 5,
    isApproved: true,
  },
  {
    id: 't2',
    comment: 'Mantenimiento impecable. Salen de aquí sin que nada quede al aire. Confíen en el taller para moto de alta cilindrada.',
    name: 'Alejandro Gómez',
    motorcycle: 'Yamaha R6',
    rating: 5,
    isApproved: true,
  },
  {
    id: 't3',
    comment: 'No le dejo mi moto a nadie más. El dyno muestra exactamente lo que le hacen a tu moto, pura transparencia y resultados reales en cada marcha.',
    name: 'Juan David Pérez',
    motorcycle: 'BMW S1000RR',
    rating: 5,
    isApproved: true,
  },
];

const RATING_DESCRIPTIONS = {
  1: 'Deficiente',
  2: 'Regular',
  3: 'Bueno',
  4: 'Muy bueno',
  5: 'Excelente',
};

function ReviewModal({ onClose, onSave }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [motorcycle, setMotorcycle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 3) {
      setError('Por favor escribe un comentario de al menos 3 caracteres.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onSave({ rating, motorcycle, comment });
      onClose();
    } catch (err) {
      setError(err.message || 'No fue posible enviar la reseña.');
      setSubmitting(false);
    }
  };

  const activeRating = hoverRating || rating;

  const modalContent = (
    <div className="review-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget && !submitting) onClose(); }}>
      <div className="review-modal" role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
        <button
          type="button"
          className="review-modal-close"
          onClick={onClose}
          aria-label="Cerrar modal"
          disabled={submitting}
        >
          ×
        </button>
        <h2 id="review-modal-title">DEJAR MI OPINIÓN</h2>
        <p className="review-modal-sub">
          Comparte tu experiencia con el taller y los servicios realizados a tu motocicleta.
        </p>

        {error && <div className="review-modal-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="star-picker-wrap">
            <span className="star-picker-label">Calificación general</span>
            <div className="star-picker-buttons">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="star-picker-btn"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${star} estrellas`}
                >
                  <IconStar size={26} filled={star <= activeRating} />
                </button>
              ))}
              <span className="star-picker-text">{RATING_DESCRIPTIONS[activeRating] || ''}</span>
            </div>
          </div>

          <div className="review-form-group">
            <label htmlFor="review-motorcycle">Motocicleta (Marca / Modelo - Opcional)</label>
            <input
              id="review-motorcycle"
              type="text"
              className="review-form-input"
              placeholder="Ej: Yamaha MT-09 o Kawasaki Ninja 400"
              value={motorcycle}
              onChange={(e) => setMotorcycle(e.target.value)}
              maxLength={120}
              disabled={submitting}
            />
          </div>

          <div className="review-form-group">
            <label htmlFor="review-comment">Tu experiencia con el taller *</label>
            <textarea
              id="review-comment"
              className="review-form-textarea"
              placeholder="Cuéntanos sobre el trabajo realizado, la atención, puntualidad o rendimiento de tu moto..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              required
              disabled={submitting}
            />
          </div>

          <div className="review-modal-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={onClose}
              disabled={submitting}
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="btn-orange"
              disabled={submitting || !comment.trim()}
            >
              {submitting ? 'PUBLICANDO…' : 'PUBLICAR RESEÑA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}

export function Testimonials({ loggedInUser, onRequireLogin }) {
  const sectionRef = useRef(null);
  const [testimonials, setTestimonials] = useState(STATIC_TESTIMONIALS);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const isAdmin = loggedInUser?.role === 'admin';

  useGSAP(() => {
    if (loading || testimonials.length === 0) return;
    animateTestimonialsSection(sectionRef.current);
  }, { scope: sectionRef, dependencies: [loading, testimonials.length] });

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews', { credentials: 'include' });
      if (!res.ok) throw new Error('No fue posible cargar las opiniones.');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setTestimonials(data);
      } else {
        setTestimonials(STATIC_TESTIMONIALS);
      }
    } catch {
      setTestimonials(STATIC_TESTIMONIALS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews, loggedInUser?.role]);

  const handleOpenReviewModal = () => {
    if (!loggedInUser) {
      if (onRequireLogin) onRequireLogin();
      return;
    }
    setShowModal(true);
  };

  const handleSaveReview = async ({ rating, motorcycle, comment }) => {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, motorcycle, comment }),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Error al guardar la reseña.');
    }
    setTestimonials((prev) => [result, ...prev]);
  };

  const handleToggleApprove = async (review) => {
    if (actionLoadingId) return;
    const nextApproved = !review.isApproved;
    setActionLoadingId(review.id);
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: nextApproved }),
      });
      if (!res.ok) throw new Error('No fue posible actualizar el estado.');
      const updated = await res.json();
      setTestimonials((prev) =>
        prev.map((item) => (item.id === review.id ? updated : item))
      );
    } catch (err) {
      alert(err.message || 'Error al actualizar reseña.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteReview = async (id) => {
    if (actionLoadingId) return;
    const confirmDelete = window.confirm('¿Deseas eliminar permanentemente esta reseña?');
    if (!confirmDelete) return;

    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('No fue posible eliminar la reseña.');
      setTestimonials((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message || 'Error al eliminar reseña.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <section className="section testimonials-section" ref={sectionRef} id="testimonios">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="testimonials-header-row">
          <div>
            <div className="section-label testimonials-kicker">Opiniones reales de clientes</div>
            <h2 className="section-title testimonials-title">
              <em>TESTIMONIOS DEL PADDOCK</em>
            </h2>
          </div>
          <button
            type="button"
            className="btn-outline review-open-btn"
            onClick={handleOpenReviewModal}
            aria-label="Dejar mi opinión sobre el taller"
          >
            <IconStar size={16} filled={true} />
            DEJAR MI OPINIÓN
          </button>
        </div>
        <div className="divider-line testimonials-divider" />

        <div className="carousel-container">
          {testimonials.map((t) => {
            const avatarInitial = t.name ? t.name.trim().charAt(0).toUpperCase() : 'C';
            const starsCount = Math.max(1, Math.min(5, t.rating || 5));

            return (
              <div key={t.id || `${t.name}-${t.motorcycle}`} className="carousel-item">
                <div className={`bento-card${t.isApproved === false ? ' review-card-hidden' : ''}`}>
                  {isAdmin && (
                    <div className="review-admin-toolbar">
                      {t.isApproved === false && (
                        <span className="review-hidden-badge" title="Esta reseña está oculta a los visitantes">
                          OCULTA
                        </span>
                      )}
                      <button
                        type="button"
                        className={`review-admin-action-btn ${t.isApproved ? 'btn-hide' : 'btn-show'}`}
                        onClick={() => handleToggleApprove(t)}
                        title={t.isApproved ? 'Ocultar testimonio para los clientes' : 'Publicar / Mostrar testimonio'}
                        aria-label={t.isApproved ? 'Ocultar' : 'Mostrar'}
                        disabled={actionLoadingId === t.id}
                      >
                        {t.isApproved ? <IconEyeSlash size={15} /> : <IconEye size={15} />}
                      </button>
                      <button
                        type="button"
                        className="review-admin-action-btn btn-delete"
                        onClick={() => handleDeleteReview(t.id)}
                        title="Eliminar testimonio"
                        aria-label="Eliminar testimonio"
                        disabled={actionLoadingId === t.id}
                      >
                        <IconTrash size={15} />
                      </button>
                    </div>
                  )}

                  <div className="review-stars-row" aria-label={`Calificación: ${starsCount} de 5 estrellas`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <IconStar
                        key={star}
                        size={15}
                        filled={star <= starsCount}
                        className={star <= starsCount ? 'star-filled' : 'star-empty'}
                      />
                    ))}
                  </div>

                  <p className="bento-quote">"{t.comment}"</p>

                  <div className="bento-rider">
                    {t.picture ? (
                      <img
                        src={t.picture}
                        alt={t.name}
                        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="bento-avatar">{avatarInitial}</div>
                    )}
                    <div>
                      <div className="bento-name">{t.name}</div>
                      <div className="bento-sub">{t.motorcycle || 'Cliente Moto.Taller'}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <MetricsRow />
      </div>

      {showModal && (
        <ReviewModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveReview}
        />
      )}
    </section>
  );
}

function MetricsRow() {
  const f1Races = 500;

  return (
    <div className="metrics-row">
      <MetricCell prefix="+" value={f1Races} label="Mapeos completados" />
      <MetricCell value={15} suffix=" Años" label="De experiencia técnica" />
      <MetricCell prefix="+" value={300} label="Velocidad Max km/h" />
    </div>
  );
}
