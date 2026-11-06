import { useEffect, useState } from 'react';

const STATUS_LABELS = {
  pending: 'PENDIENTE',
  confirmed: 'CONFIRMADA',
  completed: 'COMPLETADA',
  cancelled: 'CANCELADA'
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

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentAppointment, setPaymentAppointment] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

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

  const completeSimulatedPayment = async () => {
    if (!paymentAppointment) return;
    setError('');
    setProcessingPayment(true);
    try {
      const response = await fetch(`/api/payments/${paymentAppointment.id}/simulate`, {
        method: 'POST',
        credentials: 'include'
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'No fue posible registrar el pago simulado.');

      setAppointments(current => current.map(appointment => (
        appointment.id === paymentAppointment.id
          ? { ...appointment, payment: result }
          : appointment
      )));
      setPaymentAppointment(current => ({ ...current, payment: result }));
      setPaymentComplete(true);
      window.dispatchEvent(new Event('appointments:updated'));
    } catch (requestError) {
      setError(requestError.message || 'No se pudo conectar con el servidor.');
    } finally {
      setProcessingPayment(false);
    }
  };

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
        appointments.length ? (
          <div className="client-appointment-list">
            {appointments.map(appointment => (
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
                {appointment.status === 'completed' && appointment.payment && (
                  <div className="client-payment-row">
                    <p>
                      Monto: <strong>{appointment.payment.amount.toLocaleString('es-CO')} COP</strong>
                      {appointment.payment.status === 'paid' ? ' · Pago simulado registrado.' : ' · Servicio completado.'}
                    </p>
                    {appointment.payment.status === 'pending' && (
                      <button
                        type="button"
                        className="btn-orange"
                        onClick={() => {
                          setPaymentAppointment(appointment);
                          setPaymentComplete(false);
                          setError('');
                        }}
                      >
                        PAGAR
                      </button>
                    )}
                  </div>
                )}
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

      {paymentAppointment && (
        <div className="client-payment-overlay" onClick={() => setPaymentAppointment(null)}>
          <section
            className="client-payment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="simulated-payment-title"
            onClick={event => event.stopPropagation()}
          >
            <button type="button" className="modal-close" aria-label="Cerrar" onClick={() => setPaymentAppointment(null)}>×</button>
            {paymentComplete ? (
              <>
                <span className="client-page-kicker">PAGO DE DEMOSTRACIÓN</span>
                <h2 id="simulated-payment-title">SIMULACIÓN COMPLETADA</h2>
                <p>No se realizó ningún cobro ni se enviaron datos financieros.</p>
                <button type="button" className="btn-orange" onClick={() => setPaymentAppointment(null)}>CERRAR</button>
              </>
            ) : (
              <>
                <span className="client-page-kicker">PAGO DE DEMOSTRACIÓN</span>
                <h2 id="simulated-payment-title">PAGAR SERVICIO</h2>
                <p className="client-payment-amount">
                  Total: <strong>{paymentAppointment.payment.amount.toLocaleString('es-CO')} COP</strong>
                </p>
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
