import { useState, useEffect } from 'react';
import {
  IconCalendar,
  IconWrench,
  IconTag,
  IconUsers,
  IconEdit,
  IconPlus,
  IconX,
  IconShield,
  IconCurrencyDollar,
  IconGallery,
  IconRefresh
} from './Icons';
import { T } from '../styles/tokens';
import { GalleryImageModal } from './Gallery';
import { AppointmentsBoard } from './AppointmentsBoard';

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

const createBrandSlug = (name) => name
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const ROLE_OPTIONS = [
  { value: 'client', label: 'CLIENTE' },
  { value: 'mechanic', label: 'MECÁNICO' },
  { value: 'admin', label: 'ADMINISTRADOR' }
];

export function AdminPanel({
  onBack,
  loggedInUser,
  galleryImages = [],
  galleryLoading = false,
  galleryError = '',
  onAddGalleryImage,
  onRefreshGallery
}) {
  const [activeTab, setActiveTab] = useState('citas');

  // Estados de datos
  const [services, setServices] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brandRequests, setBrandRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState(0);
  const [apiError, setApiError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Filtros y búsqueda (usuarios y pagos)
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para modales de edición / creación
  const [editingService, setEditingService] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [editingBrandRequest, setEditingBrandRequest] = useState(null);
  const [addingGalleryImage, setAddingGalleryImage] = useState(false);

  const loadAdminData = async () => {
    try {
      const [serviceData, brandData, brandRequestData, userData, paymentData] = await Promise.all([
        apiRequest('/api/services?active=false'),
        apiRequest('/api/brands?active=false'),
        apiRequest('/api/brands/requests'),
        apiRequest('/api/users'),
        apiRequest('/api/payments')
      ]);
      setServices(serviceData || []);
      setBrands(brandData || []);
      setBrandRequests(brandRequestData || []);
      setUsers(userData || []);
      setPayments(paymentData || []);
      setApiError('');
    } catch (error) {
      setApiError(error.message);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Recarga todo el contenido del panel sin recargar la página.
  const handleRefresh = () => {
    setRefreshing(true);
    loadAdminData();
    setRefreshKey(key => key + 1);
    if (onRefreshGallery) onRefreshGallery();
    window.setTimeout(() => setRefreshing(false), 600);
  };

  // Controladores de Servicios
  const toggleServiceActive = async (id) => {
    const service = services.find(item => item.id === id);
    if (!service) return;
    try {
      const updated = await apiRequest(`/api/services/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !service.isActive })
      });
      setServices(prev => prev.map(item => item.id === id ? updated : item));
    } catch (error) {
      setApiError(error.message);
    }
  };

  const saveService = async (serviceData) => {
    try {
      const saved = await apiRequest(serviceData.id ? `/api/services/${serviceData.id}` : '/api/services', {
        method: serviceData.id ? 'PATCH' : 'POST',
        body: JSON.stringify(serviceData)
      });
      setServices(prev => serviceData.id
        ? prev.map(item => item.id === serviceData.id ? saved : item)
        : [saved, ...prev]);
      setEditingService(null);
    } catch (error) {
      setApiError(error.message);
    }
  };

  // Controladores de Marcas
  const toggleBrandActive = async (id) => {
    const brand = brands.find(item => item.id === id);
    if (!brand) return;
    try {
      const updated = await apiRequest(`/api/brands/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !brand.isActive })
      });
      setBrands(prev => prev.map(item => item.id === id ? updated : item));
    } catch (error) {
      setApiError(error.message);
    }
  };

  const saveBrand = async (brandData) => {
    try {
      const saved = await apiRequest(brandData.id ? `/api/brands/${brandData.id}` : '/api/brands', {
        method: brandData.id ? 'PATCH' : 'POST',
        body: JSON.stringify(brandData)
      });
      setBrands(prev => brandData.id
        ? prev.map(item => item.id === brandData.id ? saved : item)
        : [saved, ...prev]);
      setEditingBrand(null);
    } catch (error) {
      setApiError(error.message);
    }
  };

  const reviewBrandRequest = async (request, reviewData) => {
    setApiError('');
    try {
      const saved = await apiRequest(`/api/brands/requests/${request.id}`, {
        method: 'PATCH',
        body: JSON.stringify(reviewData)
      });
      setBrandRequests(prev => prev.map(item => item.id === saved.id ? saved : item));
      if (saved.brand) {
        setBrands(prev => [saved.brand, ...prev.filter(item => item.id !== saved.brand.id)]);
      }
      setEditingBrandRequest(null);
    } catch (error) {
      setApiError(error.message);
    }
  };

  // Controladores de Usuarios
  const setUserRole = async (id, role) => {
    try {
      const updated = await apiRequest(`/api/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ role })
      });
      setUsers(prev => prev.map(item => item.id === id ? updated : item));
    } catch (error) {
      setApiError(error.message);
    }
  };

  const toggleUserActive = async (id) => {
    const user = users.find(item => item.id === id);
    if (!user) return;
    try {
      const updated = await apiRequest(`/api/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !user.isActive })
      });
      setUsers(prev => prev.map(item => item.id === id ? updated : item));
    } catch (error) {
      setApiError(error.message);
    }
  };

  const term = searchTerm.trim().toLowerCase();
  const filteredUsers = users.filter(u =>
    (u.name || '').toLowerCase().includes(term) ||
    (u.email || '').toLowerCase().includes(term)
  );
  const filteredPayments = payments.filter(payment =>
    (payment.userName || '').toLowerCase().includes(term) ||
    (payment.userEmail || '').toLowerCase().includes(term)
  );

  const roleBadgeClass = (role) => role === 'admin' ? 'confirmed' : role === 'mechanic' ? 'active' : 'pending';

  return (
    <div className="admin-root">
      {/* BARRA SUPERIOR STICKY */}
      <header className="admin-topbar">
        <div className="admin-brand">
          <span className="admin-logo">MOTO.<span>TALLER</span></span>
          <span className="admin-badge">CONTROL PANEL</span>
        </div>

        <div className="admin-topbar-actions">
          <div className="admin-user-info">
            <IconShield size={14} style={{ verticalAlign: 'middle', marginRight: '4px', color: T.orange }} />
            <strong>{loggedInUser?.name || 'ADMIN'}</strong>
          </div>
          <button
            type="button"
            className={`admin-icon-btn${refreshing ? ' spinning' : ''}`}
            onClick={handleRefresh}
            aria-label="Actualizar contenido"
            title="Actualizar contenido"
          >
            <IconRefresh size={16} />
          </button>
          <button className="btn-outline" onClick={onBack} style={{ fontSize: '0.7rem', padding: '0.45rem 0.85rem' }}>
            ← VOLVER AL SITIO
          </button>
        </div>
      </header>

      {apiError && (
        <div role="alert" className="admin-inline-error admin-inline-error--top">
          {apiError}
        </div>
      )}

      {/* PESTAÑAS DE NAVEGACIÓN (solo iconos) */}
      <nav className="admin-tabs-nav" aria-label="Navegación del panel de administración">
        <button
          type="button"
          className={`admin-tab-btn${activeTab === 'citas' ? ' active' : ''}`}
          onClick={() => { setActiveTab('citas'); setSearchTerm(''); }}
          aria-label="Citas del taller"
          title="Citas del taller"
        >
          <IconCalendar size={20} />
          {pendingAppointments > 0 && <span className="admin-tab-badge">{pendingAppointments}</span>}
        </button>

        <button
          type="button"
          className={`admin-tab-btn${activeTab === 'servicios' ? ' active' : ''}`}
          onClick={() => { setActiveTab('servicios'); setSearchTerm(''); }}
          aria-label="Servicios"
          title="Servicios"
        >
          <IconWrench size={20} />
          <span className="admin-tab-badge">{services.length}</span>
        </button>

        <button
          type="button"
          className={`admin-tab-btn${activeTab === 'marcas' ? ' active' : ''}`}
          onClick={() => { setActiveTab('marcas'); setSearchTerm(''); }}
          aria-label="Marcas"
          title="Marcas"
        >
          <IconTag size={20} />
          <span className="admin-tab-badge">{brands.length}</span>
        </button>

        <button
          type="button"
          className={`admin-tab-btn${activeTab === 'usuarios' ? ' active' : ''}`}
          onClick={() => { setActiveTab('usuarios'); setSearchTerm(''); }}
          aria-label="Usuarios y clientes"
          title="Usuarios y clientes"
        >
          <IconUsers size={20} />
          <span className="admin-tab-badge">{users.length}</span>
        </button>

        <button
          type="button"
          className={`admin-tab-btn${activeTab === 'pagos' ? ' active' : ''}`}
          onClick={() => { setActiveTab('pagos'); setSearchTerm(''); }}
          aria-label="Historial de pagos"
          title="Historial de pagos"
        >
          <IconCurrencyDollar size={20} />
          <span className="admin-tab-badge">{payments.length}</span>
        </button>

        <button
          type="button"
          className={`admin-tab-btn${activeTab === 'galeria' ? ' active' : ''}`}
          onClick={() => { setActiveTab('galeria'); setSearchTerm(''); }}
          aria-label="Galería"
          title="Galería"
        >
          <IconGallery size={20} />
          <span className="admin-tab-badge">{galleryImages.length}</span>
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="admin-container">

        {/* TAB 1: CITAS DE TALLER (componente compartido con el panel del mecánico) */}
        {activeTab === 'citas' && (
          <AppointmentsBoard canCancel onPendingCountChange={setPendingAppointments} reloadSignal={refreshKey} />
        )}

        {/* TAB 2: SERVICIOS */}
        {activeTab === 'servicios' && (
          <section>
            <div className="admin-header-row">
              <div>
                <h1 className="admin-view-title">CATÁLOGO DE SERVICIOS TÉCNICOS</h1>
                <p className="admin-view-sub">Gestión de portafolio, horas hombre estimadas y tarifas del taller.</p>
              </div>
              <button
                className="btn-orange"
                onClick={() => setEditingService({ name: '', description: '', estimatedHours: 2, priceRange_min: 100000, priceRange_max: 200000 })}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}
              >
                <IconPlus size={14} /> NUEVO SERVICIO
              </button>
            </div>

            <div className="admin-card-list">
              {services.map(srv => (
                <article className="admin-record-card" key={srv.id}>
                  <div className="admin-record-head">
                    <h3 className="admin-record-title">{srv.name}</h3>
                    <span className={`badge-status ${srv.isActive ? 'active' : 'inactive'}`}>
                      {srv.isActive ? 'ACTIVO' : 'PAUSADO'}
                    </span>
                  </div>
                  <p className="admin-record-desc">{srv.description}</p>
                  <div className="admin-record-meta">
                    <span>DURACIÓN <strong>{srv.estimatedHours} HORAS</strong></span>
                    <span>TARIFA <strong>${srv.priceRange_min?.toLocaleString()} – ${srv.priceRange_max?.toLocaleString()} COP</strong></span>
                  </div>
                  <div className="admin-record-actions">
                    <button className="btn-action-icon" onClick={() => setEditingService(srv)}>
                      <IconEdit size={12} /> EDITAR
                    </button>
                    <button
                      className={`btn-action-icon ${srv.isActive ? 'danger' : 'success'}`}
                      onClick={() => toggleServiceActive(srv.id)}
                    >
                      {srv.isActive ? 'PAUSAR' : 'ACTIVAR'}
                    </button>
                  </div>
                </article>
              ))}
              {!services.length && <p className="admin-empty-state">NO HAY SERVICIOS REGISTRADOS.</p>}
            </div>
          </section>
        )}

        {/* TAB 3: MARCAS */}
        {activeTab === 'marcas' && (
          <section>
            <div className="admin-header-row">
              <div>
                <h1 className="admin-view-title">MARCAS AUTORIZADAS</h1>
                <p className="admin-view-sub">Fabricantes autorizados y solicitudes enviadas por clientes.</p>
              </div>
              <button
                className="btn-orange"
                onClick={() => setEditingBrand({ name: '', slug: '', logoUrl: '' })}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}
              >
                <IconPlus size={14} /> NUEVA MARCA
              </button>
            </div>

            <h2 className="admin-section-sub">SOLICITUDES DE CLIENTES</h2>
            <div className="admin-card-list" style={{ marginBottom: '2rem' }}>
              {brandRequests.map(request => (
                <article className="admin-record-card" key={request.id}>
                  <div className="admin-record-head">
                    <h3 className="admin-record-title">{request.name}</h3>
                    <span className={`badge-status ${request.status === 'pending' ? 'pending' : request.status === 'approved' ? 'active' : 'inactive'}`}>
                      {request.status === 'pending' ? 'EN REVISIÓN' : request.status === 'approved' ? 'APROBADA' : 'RECHAZADA'}
                    </span>
                  </div>
                  <div className="admin-record-meta">
                    <span>CLIENTE <strong>{request.user?.name || request.user?.email || 'CLIENTE'}</strong></span>
                    <span>FECHA <strong>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : '—'}</strong></span>
                  </div>
                  {request.status === 'pending' && (
                    <div className="admin-record-actions">
                      <button
                        className="btn-action-icon"
                        onClick={() => {
                          setApiError('');
                          setEditingBrandRequest({
                            ...request,
                            slug: createBrandSlug(request.name),
                            logoUrl: ''
                          });
                        }}
                      >
                        <IconEdit size={12} /> REVISAR
                      </button>
                    </div>
                  )}
                </article>
              ))}
              {!brandRequests.length && <p className="admin-empty-state">No hay solicitudes de marca.</p>}
            </div>

            <h2 className="admin-section-sub">MARCAS EN CATÁLOGO</h2>
            <div className="admin-card-list">
              {brands.map(b => (
                <article className="admin-record-card" key={b.id}>
                  <div className="admin-record-head">
                    <h3 className="admin-record-title admin-record-title--brand">{b.name}</h3>
                    <span className={`badge-status ${b.isActive ? 'active' : 'inactive'}`}>
                      {b.isActive ? 'DISPONIBLE' : 'DESACTIVADA'}
                    </span>
                  </div>
                  <div className="admin-record-meta">
                    <span>SLUG <strong>{b.slug}</strong></span>
                  </div>
                  <div className="admin-record-actions">
                    <button className="btn-action-icon" onClick={() => setEditingBrand(b)}>
                      <IconEdit size={12} /> EDITAR
                    </button>
                    <button
                      className={`btn-action-icon ${b.isActive ? 'danger' : 'success'}`}
                      onClick={() => toggleBrandActive(b.id)}
                    >
                      {b.isActive ? 'DESACTIVAR' : 'ACTIVAR'}
                    </button>
                  </div>
                </article>
              ))}
              {!brands.length && <p className="admin-empty-state">NO HAY MARCAS REGISTRADAS.</p>}
            </div>
          </section>
        )}

        {/* TAB 4: USUARIOS Y CLIENTES */}
        {activeTab === 'usuarios' && (
          <section>
            <div className="admin-header-row">
              <div>
                <h1 className="admin-view-title">DIRECTORIO DE CLIENTES Y USUARIOS</h1>
                <p className="admin-view-sub">Control de roles (cliente, mecánico, administrador), cuentas activas y contacto.</p>
              </div>
            </div>

            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <input
                  className="admin-search-input"
                  placeholder="Buscar usuario por nombre o correo..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-card-list">
              {filteredUsers.map(u => (
                <article className="admin-record-card" key={u.id}>
                  <div className="admin-record-head">
                    <h3 className="admin-record-title">{u.name}</h3>
                    <span className={`badge-status ${u.isActive ? 'active' : 'inactive'}`}>
                      {u.isActive ? 'ACTIVA' : 'BLOQUEADA'}
                    </span>
                  </div>
                  <div className="admin-record-meta">
                    <span>CORREO <strong>{u.email}</strong></span>
                    <span>TELÉFONO <strong>{u.phone || 'NO REGISTRADO'}</strong></span>
                    <span>ROL <strong className={`admin-role-tag ${roleBadgeClass(u.role)}`}>{ROLE_OPTIONS.find(r => r.value === u.role)?.label || u.role.toUpperCase()}</strong></span>
                  </div>
                  <div className="admin-record-actions">
                    <label className="admin-role-field">
                      <span className="admin-form-label">ASIGNAR ROL</span>
                      <select
                        className="admin-form-input admin-role-select"
                        value={u.role}
                        onChange={e => setUserRole(u.id, e.target.value)}
                      >
                        {ROLE_OPTIONS.map(role => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                    </label>
                    <button
                      className={`btn-action-icon ${u.isActive ? 'danger' : 'success'}`}
                      onClick={() => toggleUserActive(u.id)}
                    >
                      {u.isActive ? 'BLOQUEAR' : 'DESBLOQUEAR'}
                    </button>
                  </div>
                </article>
              ))}
              {!filteredUsers.length && (
                <p className="admin-empty-state">NO HAY USUARIOS QUE COINCIDAN CON LA BÚSQUEDA.</p>
              )}
            </div>
          </section>
        )}

        {/* TAB 5: HISTORIAL DE PAGOS */}
        {activeTab === 'pagos' && (
          <section>
            <div className="admin-header-row">
              <div>
                <h1 className="admin-view-title">HISTORIAL DE PAGOS</h1>
                <p className="admin-view-sub">Consulta los pagos registrados con los datos básicos del cliente.</p>
              </div>
            </div>

            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <input
                  className="admin-search-input"
                  placeholder="Buscar por nombre o correo..."
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                />
              </div>
            </div>

            <div className="admin-card-list">
              {filteredPayments.map(payment => (
                <article className="admin-record-card" key={payment.id}>
                  <div className="admin-record-head">
                    <h3 className="admin-record-title">{payment.userName}</h3>
                    <span className="admin-record-amount">
                      ${Number(payment.amount).toLocaleString('es-CO')} COP
                    </span>
                  </div>
                  <div className="admin-record-meta">
                    <span>CORREO <strong>{payment.userEmail}</strong></span>
                    <span>FECHA <strong>{payment.date ? new Date(payment.date).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }) : 'NO DISPONIBLE'}</strong></span>
                  </div>
                </article>
              ))}
              {!payments.length && <p className="admin-empty-state">AÚN NO HAY PAGOS REGISTRADOS.</p>}
              {!!payments.length && !filteredPayments.length && (
                <p className="admin-empty-state">NO HAY PAGOS QUE COINCIDAN CON LA BÚSQUEDA.</p>
              )}
            </div>
          </section>
        )}

        {/* TAB 6: GALERÍA */}
        {activeTab === 'galeria' && (
          <section>
            <div className="admin-header-row">
              <div>
                <h1 className="admin-view-title">GALERÍA DEL TALLER</h1>
                <p className="admin-view-sub">Gestiona las imágenes visibles en la página.</p>
              </div>
              <button className="btn-orange" type="button" onClick={() => setAddingGalleryImage(true)}>
                AGREGAR IMAGEN
              </button>
            </div>

            {galleryError ? (
              <p role="alert" className="gallery-status-error">{galleryError}</p>
            ) : galleryLoading ? (
              <p className="admin-empty-state">CARGANDO IMÁGENES…</p>
            ) : galleryImages.length === 0 ? (
              <p className="admin-empty-state">AÚN NO HAY IMÁGENES. USA “AGREGAR IMAGEN” PARA CREAR LA PRIMERA.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                {galleryImages.map(image => (
                  <article key={image.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}` }}>
                    <img
                      src={image.src}
                      alt={image.label}
                      loading="lazy"
                      style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block' }}
                    />
                    <p style={{ margin: 0, padding: '0.75rem', color: T.text, fontSize: '0.8rem' }}>{image.label}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {addingGalleryImage && (
        <GalleryImageModal
          onClose={() => setAddingGalleryImage(false)}
          onSave={onAddGalleryImage}
        />
      )}

      {/* MODAL: CREAR / EDITAR SERVICIO */}
      {editingService && (
        <div className="admin-modal-overlay" onClick={() => setEditingService(null)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditingService(null)}><IconX /></button>
            <div className="admin-form-label">{editingService.id ? 'MODIFICAR SERVICIO' : 'CREAR NUEVO SERVICIO'}</div>
            <h2 className="admin-view-title" style={{ fontSize: '1.1rem', margin: '0.4rem 0 1rem' }}>
              {editingService.name || 'NUEVA ENTRADA'}
            </h2>
            <form onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.target);
              saveService({
                ...editingService,
                name: fd.get('name'),
                description: fd.get('description'),
                estimatedHours: Number(fd.get('estimatedHours')),
                priceRange_min: Number(fd.get('priceRange_min')),
                priceRange_max: Number(fd.get('priceRange_max'))
              });
            }}>
              <div className="admin-form-group">
                <label className="admin-form-label">NOMBRE DEL SERVICIO</label>
                <input className="admin-form-input" name="name" defaultValue={editingService.name} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">DESCRIPCIÓN</label>
                <textarea className="admin-form-textarea" name="description" defaultValue={editingService.description} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">HORAS ESTIMADAS DE TRABAJO</label>
                <input className="admin-form-input" type="number" name="estimatedHours" defaultValue={editingService.estimatedHours} min="1" max="48" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">PRECIO MÍNIMO (COP)</label>
                  <input className="admin-form-input" type="number" name="priceRange_min" defaultValue={editingService.priceRange_min} required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">PRECIO MÁXIMO (COP)</label>
                  <input className="admin-form-input" type="number" name="priceRange_max" defaultValue={editingService.priceRange_max} required />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn-outline" onClick={() => setEditingService(null)}>CANCELAR</button>
                <button type="submit" className="btn-orange">GUARDAR SERVICIO</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREAR / EDITAR MARCA */}
      {editingBrand && (
        <div className="admin-modal-overlay" onClick={() => setEditingBrand(null)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditingBrand(null)}><IconX /></button>
            <div className="admin-form-label">{editingBrand.id ? 'EDITAR MARCA' : 'NUEVA MARCA AUTORIZADA'}</div>
            <h2 className="admin-view-title" style={{ fontSize: '1.1rem', margin: '0.4rem 0 1rem' }}>
              {editingBrand.name || 'NUEVA MARCA'}
            </h2>
            <form onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.target);
              saveBrand({
                ...editingBrand,
                name: fd.get('name').toUpperCase(),
                slug: fd.get('slug').toLowerCase(),
                logoUrl: fd.get('logoUrl') || ''
              });
            }}>
              <div className="admin-form-group">
                <label className="admin-form-label">NOMBRE DE LA MARCA</label>
                <input className="admin-form-input" name="name" defaultValue={editingBrand.name} placeholder="EJ: APRILIA" required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">SLUG (IDENTIFICADOR URL)</label>
                <input className="admin-form-input" name="slug" defaultValue={editingBrand.slug} placeholder="EJ: aprilia" required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">URL DE LOGOTIPO (OPCIONAL)</label>
                <input className="admin-form-input" name="logoUrl" defaultValue={editingBrand.logoUrl} placeholder="https://..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn-outline" onClick={() => setEditingBrand(null)}>CANCELAR</button>
                <button type="submit" className="btn-orange">GUARDAR MARCA</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingBrandRequest && (
        <div className="admin-modal-overlay" onClick={() => setEditingBrandRequest(null)}>
          <div className="admin-modal-card" onClick={event => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setEditingBrandRequest(null)}><IconX /></button>
            <div className="admin-form-label">SOLICITUD DE MARCA</div>
            <h2 className="admin-view-title" style={{ fontSize: '1.1rem', margin: '0.4rem 0 1rem' }}>
              COMPLETAR DATOS Y APROBAR
            </h2>
            <form onSubmit={event => {
              event.preventDefault();
              const fd = new FormData(event.target);
              reviewBrandRequest(editingBrandRequest, {
                status: 'approved',
                name: fd.get('name').trim(),
                slug: fd.get('slug').trim(),
                logoUrl: fd.get('logoUrl').trim()
              });
            }}>
              {apiError && <p className="login-error" role="alert">{apiError}</p>}
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="request-brand-name">NOMBRE DE LA MARCA</label>
                <input id="request-brand-name" className="admin-form-input" name="name" defaultValue={editingBrandRequest.name} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="request-brand-slug">SLUG (IDENTIFICADOR)</label>
                <input id="request-brand-slug" className="admin-form-input" name="slug" defaultValue={editingBrandRequest.slug} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="request-brand-logo">URL DEL LOGOTIPO (OPCIONAL)</label>
                <input id="request-brand-logo" className="admin-form-input" name="logoUrl" defaultValue={editingBrandRequest.logoUrl} placeholder="https://..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn-action-icon danger"
                  onClick={() => reviewBrandRequest(editingBrandRequest, { status: 'rejected' })}
                >
                  RECHAZAR
                </button>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" className="btn-outline" onClick={() => setEditingBrandRequest(null)}>CANCELAR</button>
                  <button type="submit" className="btn-orange">APROBAR MARCA</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
