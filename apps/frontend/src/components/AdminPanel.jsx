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
  IconShield,
  IconCurrencyDollar
} from './Icons';
import { T } from '../styles/tokens';
import { GalleryImageModal } from './Gallery';

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

export function AdminPanel({
  onBack,
  loggedInUser,
  galleryImages = [],
  galleryLoading = false,
  galleryError = '',
  onAddGalleryImage
}) {
  const [activeTab, setActiveTab] = useState('citas');
  
  // Estados de datos
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brandRequests, setBrandRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [apiError, setApiError] = useState('');

  // Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Estados para modales de edición / creación
  const [editingService, setEditingService] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [editingBrandRequest, setEditingBrandRequest] = useState(null);
  const [viewingNotesApt, setViewingNotesApt] = useState(null);
  const [cancellingAppointment, setCancellingAppointment] = useState(null);
  const [completingAppointment, setCompletingAppointment] = useState(null);
  const [addingGalleryImage, setAddingGalleryImage] = useState(false);
  const [novedadesDraft, setNovedadesDraft] = useState([]);
  const [sinNovedades, setSinNovedades] = useState(false);
  const [expandedChains, setExpandedChains] = useState(() => new Set());

  useEffect(() => {
    Promise.all([
      apiRequest('/api/appointments'),
      apiRequest('/api/services?active=false'),
      apiRequest('/api/brands?active=false'),
      apiRequest('/api/brands/requests'),
      apiRequest('/api/users'),
      apiRequest('/api/payments')
    ])
      .then(([appointmentData, serviceData, brandData, brandRequestData, userData, paymentData]) => {
        setAppointments(appointmentData || []);
        setServices(serviceData || []);
        setBrands(brandData || []);
        setBrandRequests(brandRequestData || []);
        setUsers(userData || []);
        setPayments(paymentData || []);
      })
      .catch(error => setApiError(error.message));
  }, []);

  // Controladores de Citas
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
  const toggleUserRole = async (id) => {
    const user = users.find(item => item.id === id);
    if (!user) return;
    try {
      const updated = await apiRequest(`/api/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ role: user.role === 'admin' ? 'client' : 'admin' })
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

  // Filtros aplicados a citas (incluye las correcciones de la cadena)
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

  // Filas visibles: raíces con sus correcciones cuando corresponde.
  const appointmentRows = [];
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

      appointmentRows.push({
        appointment: root,
        isChild: false,
        childCount: !isFiltering || rootMatches ? children.length : 0,
        expanded
      });
      visibleChildren.forEach(child => appointmentRows.push({ appointment: child, isChild: true }));
    });

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  // Derivados del modal de completar
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

  const renderNovedadesCell = (appointment) => {
    if (appointment.isChain) {
      return (
        <div style={{ display: 'grid', gap: '0.2rem' }}>
          <span style={{ fontSize: '0.75rem', color: T.muted }}>No aplica</span>
          {appointment.status === 'completed' && appointment.adminNotes && (
            <span style={{ fontSize: '0.72rem', color: T.text }}>{appointment.adminNotes}</span>
          )}
        </div>
      );
    }
    if (appointment.status !== 'completed') {
      return <span style={{ fontSize: '0.75rem', color: T.muted }}>—</span>;
    }
    const novedades = appointment.novedades || [];
    if (!novedades.length) {
      return <span style={{ fontSize: '0.75rem', color: T.muted }}>Sin novedades</span>;
    }
    return (
      <div className="admin-novedad-list">
        {novedades.slice(0, 2).map(novedad => (
          <div className="admin-novedad-line" key={novedad.id}>
            <span className={`admin-novedad-dot ${novedad.status}`} />
            <span>{novedad.description}</span>
          </div>
        ))}
        {novedades.length > 2 && (
          <span className="admin-novedad-more">+{novedades.length - 2} más</span>
        )}
      </div>
    );
  };

  const renderAppointmentRow = ({ appointment: apt, isChild = false, childCount = 0, expanded = false }) => (
    <tr
      key={apt.id}
      className={isChild ? 'admin-chain-row' : (childCount > 0 ? 'admin-chain-root' : undefined)}
    >
      <td>
        {isChild && <span className="admin-chain-label">CORRECCIÓN DE NOVEDAD</span>}
        <div style={{ fontFamily: T.mono, fontWeight: 700, color: '#fff' }}>{apt.requestedDate}</div>
        <div style={{ fontFamily: T.mono, fontSize: '0.68rem', color: T.muted }}>ID: {apt.id}</div>
        {!isChild && childCount > 0 && (
          <button
            type="button"
            className="admin-chain-toggle"
            aria-expanded={expanded}
            onClick={() => toggleChain(apt.id)}
            title={expanded ? 'Ocultar correcciones de la cadena' : 'Mostrar correcciones de la cadena'}
          >
            <span aria-hidden="true">{expanded ? '▾' : '▸'}</span> {childCount} corrección(es)
          </button>
        )}
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
        <div style={{ fontWeight: 600 }}>{apt.isChain ? (apt.chainReason || apt.service) : apt.service}</div>
      </td>
      <td>
        {renderNovedadesCell(apt)}
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
          {(apt.status === 'confirmed' || (apt.status === 'completed' && !apt.payment)) && (
            <button
              className="btn-action-icon success"
              onClick={() => openCompletionModal(apt)}
              title={apt.status === 'completed' ? 'Definir monto final' : 'Marcar como entregada'}
            >
              <IconCheck size={12} /> {apt.status === 'completed' ? 'DEFINIR MONTO' : 'COMPLETAR'}
            </button>
          )}
          {apt.status !== 'cancelled' && apt.status !== 'completed' && (
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
      </td>
    </tr>
  );

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

      {apiError && (
        <div role="alert" style={{ margin: '1rem auto 0', maxWidth: 1200, padding: '0.75rem 1rem', color: '#ffb4a3', background: 'rgba(180, 45, 20, 0.18)', border: '1px solid rgba(255, 98, 0, 0.4)' }}>
          {apiError}
        </div>
      )}

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

        <button
          className={`admin-tab-btn${activeTab === 'pagos' ? ' active' : ''}`}
          onClick={() => { setActiveTab('pagos'); setSearchTerm(''); }}
        >
          <IconCurrencyDollar size={18} />
          HISTORIAL DE PAGOS
          <span className="admin-tab-badge">{payments.length}</span>
        </button>

        <button
          className={`admin-tab-btn${activeTab === 'galeria' ? ' active' : ''}`}
          onClick={() => { setActiveTab('galeria'); setSearchTerm(''); }}
        >
          GALERÍA
          <span className="admin-tab-badge">{galleryImages.length}</span>
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

            {/* TABLA DE CITAS */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>FECHA</th>
                    <th>PILOTO / CONTACTO</th>
                    <th>MOTOCICLETA</th>
                    <th>MOTIVO DE INGRESO</th>
                    <th>NOVEDADES</th>
                    <th>ESTADO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="admin-empty-state">
                        NO SE ENCONTRARON CITAS BAJO ESTE CRITERIO.
                      </td>
                    </tr>
                  ) : (
                    appointmentRows.map(renderAppointmentRow)
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

            <div className="admin-table-container" style={{ marginBottom: '2rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>SOLICITUD</th>
                    <th>CLIENTE</th>
                    <th>ESTADO</th>
                    <th>FECHA</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {brandRequests.map(request => (
                    <tr key={request.id}>
                      <td style={{ fontWeight: 800, color: T.text }}>{request.name}</td>
                      <td>{request.user?.name || request.user?.email || 'CLIENTE'}</td>
                      <td>
                        <span className={`badge-status ${request.status === 'pending' ? 'pending' : request.status === 'approved' ? 'active' : 'inactive'}`}>
                          {request.status === 'pending' ? 'EN REVISIÓN' : request.status === 'approved' ? 'APROBADA' : 'RECHAZADA'}
                        </span>
                      </td>
                      <td>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : '—'}</td>
                      <td>
                        {request.status === 'pending' && (
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
                        )}
                      </td>
                    </tr>
                  ))}
                  {!brandRequests.length && (
                    <tr><td colSpan="5" style={{ color: T.muted, textAlign: 'center' }}>No hay solicitudes de marca.</td></tr>
                  )}
                </tbody>
              </table>
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

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>USUARIO</th>
                    <th>CORREO ELECTRÓNICO</th>
                    <th>MONTO PAGADO</th>
                    <th>FECHA DE PAGO</th>
                  </tr>
                </thead>
                <tbody>
                  {payments
                    .filter(payment => (
                      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
                    ))
                    .map(payment => (
                      <tr key={payment.id}>
                        <td style={{ fontWeight: 700 }}>{payment.userName}</td>
                        <td style={{ fontFamily: T.mono, color: T.muted }}>{payment.userEmail}</td>
                        <td style={{ fontFamily: T.mono }}>
                          ${Number(payment.amount).toLocaleString('es-CO')} COP
                        </td>
                        <td>
                          {payment.date
                            ? new Date(payment.date).toLocaleString('es-CO', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })
                            : 'FECHA NO DISPONIBLE'}
                        </td>
                      </tr>
                    ))}
                  {!payments.length && (
                    <tr>
                      <td colSpan={4} className="admin-empty-state">AÚN NO HAY PAGOS REGISTRADOS</td>
                    </tr>
                  )}
                  {!!payments.length && !payments.some(payment => (
                    payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
                  )) && (
                    <tr>
                      <td colSpan={4} className="admin-empty-state">NO HAY PAGOS QUE COINCIDAN CON LA BÚSQUEDA</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

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

      {cancellingAppointment && (
        <div className="admin-modal-overlay" onClick={() => setCancellingAppointment(null)}>
          <div className="admin-modal-card" onClick={event => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setCancellingAppointment(null)}><IconX /></button>
            <div className="admin-form-label">CANCELAR CITA</div>
            <h2 className="admin-view-title" style={{ fontSize: '1.1rem', margin: '0.4rem 0 1rem' }}>
              {cancellingAppointment.brand} · {cancellingAppointment.motorcycleModel}
            </h2>
            {apiError && (
              <p role="alert" style={{ margin: '0 0 1rem', padding: '0.6rem 0.75rem', color: '#ffb4a3', background: 'rgba(180, 45, 20, 0.18)', border: '1px solid rgba(255, 98, 0, 0.4)', fontSize: '0.78rem' }}>
                {apiError}
              </p>
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
