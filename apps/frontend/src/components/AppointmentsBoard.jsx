import { useState, useEffect } from 'react';
import { IconCheck, IconX } from './Icons';
import { T } from '../styles/tokens';

const apiRequest = async (path, options = {}) => {
  const response = await fetch(path, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data?.message || 'La operación no pudo completarse.');
  return data;
};

const STATUS_LABELS = {
  pending: 'PENDIENTE',
  confirmed: 'CONFIRMADA',
  completed: 'COMPLETADA',
  cancelled: 'CANCELADA'
};

/**
 * Tablero operativo de citas del taller.
 * Lo comparten el panel de administrador (canCancel) y el panel del mecánico (sin cancelar).
 */
export function AppointmentsBoard({ canCancel = true, onPendingCountChange, reloadSignal = 0 }) {
  const [appointments, setAppointments] = useState([]);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [viewingNotesApt, setViewingNotesApt] = useState(null);
  const [cancellingAppointment, setCancellingAppointment] = useState(null);
  const [completingAppointment, setCompletingAppointment] = useState(null);
  const [novedadesDraft, setNovedadesDraft] = useState([]);
  const [sinNovedades, setSinNovedades] = useState(false);
  const [expandedChains, setExpandedChains] = useState(() => new Set());

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiRequest('/api/appointments')
      .then(data => { if (active) { setAppointments(data || []); setApiError(''); } })
      .catch(error => { if (active) setApiError(error.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reloadSignal]);

  const updateAppointmentStatus = async (id, newStatus, extra = {}) => {
    const { statusReason, paymentAmount, novedades, adminNotes } = extra;
    try {
      setApiError('');
      const updated = await apiRequest(`/api/appointments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: newStatus,
          ...(statusReason !== undefined ? { statusReason } : {}),
          ...(paymentAmount !== undefined ? { paymentAmount } : {}),
          ...(novedades !== undefined ? { novedades } : {}),
          ...(adminNotes !== undefined ? { adminNotes } : {})
        })
      });
      setAppointments(prev => {
        const next = prev.map(a => a.id === id ? updated : a);
        if (updated.isChain && (newStatus === 'completed' || newStatus === 'cancelled')) {
          const resolved = newStatus === 'completed';
          const affectedIds = new Set((updated.resolvesNovedades || []).map(String));
          return next.map(a => String(a.id) === String(updated.chainRoot)
            ? {
                ...a,
                novedades: (a.novedades || []).map(novedad => {
                  if (!affectedIds.has(String(novedad.id))) return novedad;
                  return resolved
                    ? {
                        ...novedad,
                        status: 'resolved',
                        resolvedAt: new Date().toISOString(),
                        resolvedByAppointment: updated.id
                      }
                    : {
                        ...novedad,
                        status: 'open',
                        resolvedAt: null,
                        resolvedByAppointment: null
                      };
                })
              }
            : a
          );
        }
        return next;
      });
      if (newStatus === 'cancelled') {
        setCancellingAppointment(null);
        window.dispatchEvent(new Event('appointments:updated'));
      }
      if (newStatus === 'completed') {
        setCompletingAppointment(null);
        window.dispatchEvent(new Event('appointments:updated'));
      }
    } catch (error) {
      setApiError(error.message);
    }
  };

  const openCompletionModal = (appointment) => {
    setCompletingAppointment(appointment);
    setNovedadesDraft((appointment.novedades || []).map(novedad => ({
      description: novedad.description || '',
      severity: novedad.severity || 'medium',
      estimatedCost: novedad.estimatedCost ?? 0
    })));
    setSinNovedades(Boolean(appointment.status === 'completed' && (appointment.novedades || []).length === 0));
  };

  const addNovedadDraft = () => setNovedadesDraft(current => [
    ...current,
    { description: '', severity: 'medium', estimatedCost: 0 }
  ]);

  const updateNovedadDraft = (index, key, value) => setNovedadesDraft(current =>
    current.map((novedad, i) => (i === index ? { ...novedad, [key]: value } : novedad))
  );

  const removeNovedadDraft = (index) => setNovedadesDraft(current =>
    current.filter((_, i) => i !== index)
  );

  const saveAppointmentNotes = async (id, notes) => {
    try {
      setApiError('');
      const updated = await apiRequest(`/api/appointments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ adminNotes: notes })
      });
      setAppointments(prev => prev.map(a => a.id === id ? updated : a));
      setViewingNotesApt(null);
    } catch (error) {
      setApiError(error.message);
    }
  };

  const matchesAppointmentFilters = (appointment) => {
    const matchesStatus = statusFilter === 'ALL' || appointment.status.toUpperCase() === statusFilter;
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = !term ||
      (appointment.user?.name || '').toLowerCase().includes(term) ||
      (appointment.motorcycleModel || '').toLowerCase().includes(term) ||
      (appointment.brand || '').toLowerCase().includes(term) ||
      (appointment.service || '').toLowerCase().includes(term) ||
      (appointment.chainReason || '').toLowerCase().includes(term) ||
      (appointment.novedades || []).some(novedad => (novedad.description || '').toLowerCase().includes(term));
    return matchesStatus && matchesSearch;
  };

  const childrenOfAppointment = (appointment) => appointments
    .filter(item => item.isChain && String(item.chainRoot) === String(appointment.id))
    .sort((a, b) => new Date(a.requestedDate) - new Date(b.requestedDate));

  const toggleChain = (id) => setExpandedChains(current => {
    const next = new Set(current);
    const key = String(id);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  });

  const isFiltering = statusFilter !== 'ALL' || searchTerm.trim().length > 0;

  const boardItems = [];
  appointments
    .filter(appointment => !appointment.isChain)
    .forEach(root => {
      const children = childrenOfAppointment(root);
      const rootMatches = matchesAppointmentFilters(root);
      const matchingChildren = children.filter(matchesAppointmentFilters);
      if (!rootMatches && !matchingChildren.length) return;

      const autoExpand = isFiltering && !rootMatches && matchingChildren.length > 0;
      const expanded = expandedChains.has(String(root.id)) || autoExpand;
      const visibleChildren = isFiltering
        ? rootMatches
          ? (expanded ? children : [])
          : matchingChildren
        : (expanded ? children : []);

      boardItems.push({
        root,
        childCount: !isFiltering || rootMatches ? children.length : 0,
        expanded,
        visibleChildren
      });
    });

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  useEffect(() => {
    if (onPendingCountChange) onPendingCountChange(pendingCount);
  }, [pendingCount, onPendingCountChange]);

  const completingIsChain = Boolean(completingAppointment?.isChain);
  const completingEditsNovedades = Boolean(
    completingAppointment && !completingIsChain && completingAppointment.status === 'confirmed'
  );
  const completingRoot = completingAppointment && completingIsChain
    ? appointments.find(item => String(item.id) === String(completingAppointment.chainRoot))
    : completingAppointment;
  const completingLinkedNovedades = !completingAppointment
    ? []
    : completingIsChain
      ? (completingRoot?.novedades || []).filter(novedad =>
          (completingAppointment.resolvesNovedades || []).some(id => String(id) === String(novedad.id))
        )
      : (completingAppointment.novedades || []);
  const canSubmitCompletion = !completingEditsNovedades ||
    sinNovedades ||
    novedadesDraft.some(novedad => novedad.description.trim());

  const hasActiveChain = (appointment) => !appointment.isChain && appointments.some(item =>
    item.isChain &&
    String(item.chainRoot) === String(appointment.id) &&
    (item.status === 'pending' || item.status === 'confirmed')
  );

  const renderNovedades = (appointment) => {
    if (appointment.isChain) {
      return (
        <div className="apt-novedad-list">
          <span className="apt-cell-muted">No aplica</span>
          {appointment.status === 'completed' && appointment.adminNotes && (
            <span className="apt-cell-note">{appointment.adminNotes}</span>
          )}
        </div>
      );
    }
    if (appointment.status !== 'completed') {
      return <span className="apt-cell-muted">—</span>;
    }
    const novedades = appointment.novedades || [];
    if (!novedades.length) {
      return <span className="apt-cell-muted">Sin novedades</span>;
    }
    return (
      <div className="admin-novedad-list">
        {novedades.slice(0, 3).map(novedad => (
          <div className="admin-novedad-line" key={novedad.id}>
            <span className={`admin-novedad-dot ${novedad.status}`} />
            <span>{novedad.description}</span>
          </div>
        ))}
        {novedades.length > 3 && (
          <span className="admin-novedad-more">+{novedades.length - 3} más</span>
        )}
      </div>
    );
  };

  const renderMainRow = (apt, { isChild = false, childCount = 0, expanded = false } = {}) => (
    <div className="apt-main-row">
      <div className="apt-cell apt-cell-date">
        {isChild && <span className="apt-sub-tag">CORRECCIÓN DE NOVEDAD</span>}
        <h4 className="apt-date">{apt.requestedDate}</h4>
        <p className="apt-id">ID: {apt.id}</p>
        {!isChild && childCount > 0 && (
          <button
            type="button"
            className="apt-chain-toggle"
            aria-expanded={expanded}
            onClick={() => toggleChain(apt.id)}
            title={expanded ? 'Ocultar correcciones de la cadena' : 'Mostrar correcciones de la cadena'}
          >
            <span aria-hidden="true">{expanded ? '▾' : '▸'}</span> {childCount} corrección(es)
          </button>
        )}
      </div>

      <div className="apt-cell">
        <h4>{apt.user?.name || 'Cliente sin nombre'}</h4>
        <p>TEL: {apt.user?.phone || 'Sin tel'}</p>
        {apt.user?.email && <p>{apt.user.email}</p>}
      </div>

      <div className="apt-cell">
        <h4 className="apt-brand">{apt.brand}</h4>
        <p>{apt.motorcycleModel}</p>
      </div>

      <div className="apt-cell">
        <h4>{apt.isChain ? (apt.chainReason || apt.service) : apt.service}</h4>
      </div>

      <div className="apt-cell">
        {renderNovedades(apt)}
      </div>

      <div className="apt-cell apt-cell-status">
        <span className={`badge-status ${apt.status.toLowerCase()}`}>
          {STATUS_LABELS[apt.status] || apt.status.toUpperCase()}
        </span>
        {apt.status === 'completed' && apt.completedByName && (
          <span className="apt-audit" title="Quién completó la cita">POR: {apt.completedByName}</span>
        )}
      </div>

      <div className="apt-cell apt-cell-actions">
        {apt.status === 'pending' && (
          <button
            className="btn-action-icon success"
            onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
            title="Confirmar turno"
          >
            <IconCheck size={12} /> CONFIRMAR
          </button>
        )}
        {(apt.status === 'confirmed' || (apt.status === 'completed' && !apt.payment)) && (
          <button
            className="btn-action-icon success"
            onClick={() => openCompletionModal(apt)}
            title={apt.status === 'completed' ? 'Definir monto final' : 'Marcar como entregada'}
          >
            <IconCheck size={12} /> {apt.status === 'completed' ? 'DEFINIR MONTO' : 'COMPLETAR'}
          </button>
        )}
        {canCancel && apt.status !== 'cancelled' && apt.status !== 'completed' && (
          <button
            className="btn-action-icon danger"
            onClick={() => setCancellingAppointment(apt)}
            disabled={hasActiveChain(apt)}
            style={hasActiveChain(apt) ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
            title={hasActiveChain(apt) ? 'Cancela primero las correcciones pendientes o confirmadas' : 'Cancelar cita'}
          >
            CANCELAR
          </button>
        )}
        <button
          className="btn-action-icon"
          onClick={() => setViewingNotesApt(apt)}
          title="Ver / Editar notas internas"
        >
          NOTAS
        </button>
      </div>
    </div>
  );

  return (
    <section>
      <div className="admin-header-row">
        <div>
          <h1 className="admin-view-title">AGENDA OPERATIVA DE CITAS</h1>
          <p className="admin-view-sub">Revisión de solicitudes, confirmación de turnos y control de entregas.</p>
        </div>
        {loading && <span className="admin-refreshing" role="status">ACTUALIZANDO…</span>}
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card highlight">
          <div className="admin-stat-label">SOLICITUDES PENDIENTES</div>
          <div className="admin-stat-value" style={{ color: T.orange }}>{pendingCount}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">CONFIRMADAS / EN PADDOCK</div>
          <div className="admin-stat-value">{confirmedCount}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">SERVICIOS COMPLETADOS</div>
          <div className="admin-stat-value">{completedCount}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">TOTAL REGISTROS</div>
          <div className="admin-stat-value">{appointments.length}</div>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <input
            className="admin-search-input"
            placeholder="Buscar por cliente, moto, motivo o novedad..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-filter-group">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => (
            <button
              key={status}
              className={`admin-filter-btn${statusFilter === status ? ' active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'ALL' ? 'TODAS' : status}
            </button>
          ))}
        </div>
      </div>

      {apiError && <div role="alert" className="admin-inline-error">{apiError}</div>}

      {boardItems.length === 0 ? (
        <p className="admin-empty-state">NO SE ENCONTRARON CITAS BAJO ESTE CRITERIO.</p>
      ) : (
        <div className="admin-card-list">
          {boardItems.map(({ root, childCount, expanded, visibleChildren }) => (
            <article className={`apt-card${childCount > 0 ? ' has-chain' : ''}`} key={root.id}>
              {renderMainRow(root, { childCount, expanded })}
              {expanded && visibleChildren.length > 0 && (
                <div className="apt-sub-container">
                  {visibleChildren.map(child => (
                    <div className="apt-sub-item" key={child.id}>
                      {renderMainRow(child, { isChild: true })}
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* MODAL: NOTAS DE CITA */}
      {viewingNotesApt && (
        <div className="admin-modal-overlay" onClick={() => setViewingNotesApt(null)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setViewingNotesApt(null)}><IconX /></button>
            <div className="admin-form-label">NOTAS DE SERVICIO · CITA {viewingNotesApt.id}</div>
            <h2 className="admin-view-title" style={{ fontSize: '1.1rem', margin: '0.4rem 0 1rem' }}>
              {viewingNotesApt.user?.name} · {viewingNotesApt.brand} {viewingNotesApt.motorcycleModel}
            </h2>
            <div className="admin-form-group">
              <label className="admin-form-label">INSTRUCCIONES TÉCNICAS O NOTAS DEL CLIENTE</label>
              <textarea
                className="admin-form-textarea"
                defaultValue={viewingNotesApt.adminNotes || ''}
                id="notes-field"
                rows={4}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button className="btn-outline" onClick={() => setViewingNotesApt(null)}>CERRAR</button>
              <button
                className="btn-orange"
                onClick={() => {
                  const val = document.getElementById('notes-field').value;
                  saveAppointmentNotes(viewingNotesApt.id, val);
                }}
              >
                GUARDAR NOTAS
              </button>
            </div>
          </div>
        </div>
      )}

      {canCancel && cancellingAppointment && (
        <div className="admin-modal-overlay" onClick={() => setCancellingAppointment(null)}>
          <div className="admin-modal-card" onClick={event => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setCancellingAppointment(null)}><IconX /></button>
            <div className="admin-form-label">CANCELAR CITA</div>
            <h2 className="admin-view-title" style={{ fontSize: '1.1rem', margin: '0.4rem 0 1rem' }}>
              {cancellingAppointment.brand} · {cancellingAppointment.motorcycleModel}
            </h2>
            {apiError && (
              <p role="alert" className="admin-inline-error">{apiError}</p>
            )}
            <form onSubmit={event => {
              event.preventDefault();
              const reason = new FormData(event.currentTarget).get('statusReason').trim();
              updateAppointmentStatus(cancellingAppointment.id, 'cancelled', { statusReason: reason });
            }}>
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="appointment-cancel-reason">MOTIVO QUE SE ENVIARÁ AL CLIENTE</label>
                <textarea
                  className="admin-form-textarea"
                  id="appointment-cancel-reason"
                  name="statusReason"
                  maxLength={500}
                  rows={4}
                  required
                  placeholder="Indica brevemente por qué se cancela la cita."
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn-outline" onClick={() => setCancellingAppointment(null)}>VOLVER</button>
                <button type="submit" className="btn-orange">CANCELAR Y NOTIFICAR</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {completingAppointment && (
        <div className="admin-modal-overlay" onClick={() => setCompletingAppointment(null)}>
          <div className="admin-modal-card" onClick={event => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setCompletingAppointment(null)}><IconX /></button>
            <div className="admin-form-label">
              {completingAppointment.status === 'completed'
                ? 'DEFINIR MONTO FINAL'
                : completingIsChain ? 'COMPLETAR CORRECCIÓN' : 'COMPLETAR CITA'}
            </div>
            <h2 className="admin-view-title" style={{ fontSize: '1.1rem', margin: '0.4rem 0 1rem' }}>
              {completingAppointment.brand} · {completingAppointment.motorcycleModel}
            </h2>
            <p className="admin-view-sub" style={{ marginBottom: '1rem' }}>
              {completingAppointment.status === 'completed'
                ? 'Define el monto final para habilitar el pago de esta cita.'
                : completingIsChain
                  ? 'Confirma el monto de la corrección. Las novedades vinculadas se marcarán como resueltas.'
                  : 'Registra las novedades encontradas y define el monto final del servicio.'}
            </p>

            {completingEditsNovedades ? (
              <div className="admin-form-group">
                <div className="admin-novedad-head">
                  <label className="admin-form-label">NOVEDADES ENCONTRADAS</label>
                  <label className="admin-check-inline">
                    <input
                      type="checkbox"
                      checked={sinNovedades}
                      onChange={event => {
                        setSinNovedades(event.target.checked);
                        if (event.target.checked) setNovedadesDraft([]);
                      }}
                    />
                    SIN NOVEDADES
                  </label>
                </div>
                {sinNovedades ? (
                  <p className="admin-view-sub">Se registrará la cita sin novedades.</p>
                ) : (
                  <>
                    {novedadesDraft.map((novedad, index) => (
                      <div className="admin-novedad-row" key={index}>
                        <input
                          className="admin-form-input"
                          placeholder="Descripción de la falla"
                          maxLength={300}
                          value={novedad.description}
                          onChange={event => updateNovedadDraft(index, 'description', event.target.value)}
                        />
                        <select
                          className="admin-form-input"
                          value={novedad.severity}
                          onChange={event => updateNovedadDraft(index, 'severity', event.target.value)}
                        >
                          <option value="low">BAJA</option>
                          <option value="medium">MEDIA</option>
                          <option value="high">ALTA</option>
                        </select>
                        <input
                          className="admin-form-input"
                          type="number"
                          min="0"
                          step="1000"
                          placeholder="Costo estimado"
                          value={novedad.estimatedCost}
                          onChange={event => updateNovedadDraft(index, 'estimatedCost', event.target.value)}
                        />
                        <button
                          type="button"
                          className="btn-action-icon danger"
                          onClick={() => removeNovedadDraft(index)}
                          title="Quitar novedad"
                        >
                          QUITAR
                        </button>
                      </div>
                    ))}
                    <button type="button" className="btn-outline" onClick={addNovedadDraft} style={{ marginTop: '0.5rem' }}>
                      + AGREGAR NOVEDAD
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="admin-form-group">
                <label className="admin-form-label">
                  {completingIsChain ? 'NOVEDADES QUE RESUELVE' : 'NOVEDADES REGISTRADAS'}
                </label>
                {completingLinkedNovedades.length ? (
                  <ul className="admin-novedad-readonly">
                    {completingLinkedNovedades.map(novedad => (
                      <li key={novedad.id}>
                        <span className={`admin-novedad-dot ${novedad.status}`} />
                        {novedad.description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="admin-view-sub">
                    {completingIsChain ? 'Esta cita no tiene novedades vinculadas.' : 'Sin novedades registradas.'}
                  </p>
                )}
              </div>
            )}

            <form onSubmit={event => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const amount = Number(formData.get('paymentAmount'));
              const adminNotes = completingIsChain && completingAppointment.status !== 'completed'
                ? String(formData.get('adminNotes') || '').trim()
                : undefined;
              const novedades = completingEditsNovedades
                ? (sinNovedades ? [] : novedadesDraft
                    .map(novedad => ({
                      description: novedad.description.trim(),
                      severity: novedad.severity,
                      estimatedCost: Number(novedad.estimatedCost) || 0
                    }))
                    .filter(novedad => novedad.description))
                : undefined;
              updateAppointmentStatus(completingAppointment.id, 'completed', { paymentAmount: amount, novedades, adminNotes });
            }}>
              {completingIsChain && completingAppointment.status !== 'completed' && (
                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="appointment-resolution-notes">TRABAJO REALIZADO (OPCIONAL)</label>
                  <textarea
                    className="admin-form-textarea"
                    id="appointment-resolution-notes"
                    name="adminNotes"
                    rows={3}
                    maxLength={500}
                    defaultValue={completingAppointment.adminNotes || ''}
                    placeholder="Describe brevemente lo que se hizo."
                  />
                </div>
              )}
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="appointment-payment-amount">MONTO FINAL (COP)</label>
                <input
                  className="admin-form-input"
                  id="appointment-payment-amount"
                  name="paymentAmount"
                  type="number"
                  min="1"
                  step="1"
                  required
                  defaultValue={completingAppointment.payment?.amount || ''}
                  placeholder="Ej. 250000"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn-outline" onClick={() => setCompletingAppointment(null)}>VOLVER</button>
                <button type="submit" className="btn-orange" disabled={!canSubmitCompletion}>
                  {completingAppointment.status === 'completed' ? 'GUARDAR MONTO' : 'COMPLETAR Y NOTIFICAR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
