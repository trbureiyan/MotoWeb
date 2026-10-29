import { useState, useEffect } from 'react';
import { 
  IconCalendar, 
  IconWrench, 
  IconTag, 
  IconUsers, 
  IconEdit, 
  IconPlus, 
  IconCheck, 
  IconX,
  IconShield
} from './Icons';
import { T } from '../styles/tokens';

// Datos iniciales de demostración mientras el backend completa los controladores
const INITIAL_APPOINTMENTS = [
  {
    id: 'apt-001',
    user: { name: 'Carlos Mendoza', email: 'carlos@mendoza.co', phone: '3104567890' },
    brand: 'DUCATI',
    motorcycleModel: 'Panigale V4 S 2023',
    service: 'TUNING ECU / MAPEO',
    requestedDate: '2026-11-02',
    status: 'pending',
    adminNotes: 'Cliente solicita mapa para escape Akrapovic completo.'
  },
  {
    id: 'apt-002',
    user: { name: 'Andrés Felipe Gómez', email: 'andres.gomez@gmail.com', phone: '3157891234' },
    brand: 'BMW',
    motorcycleModel: 'S1000RR M Package 2022',
    service: 'MANTENIMIENTO PREVENTIVO',
    requestedDate: '2026-11-03',
    status: 'confirmed',
    adminNotes: 'Revisión de los 10.000 km y cambio de líquido de frenos.'
  },
  {
    id: 'apt-003',
    user: { name: 'Valentina Restrepo', email: 'vale.restrepo@outlook.com', phone: '3209876543' },
    brand: 'YAMAHA',
    motorcycleModel: 'YZF-R6 Race 2021',
    service: 'FRENOS',
    requestedDate: '2026-10-30',
    status: 'completed',
    adminNotes: 'Instalación de pastillas Brembo Z04 y purga de bomba radial.'
  },
  {
    id: 'apt-004',
    user: { name: 'Mateo Sandoval', email: 'mateo.sandoval@live.com', phone: '3001234987' },
    brand: 'KTM',
    motorcycleModel: 'Super Duke 1290 R',
    service: 'DIAGNÓSTICO',
    requestedDate: '2026-10-28',
    status: 'cancelled',
    adminNotes: 'Cliente canceló por viaje. Reagendará el próximo mes.'
  }
];

const INITIAL_SERVICES = [
  {
    id: 'srv-001',
    name: 'MANTENIMIENTO PREVENTIVO',
    description: 'Inspección multipunto, cambio de aceite Motul 300V, filtro y ajuste general de ciclo.',
    estimatedHours: 3,
    priceRange_min: 150000,
    priceRange_max: 350000,
    isActive: true
  },
  {
    id: 'srv-002',
    name: 'TUNING ECU / MAPEO EN DYNO',
    description: 'Calibración de inyección y encendido en dinamómetro, optimización de curva de potencia y torque.',
    estimatedHours: 4,
    priceRange_min: 400000,
    priceRange_max: 850000,
    isActive: true
  },
  {
    id: 'srv-003',
    name: 'SISTEMA DE FRENOS',
    description: 'Mantenimiento de calipers, cambio de líquido DOT 5.1/RBF, rectificación o cambio de pastillas.',
    estimatedHours: 2,
    priceRange_min: 90000,
    priceRange_max: 220000,
    isActive: true
  },
  {
    id: 'srv-004',
    name: 'DIAGNÓSTICO ELECTRÓNICO',
    description: 'Escaneo OBD con software especializado multimarca para borrado de fallos y sensores.',
    estimatedHours: 1,
    priceRange_min: 80000,
    priceRange_max: 140000,
    isActive: true
  },
  {
    id: 'srv-005',
    name: 'PREPARACIÓN PARA CIRCUITO',
    description: 'Setting de suspensión, bloqueo de seguridad con alambre, precargas y mapas de competición.',
    estimatedHours: 5,
    priceRange_min: 350000,
    priceRange_max: 750000,
    isActive: true
  }
];

const INITIAL_BRANDS = [
  { id: 'br-001', name: 'DUCATI', slug: 'ducati', logoUrl: '', isActive: true },
  { id: 'br-002', name: 'BMW', slug: 'bmw', logoUrl: '', isActive: true },
  { id: 'br-003', name: 'KTM', slug: 'ktm', logoUrl: '', isActive: true },
  { id: 'br-004', name: 'YAMAHA', slug: 'yamaha', logoUrl: '', isActive: true },
  { id: 'br-005', name: 'TRIUMPH', slug: 'triumph', logoUrl: '', isActive: true },
  { id: 'br-006', name: 'SUZUKI', slug: 'suzuki', logoUrl: '', isActive: true },
  { id: 'br-007', name: 'HONDA', slug: 'honda', logoUrl: '', isActive: true },
  { id: 'br-008', name: 'KAWASAKI', slug: 'kawasaki', logoUrl: '', isActive: true }
];

const INITIAL_USERS = [
  { id: 'usr-001', name: 'Emanuel Ortiz', email: 'admin@mototaller.com', phone: '3109876543', role: 'admin', isActive: true },
  { id: 'usr-002', name: 'Carlos Mendoza', email: 'carlos@mendoza.co', phone: '3104567890', role: 'client', isActive: true },
  { id: 'usr-003', name: 'Andrés Felipe Gómez', email: 'andres.gomez@gmail.com', phone: '3157891234', role: 'client', isActive: true },
  { id: 'usr-004', name: 'Valentina Restrepo', email: 'vale.restrepo@outlook.com', phone: '3209876543', role: 'client', isActive: true },
  { id: 'usr-005', name: 'Mateo Sandoval', email: 'mateo.sandoval@live.com', phone: '3001234987', role: 'client', isActive: false }
];

export function AdminPanel({ onBack, loggedInUser }) {
  const [activeTab, setActiveTab] = useState('citas');
  
  // Estados de datos
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [brands, setBrands] = useState(INITIAL_BRANDS);
  const [users, setUsers] = useState(INITIAL_USERS);

  // Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Estados para modales de edición / creación
  const [editingService, setEditingService] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [viewingNotesApt, setViewingNotesApt] = useState(null);

  // Intentar cargar datos reales si el backend los expone
  useEffect(() => {
    fetch('/api/appointments', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length > 0) setAppointments(data); })
      .catch(() => {});

    fetch('/api/services')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length > 0) setServices(data); })
      .catch(() => {});

    fetch('/api/brands')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length > 0) setBrands(data); })
      .catch(() => {});
  }, []);

  // Controladores de Citas
  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const saveAppointmentNotes = (id, notes) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, adminNotes: notes } : a));
    setViewingNotesApt(null);
  };

  // Controladores de Servicios
  const toggleServiceActive = (id) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const saveService = (serviceData) => {
    if (serviceData.id) {
      setServices(prev => prev.map(s => s.id === serviceData.id ? serviceData : s));
    } else {
      const newService = { ...serviceData, id: `srv-${Date.now()}`, isActive: true };
      setServices(prev => [newService, ...prev]);
    }
    setEditingService(null);
  };

  // Controladores de Marcas
  const toggleBrandActive = (id) => {
    setBrands(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const saveBrand = (brandData) => {
    if (brandData.id) {
      setBrands(prev => prev.map(b => b.id === brandData.id ? brandData : b));
    } else {
      const newBrand = { ...brandData, id: `br-${Date.now()}`, isActive: true };
      setBrands(prev => [newBrand, ...prev]);
    }
    setEditingBrand(null);
  };

  // Controladores de Usuarios
  const toggleUserRole = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: u.role === 'admin' ? 'client' : 'admin' } : u));
  };

  const toggleUserActive = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  // Filtros aplicados a citas
  const filteredAppointments = appointments.filter(a => {
    const matchesStatus = statusFilter === 'ALL' || a.status.toUpperCase() === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (a.user?.name || '').toLowerCase().includes(term) ||
      (a.motorcycleModel || '').toLowerCase().includes(term) ||
      (a.brand || '').toLowerCase().includes(term) ||
      (a.service || '').toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

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
            ADMINISTRADOR: <strong>{loggedInUser?.name || 'ADMIN'}</strong>
          </div>
          <button className="btn-outline" onClick={onBack} style={{ fontSize: '0.7rem', padding: '0.45rem 0.85rem' }}>
            ← VOLVER AL SITIO
          </button>
        </div>
      </header>

      {/* PESTAÑAS DE NAVEGACIÓN */}
      <nav className="admin-tabs-nav" aria-label="Navegación del panel de administración">
        <button 
          className={`admin-tab-btn${activeTab === 'citas' ? ' active' : ''}`}
          onClick={() => { setActiveTab('citas'); setSearchTerm(''); }}
        >
          <IconCalendar size={16} />
          CITAS DE TALLER
          {pendingCount > 0 && <span className="admin-tab-badge">{pendingCount}</span>}
        </button>

        <button 
          className={`admin-tab-btn${activeTab === 'servicios' ? ' active' : ''}`}
          onClick={() => { setActiveTab('servicios'); setSearchTerm(''); }}
        >
          <IconWrench />
          SERVICIOS
          <span className="admin-tab-badge">{services.length}</span>
        </button>

        <button 
          className={`admin-tab-btn${activeTab === 'marcas' ? ' active' : ''}`}
          onClick={() => { setActiveTab('marcas'); setSearchTerm(''); }}
        >
          <IconTag size={16} />
          MARCAS
          <span className="admin-tab-badge">{brands.length}</span>
        </button>

        <button 
          className={`admin-tab-btn${activeTab === 'usuarios' ? ' active' : ''}`}
          onClick={() => { setActiveTab('usuarios'); setSearchTerm(''); }}
        >
          <IconUsers size={16} />
          USUARIOS Y CLIENTES
          <span className="admin-tab-badge">{users.length}</span>
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="admin-container">
        
        {/* ========================================================
            TAB 1: CITAS DE TALLER
            ======================================================== */}
        {activeTab === 'citas' && (
          <section>
            <div className="admin-header-row">
              <div>
                <h1 className="admin-view-title">AGENDA OPERATIVA DE CITAS</h1>
                <p className="admin-view-sub">Revisión de solicitudes, confirmación de turnos y control de entregas.</p>
              </div>
            </div>

            {/* TARJETAS DE MÉTRICAS */}
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

            {/* FILTROS Y BÚSQUEDA */}
            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <input 
                  className="admin-search-input"
                  placeholder="Buscar por cliente, moto o servicio..."
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

            {/* TABLA DE CITAS */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>FECHA</th>
                    <th>PILOTO / CONTACTO</th>
                    <th>MOTOCICLETA</th>
                    <th>SERVICIO</th>
                    <th>ESTADO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="admin-empty-state">
                        NO SE ENCONTRARON CITAS BAJO ESTE CRITERIO.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map(apt => (
                      <tr key={apt.id}>
                        <td>
                          <div style={{ fontFamily: T.mono, fontWeight: 700, color: '#fff' }}>{apt.requestedDate}</div>
                          <div style={{ fontFamily: T.mono, fontSize: '0.68rem', color: T.muted }}>ID: {apt.id}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{apt.user?.name || 'Cliente sin nombre'}</div>
                          <div style={{ fontFamily: T.mono, fontSize: '0.72rem', color: T.muted }}>
                            TEL: {apt.user?.phone || 'Sin tel'} · {apt.user?.email || ''}
                          </div>
                        </td>
                        <td>
                          <div style={{ color: T.orange, fontWeight: 700 }}>{apt.brand}</div>
                          <div style={{ fontSize: '0.75rem', color: T.muted }}>{apt.motorcycleModel}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{apt.service}</div>
                        </td>
                        <td>
                          <span className={`badge-status ${apt.status.toLowerCase()}`}>
                            {apt.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="admin-actions-cell">
                            {apt.status === 'pending' && (
                              <button 
                                className="btn-action-icon success"
                                onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                                title="Confirmar turno"
                              >
                                <IconCheck size={12} /> CONFIRMAR
                              </button>
                            )}
                            {apt.status === 'confirmed' && (
                              <button 
                                className="btn-action-icon success"
                                onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                                title="Marcar como entregada"
                              >
                                <IconCheck size={12} /> COMPLETAR
                              </button>
                            )}
                            {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                              <button 
                                className="btn-action-icon danger"
                                onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                                title="Cancelar cita"
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
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========================================================
            TAB 2: SERVICIOS
            ======================================================== */}
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

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>SERVICIO</th>
                    <th>DESCRIPCIÓN</th>
                    <th>DURACIÓN</th>
                    <th>TARIFA ESTIMADA</th>
                    <th>ESTADO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(srv => (
                    <tr key={srv.id}>
                      <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {srv.name}
                      </td>
                      <td style={{ fontSize: '0.75rem', color: T.muted, maxWidth: '300px' }}>
                        {srv.description}
                      </td>
                      <td style={{ fontFamily: T.mono, whiteSpace: 'nowrap' }}>
                        {srv.estimatedHours} HORAS
                      </td>
                      <td style={{ fontFamily: T.mono, whiteSpace: 'nowrap' }}>
                        ${srv.priceRange_min?.toLocaleString()} - ${srv.priceRange_max?.toLocaleString()} COP
                      </td>
                      <td>
                        <span className={`badge-status ${srv.isActive ? 'active' : 'inactive'}`}>
                          {srv.isActive ? 'ACTIVO' : 'PAUSADO'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions-cell">
                          <button 
                            className="btn-action-icon"
                            onClick={() => setEditingService(srv)}
                          >
                            <IconEdit size={12} /> EDITAR
                          </button>
                          <button 
                            className={`btn-action-icon ${srv.isActive ? 'danger' : 'success'}`}
                            onClick={() => toggleServiceActive(srv.id)}
                          >
                            {srv.isActive ? 'PAUSAR' : 'ACTIVAR'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========================================================
            TAB 3: MARCAS
            ======================================================== */}
        {activeTab === 'marcas' && (
          <section>
            <div className="admin-header-row">
              <div>
                <h1 className="admin-view-title">MARCAS AUTORIZADAS</h1>
                <p className="admin-view-sub">Fabricantes soportados por el herramental y diagnóstico del taller.</p>
              </div>
              <button 
                className="btn-orange" 
                onClick={() => setEditingBrand({ name: '', slug: '', logoUrl: '' })}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}
              >
                <IconPlus size={14} /> NUEVA MARCA
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>MARCA</th>
                    <th>SLUG / IDENTIFICADOR</th>
                    <th>DISPONIBILIDAD EN WEB</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map(b => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 800, color: T.orange, letterSpacing: '0.05em' }}>
                        {b.name}
                      </td>
                      <td style={{ fontFamily: T.mono, color: T.muted }}>
                        {b.slug}
                      </td>
                      <td>
                        <span className={`badge-status ${b.isActive ? 'active' : 'inactive'}`}>
                          {b.isActive ? 'DISPONIBLE' : 'DESACTIVADA'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions-cell">
                          <button 
                            className="btn-action-icon"
                            onClick={() => setEditingBrand(b)}
                          >
                            <IconEdit size={12} /> EDITAR
                          </button>
                          <button 
                            className={`btn-action-icon ${b.isActive ? 'danger' : 'success'}`}
                            onClick={() => toggleBrandActive(b.id)}
                          >
                            {b.isActive ? 'DESACTIVAR' : 'ACTIVAR'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========================================================
            TAB 4: USUARIOS Y CLIENTES
            ======================================================== */}
        {activeTab === 'usuarios' && (
          <section>
            <div className="admin-header-row">
              <div>
                <h1 className="admin-view-title">DIRECTORIO DE CLIENTES Y USUARIOS</h1>
                <p className="admin-view-sub">Control de roles, cuentas activas y directorio de contacto de pilotos.</p>
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

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>USUARIO</th>
                    <th>CORREO ELECTRÓNICO</th>
                    <th>TELÉFONO DE CONTACTO</th>
                    <th>ROL ASIGNADO</th>
                    <th>ESTADO CUENTA</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(u => 
                      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      u.email.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(u => (
                      <tr key={u.id}>
                        <td style={{ fontWeight: 700 }}>
                          {u.name}
                        </td>
                        <td style={{ fontFamily: T.mono, color: T.muted }}>
                          {u.email}
                        </td>
                        <td style={{ fontFamily: T.mono }}>
                          {u.phone || 'NO REGISTRADO'}
                        </td>
                        <td>
                          <span className={`badge-status ${u.role === 'admin' ? 'confirmed' : 'pending'}`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`badge-status ${u.isActive ? 'active' : 'inactive'}`}>
                            {u.isActive ? 'ACTIVA' : 'BLOQUEADA'}
                          </span>
                        </td>
                        <td>
                          <div className="admin-actions-cell">
                            <button 
                              className="btn-action-icon"
                              onClick={() => toggleUserRole(u.id)}
                              title="Cambiar entre Cliente y Administrador"
                            >
                              CAMBIAR A {u.role === 'admin' ? 'CLIENTE' : 'ADMIN'}
                            </button>
                            <button 
                              className={`btn-action-icon ${u.isActive ? 'danger' : 'success'}`}
                              onClick={() => toggleUserActive(u.id)}
                            >
                              {u.isActive ? 'BLOQUEAR' : 'DESBLOQUEAR'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

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
    </div>
  );
}
