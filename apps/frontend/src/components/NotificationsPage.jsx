import { useEffect, useState } from 'react';

const STATUS_LABELS = {
  pending: 'PENDIENTE',
  confirmed: 'CONFIRMADA',
  completed: 'COMPLETADA',
  cancelled: 'CANCELADA'
};

const NOVEDAD_STATUS_LABELS = {
  open: 'ABIERTA',
  scheduled: 'AGENDADA',
  resolved: 'RESUELTA'
};

const SEVERITY_LABELS = {
  low: 'BAJA',
  medium: 'MEDIA',
  high: 'ALTA'
};

const formatDate = (value) => {
  if (!value) return 'Fecha no disponible';
  const datePart = String(value).slice(0, 10);
  const [year, month, day] = datePart.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12);
  return Number.isNaN(date.getTime())
    ? 'Fecha no disponible'
    : date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
};

const todayInputValue = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentModal, setPaymentModal] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [chainTarget, setChainTarget] = useState(null);
  const [chainSelection, setChainSelection] = useState([]);
  const [chainDate, setChainDate] = useState('');
  const [chainSubmitting, setChainSubmitting] = useState(false);
  const [chainError, setChainError] = useState('');

  useEffect(() => {
    let active = true;
    const refreshData = () => {
      setLoading(true);
      setError('');

      Promise.all([
        fetch('/api/appointments/mine', { credentials: 'include' }),
        fetch('/api/notifications', { credentials: 'include' })
      ])
        .then(async ([appointmentResponse, notificationResponse]) => {
          const [appointmentData, notificationData] = await Promise.all([
            appointmentResponse.json(),
            notificationResponse.json()
          ]);
          if (!appointmentResponse.ok) {
            throw new Error(appointmentData.message || 'No fue posible cargar tus citas.');
          }
          if (!notificationResponse.ok) {
            throw new Error(notificationData.message || 'No fue posible cargar tus notificaciones.');
          }
          if (!Array.isArray(appointmentData) || !Array.isArray(notificationData)) {
            throw new Error('El servidor devolvió información inválida.');
          }
          if (active) {
            setAppointments(appointmentData);
            setNotifications(notificationData);
            window.dispatchEvent(new Event('notifications:updated'));
          }
        })
        .catch(requestError => {
          if (active) setError(requestError.message || 'No se pudo conectar con el servidor.');
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    };

    refreshData();
    window.addEventListener('appointments:updated', refreshData);
    return () => {
      active = false;
      window.removeEventListener('appointments:updated', refreshData);
    };
  }, []);

  const markAsRead = async (notification) => {
    setError('');
    try {
      const response = await fetch(`/api/notifications/${notification.id}/read`, {
        method: 'PATCH',
        credentials: 'include'
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'No fue posible actualizar la notificación.');
      setNotifications(current => current.map(item => item.id === result.id ? result : item));
      window.dispatchEvent(new Event('notifications:updated'));
    } catch (requestError) {
      setError(requestError.message || 'No se pudo conectar con el servidor.');
    }
  };

  const openPaymentModal = (appointment, mode, amount, pendingCount) => {
    setPaymentModal({ appointment, mode, amount, pendingCount });
    setPaymentComplete(false);
    setPaymentResult(null);
    setError('');
  };

  const completeSimulatedPayment = async () => {
    if (!paymentModal) return;
    setError('');
    setProcessingPayment(true);
    try {
      const endpoint = paymentModal.mode === 'chain'
        ? `/api/payments/chain/${paymentModal.appointment.id}/simulate`
        : `/api/payments/${paymentModal.appointment.id}/simulate`;
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include'
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'No fue posible registrar el pago simulado.');

      setPaymentResult(result);
      setPaymentComplete(true);
      window.dispatchEvent(new Event('appointments:updated'));
    } catch (requestError) {
      setError(requestError.message || 'No se pudo conectar con el servidor.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const bookableNovedades = (appointment) => (appointment?.novedades || [])
    .filter(novedad => novedad.status === 'open');

  const openChainModal = (appointment) => {
    const bookable = bookableNovedades(appointment);
    if (!bookable.length) return;
    setChainTarget(appointment);
    setChainSelection(bookable.map(novedad => String(novedad.id)));
    setChainDate(todayInputValue());
    setChainError('');
  };

  const closeChainModal = () => {
    if (chainSubmitting) return;
    setChainTarget(null);
    setChainSelection([]);
    setChainDate('');
    setChainError('');
  };

  const toggleChainSelection = (id) => {
    setChainSelection(current => (
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]
    ));
  };

  const submitChain = async () => {
    if (!chainTarget || !chainSelection.length || !chainDate) return;
    setChainSubmitting(true);
    setChainError('');
    try {
      const response = await fetch(`/api/appointments/${chainTarget.id}/chain`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ novedadIds: chainSelection, requestedDate: chainDate })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'No fue posible agendar la corrección.');
      closeChainModal();
      window.dispatchEvent(new Event('appointments:updated'));
    } catch (requestError) {
      setChainError(requestError.message || 'No se pudo conectar con el servidor.');
    } finally {
      setChainSubmitting(false);
    }
  };

  const childrenOf = (appointment) => appointments
    .filter(item => item.isChain && String(item.chainRoot) === String(appointment.id))
    .sort((a, b) => new Date(a.requestedDate) - new Date(b.requestedDate));

  const chainPaymentSummary = (root) => {
    const items = [root, ...childrenOf(root)].filter(appointment =>
      appointment.status === 'completed' && appointment.payment
    );
    const total = items.reduce((sum, appointment) => sum + (appointment.payment.amount || 0), 0);
    const pending = items.filter(appointment => appointment.payment.status === 'pending');
    const pendingTotal = pending.reduce((sum, appointment) => sum + (appointment.payment.amount || 0), 0);
    return { items, total, pending, pendingTotal, paidTotal: total - pendingTotal };
  };

  const renderPaymentRow = (appointment) => {
    if (appointment.status !== 'completed' || !appointment.payment) return null;
    return (
      <div className="client-payment-row">
        <p>
          Monto: <strong>{appointment.payment.amount.toLocaleString('es-CO')} COP</strong>
          {appointment.payment.status === 'paid' ? ' · Pago simulado registrado.' : ' · Servicio completado.'}
        </p>
        {appointment.payment.status === 'pending' && (
          <button
            type="button"
            className="btn-orange"
            onClick={() => openPaymentModal(appointment, 'single', appointment.payment.amount, 1)}
          >
            PAGAR
          </button>
        )}
      </div>
    );
  };

  const renderChainTotal = (root) => {
    if (root.status !== 'completed') return null;
    const summary = chainPaymentSummary(root);
    if (summary.items.length < 2) return null;
    return (
      <div className="client-chain-total">
        <div className="client-chain-total-copy">
          <span>TOTAL ACUMULADO DE LA CADENA</span>
          <strong>{summary.total.toLocaleString('es-CO')} COP</strong>
          <small>
            {summary.items.length} servicio(s) · Pagado {summary.paidTotal.toLocaleString('es-CO')} COP
            {summary.pendingTotal > 0
              ? ` · Pendiente ${summary.pendingTotal.toLocaleString('es-CO')} COP`
              : ' · Todo pagado'}
          </small>
        </div>
        {summary.pending.length > 0 && (
          <button
            type="button"
            className="btn-orange"
            onClick={() => openPaymentModal(root, 'chain', summary.pendingTotal, summary.pending.length)}
          >
            PAGAR TODO ({summary.pending.length})
          </button>
        )}
      </div>
    );
  };

  const renderFindings = (appointment) => {
    if (appointment.status !== 'completed') return null;
    const novedades = appointment.novedades || [];
    const bookable = bookableNovedades(appointment);
    const allResolved = novedades.length === 0 || novedades.every(novedad => novedad.status === 'resolved');
    return (
      <div className="client-findings">
        <div className="client-findings-head">
          <span>NOVEDADES DEL SERVICIO</span>
          {bookable.length ? (
            <button type="button" className="btn-orange" onClick={() => openChainModal(appointment)}>
              AGENDAR CORRECCIONES ({bookable.length})
            </button>
          ) : allResolved ? (
            <span className="client-findings-ok">TODO EN ORDEN</span>
          ) : (
            <span className="client-findings-pending">CORRECCIÓN AGENDADA</span>
          )}
        </div>
        {novedades.length > 0 && (
          <ul className="client-findings-list">
            {novedades.map(novedad => (
              <li className="client-finding" key={novedad.id}>
                <div className="client-finding-main">
                  <span className={`client-novedad-dot ${novedad.status}`} />
                  <div className="client-finding-copy">
                    <strong>{novedad.description}</strong>
                    <small>
                      {SEVERITY_LABELS[novedad.severity] || 'MEDIA'}
                      {novedad.estimatedCost > 0
                        ? ` · Estimado ${novedad.estimatedCost.toLocaleString('es-CO')} COP`
                        : ''}
                      {novedad.status === 'resolved' && novedad.resolvedAt
                        ? ` · Resuelta ${formatDate(novedad.resolvedAt)}`
                        : ''}
                    </small>
                  </div>
                </div>
                <span className={`client-finding-status ${novedad.status}`}>
                  {NOVEDAD_STATUS_LABELS[novedad.status] || novedad.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderChain = (appointment) => {
    const children = childrenOf(appointment);
    if (!children.length) return null;
    return (
      <div className="client-chain-list">
        {children.map(child => (
          <div className="client-chain-item" key={child.id}>
            <div className="client-chain-head">
              <span>CORRECCIÓN DE NOVEDAD</span>
              <span className={`client-status-badge ${child.status}`}>
                {STATUS_LABELS[child.status] || child.status}
              </span>
            </div>
            <div className="client-chain-details">
              <div>
                <span>MOTIVO DE INGRESO</span>
                <strong>{child.chainReason || child.service}</strong>
              </div>
              <div>
                <span>FECHA</span>
                <strong>{formatDate(child.requestedDate)}</strong>
              </div>
              {child.status === 'completed' && child.adminNotes && (
                <div className="client-chain-notes">
                  <span>TRABAJO REALIZADO</span>
                  <strong>{child.adminNotes}</strong>
                </div>
              )}
            </div>
            {renderPaymentRow(child)}
          </div>
        ))}
      </div>
    );
  };

  const roots = appointments.filter(appointment => !appointment.isChain);
  const bookableTarget = chainTarget ? bookableNovedades(chainTarget) : [];

  return (
    <main className="client-notifications-page">
      <header className="client-notifications-header">
        <span className="client-page-kicker">ÁREA DE CLIENTES</span>
        <h1>MIS CITAS <em>&amp; NOTIFICACIONES</em></h1>
        <p>Consulta el estado de tus citas y las novedades de tu servicio.</p>
      </header>

      <div className="client-notifications-tabs" role="tablist" aria-label="Citas y notificaciones">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'appointments'}
          className={activeTab === 'appointments' ? 'active' : ''}
          onClick={() => setActiveTab('appointments')}
        >
          MIS CITAS <span>{appointments.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'notifications'}
          className={activeTab === 'notifications' ? 'active' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          NOTIFICACIONES <span>{notifications.filter(item => !item.isRead).length}</span>
        </button>
      </div>

      {error && <p className="client-page-error" role="alert">{error}</p>}
      {loading ? (
        <p className="client-page-empty" role="status">CARGANDO TU INFORMACIÓN…</p>
      ) : activeTab === 'appointments' ? (
        roots.length ? (
          <div className="client-appointment-list">
            {roots.map(appointment => (
              <article className="client-appointment-card" key={appointment.id}>
                <div className="client-appointment-card-header">
                  <div>
                    <span className="client-card-kicker">CITA DE SERVICIO</span>
                    <h2>{appointment.brand} {appointment.motorcycleModel}</h2>
                  </div>
                  <span className={`client-status-badge ${appointment.status}`}>
                    {STATUS_LABELS[appointment.status] || appointment.status}
                  </span>
                </div>
                <div className="client-appointment-details">
                  <div><span>SERVICIO</span><strong>{appointment.service}</strong></div>
                  <div><span>FECHA SOLICITADA</span><strong>{formatDate(appointment.requestedDate)}</strong></div>
                  {appointment.statusReason && (
                    <div className="client-appointment-reason">
                      <span>DETALLE</span><strong>{appointment.statusReason}</strong>
                    </div>
                  )}
                </div>
                {renderFindings(appointment)}
                {renderChain(appointment)}
                {renderPaymentRow(appointment)}
                {renderChainTotal(appointment)}
              </article>
            ))}
          </div>
        ) : (
          <p className="client-page-empty">AÚN NO TIENES CITAS REGISTRADAS.</p>
        )
      ) : notifications.length ? (
        <div className="client-notification-list">
          {notifications.map(notification => (
            <article className={`client-notification-card${notification.isRead ? '' : ' unread'}`} key={notification.id}>
              <div className="client-notification-copy">
                <span className="client-card-kicker">{formatDate(notification.createdAt)}</span>
                <p>{notification.message}</p>
              </div>
              {!notification.isRead && (
                <button type="button" className="client-mark-read" onClick={() => markAsRead(notification)}>
                  MARCAR LEÍDA
                </button>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="client-page-empty">NO TIENES NOTIFICACIONES POR AHORA.</p>
      )}

      {chainTarget && (
        <div className="client-payment-overlay" onClick={closeChainModal}>
          <section
            className="client-payment-modal client-chain-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chain-modal-title"
            onClick={event => event.stopPropagation()}
          >
            <button type="button" className="modal-close" aria-label="Cerrar" onClick={closeChainModal}>×</button>
            <span className="client-page-kicker">AGENDAR CORRECCIÓN</span>
            <h2 id="chain-modal-title">{chainTarget.brand} {chainTarget.motorcycleModel}</h2>
            <p>Selecciona las novedades que quieres corregir y la fecha de ingreso.</p>

            <ul className="client-chain-selection">
              {bookableTarget.map(novedad => (
                <li key={novedad.id}>
                  <label className="client-chain-option">
                    <input
                      type="checkbox"
                      checked={chainSelection.includes(String(novedad.id))}
                      onChange={() => toggleChainSelection(String(novedad.id))}
                    />
                    <span>{novedad.description}</span>
                  </label>
                </li>
              ))}
            </ul>

            <label className="client-form-label" htmlFor="chain-date">FECHA DE INGRESO</label>
            <input
              className="modal-input"
              id="chain-date"
              type="date"
              min={todayInputValue()}
              value={chainDate}
              onChange={event => setChainDate(event.target.value)}
            />

            {chainError && <p className="client-page-error" role="alert">{chainError}</p>}

            <div className="client-chain-actions">
              <button type="button" className="btn-outline" onClick={closeChainModal} disabled={chainSubmitting}>
                CANCELAR
              </button>
              <button
                type="button"
                className="btn-orange"
                onClick={submitChain}
                disabled={chainSubmitting || !chainSelection.length || !chainDate}
              >
                {chainSubmitting ? 'AGENDANDO…' : 'AGENDAR'}
              </button>
            </div>
          </section>
        </div>
      )}

      {paymentModal && (
        <div className="client-payment-overlay" onClick={() => setPaymentModal(null)}>
          <section
            className="client-payment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="simulated-payment-title"
            onClick={event => event.stopPropagation()}
          >
            <button type="button" className="modal-close" aria-label="Cerrar" onClick={() => setPaymentModal(null)}>×</button>
            {paymentComplete ? (
              <>
                <span className="client-page-kicker">PAGO DE DEMOSTRACIÓN</span>
                <h2 id="simulated-payment-title">SIMULACIÓN COMPLETADA</h2>
                <p>
                  Se registraron <strong>{(paymentResult?.amount ?? paymentModal.amount).toLocaleString('es-CO')} COP</strong>
                  {paymentModal.mode === 'chain' ? ` por ${paymentResult?.count ?? paymentModal.pendingCount} servicio(s) de la cadena.` : '.'}
                </p>
                <p>No se realizó ningún cobro ni se enviaron datos financieros.</p>
                <button type="button" className="btn-orange" onClick={() => setPaymentModal(null)}>CERRAR</button>
              </>
            ) : (
              <>
                <span className="client-page-kicker">PAGO DE DEMOSTRACIÓN</span>
                <h2 id="simulated-payment-title">
                  {paymentModal.mode === 'chain' ? 'PAGAR TODA LA CADENA' : 'PAGAR SERVICIO'}
                </h2>
                <p className="client-payment-amount">
                  Total: <strong>{paymentModal.amount.toLocaleString('es-CO')} COP</strong>
                </p>
                {paymentModal.mode === 'chain' && (
                  <p>
                    Incluye {paymentModal.pendingCount} pago(s) pendiente(s) de la cadena de {paymentModal.appointment.brand}{' '}
                    {paymentModal.appointment.motorcycleModel}.
                  </p>
                )}
                <div className="client-demo-card">
                  <span>MOTO.TALLER</span>
                  <strong>•••• &nbsp; •••• &nbsp; •••• &nbsp; 4242</strong>
                  <small>TARJETA DE PRUEBA · NO REAL</small>
                </div>
                <p>Simulación de pago.</p>
                <button type="button" className="btn-orange" onClick={completeSimulatedPayment} disabled={processingPayment}>
                  {processingPayment ? 'REGISTRANDO PAGO…' : 'SIMULAR PAGO'}
                </button>
                {error && <p className="client-page-error" role="alert">{error}</p>}
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
