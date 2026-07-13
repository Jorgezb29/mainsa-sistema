import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// ============================================================
// ICONOS SVG PROFESIONALES
// ============================================================

const IconDashboard = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const IconDocument = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconSignature = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const IconBell = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const IconUser = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconUpload = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const IconExport = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const IconEye = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const IconAlert = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const IconMegaphone = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
);

const IconLogout = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [documentos, setDocumentos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [firmas, setFirmas] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    totalTrabajadores: 0,
    documentosPendientes: 0,
    notificacionesHoy: 0,
    descargasMes: 0
  });

  const [nuevoDocumento, setNuevoDocumento] = useState({
    tipo: 'CONTRATO',
    titulo: '',
    usuario_id: ''
  });

  const [nuevaNotificacion, setNuevaNotificacion] = useState({
    titulo: '',
    contenido: '',
    turno_destino: 'TODOS'
  });

  useEffect(() => {
    cargarDatos();
  }, [activeTab]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard' || activeTab === 'documentos') {
        const docRes = await client.get('/documentos/all');
        setDocumentos(docRes.data.documentos || []);
        const pendientes = docRes.data.documentos?.filter(d => d.estado_firma === 'PENDIENTE').length || 0;
        setStats(prev => ({ ...prev, documentosPendientes: pendientes }));
      }

      if (activeTab === 'dashboard' || activeTab === 'usuarios') {
        const userRes = await client.get('/usuarios');
        setUsuarios(userRes.data.usuarios || []);
        setStats(prev => ({ 
          ...prev, 
          totalTrabajadores: userRes.data.usuarios?.filter(u => u.activo).length || 0 
        }));
      }

      if (activeTab === 'dashboard' || activeTab === 'firmas') {
        const firmaRes = await client.get('/firmas/estado');
        setFirmas(firmaRes.data.firmas || []);
      }

      if (activeTab === 'dashboard' || activeTab === 'notificaciones') {
        const notifRes = await client.get('/notificaciones/all');
        setNotificaciones(notifRes.data.notificaciones || []);
        const hoy = new Date().toDateString();
        const notifHoy = notifRes.data.notificaciones?.filter(n => 
          new Date(n.created_at).toDateString() === hoy
        ).length || 0;
        setStats(prev => ({ ...prev, notificacionesHoy: notifHoy }));
      }
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
      toast.error('Error al cargar datos');
    }
    setLoading(false);
  };

  const cargarDocumento = async (e) => {
    e.preventDefault();
    try {
      await client.post('/documentos/cargar', nuevoDocumento);
      toast.success('Documento cargado exitosamente');
      setNuevoDocumento({ tipo: 'CONTRATO', titulo: '', usuario_id: '' });
      cargarDatos();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al cargar documento');
    }
  };

  const crearNotificacion = async (e) => {
    e.preventDefault();
    try {
      await client.post('/notificaciones/crear', nuevaNotificacion);
      toast.success('Notificación creada exitosamente');
      setNuevaNotificacion({ titulo: '', contenido: '', turno_destino: 'TODOS' });
      cargarDatos();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al crear notificación');
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'FIRMADO': return 'firmado';
      case 'PENDIENTE': return 'pendiente';
      case 'RECHAZADO': return 'rechazado';
      case 'ANULADO': return 'inactivo';
      default: return '';
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'FIRMADO': return 'Firmado';
      case 'PENDIENTE': return 'Pendiente';
      case 'RECHAZADO': return 'Rechazado';
      case 'ANULADO': return 'Anulado';
      default: return estado || 'Sin firma';
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: <IconDashboard />, label: 'Dashboard' },
    { id: 'documentos', icon: <IconDocument />, label: 'Documentos' },
    { id: 'firmas', icon: <IconSignature />, label: 'Firmas' },
    { id: 'notificaciones', icon: <IconBell />, label: 'Notificaciones' },
    { id: 'usuarios', icon: <IconUsers />, label: 'Usuarios' },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="bg-[#2a2a2a] px-4 py-4 flex justify-between items-center border-b border-[#333] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center font-bold text-sm">
            {user?.nombre?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="text-sm font-medium">{user?.nombre || 'Usuario'}</div>
            <div className="text-[11px] text-gray-500">{user?.rol === 'ADMIN_RRHH' ? 'Administradora RRHH' : 'Superadmin'}</div>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-1.5 bg-transparent border border-[#444] text-gray-500 px-3 py-1.5 rounded-lg text-xs hover:border-orange-500 hover:text-orange-500 transition"
        >
          <IconLogout />
          <span>Cerrar Sesión</span>
        </button>
      </header>

      <div className="flex min-h-[calc(100vh-70px)]">
        {/* Sidebar */}
        <nav className="w-[220px] bg-[#2a2a2a] border-r border-[#333] py-5 flex-shrink-0 hidden sm:block">
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2.5 px-5 py-3 text-sm cursor-pointer transition-all border-l-3 ${
                activeTab === item.id 
                  ? 'text-orange-500 border-l-orange-500 bg-orange-500/5' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5 border-l-transparent'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Cargando...</div>
          ) : (
            <>
              {/* DASHBOARD */}
              {activeTab === 'dashboard' && (
                <>
                  <h2 className="text-xl mb-5 font-semibold tracking-wide">
                    <span className="text-orange-500">Dashboard</span> RRHH
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#333]">
                      <div className="text-3xl font-bold text-orange-500">{stats.totalTrabajadores}</div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                        <IconUsers />
                        <span>Total trabajadores</span>
                      </div>
                    </div>
                    <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#333]">
                      <div className="text-3xl font-bold text-orange-500">{stats.documentosPendientes}</div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                        <IconDocument />
                        <span>Documentos pendientes</span>
                      </div>
                    </div>
                    <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#333]">
                      <div className="text-3xl font-bold text-orange-500">{stats.notificacionesHoy}</div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                        <IconBell />
                        <span>Notificaciones hoy</span>
                      </div>
                    </div>
                    <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#333]">
                      <div className="text-3xl font-bold text-orange-500">{stats.descargasMes || 48}</div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                        <IconExport />
                        <span>Descargas del mes</span>
                      </div>
                    </div>
                  </div>

                  {/* Tabla de documentos */}
                  <div className="bg-[#2a2a2a] rounded-xl border border-[#333] overflow-hidden">
                    <div className="p-4 border-b border-[#333] flex flex-wrap justify-between items-center gap-2">
                      <h3 className="text-sm font-medium">Últimos documentos cargados</h3>
                      <div className="flex gap-2 flex-wrap">
                        <button 
                          onClick={() => setActiveTab('documentos')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-semibold hover:bg-orange-600 transition"
                        >
                          <IconUpload />
                          <span>Cargar nuevo</span>
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#333] text-gray-400 rounded-lg text-xs hover:bg-[#444] transition">
                          <IconExport />
                          <span>Exportar</span>
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-500 border-b border-[#333]">
                            <th className="px-4 py-3 text-left">Trabajador</th>
                            <th className="px-4 py-3 text-left">Documento</th>
                            <th className="px-4 py-3 text-left">Tipo</th>
                            <th className="px-4 py-3 text-left">Estado</th>
                            <th className="px-4 py-3 text-left">Fecha</th>
                            <th className="px-4 py-3 text-left">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documentos.slice(0, 5).map((doc) => (
                            <tr key={doc.id} className="border-b border-[#333] hover:bg-white/5">
                              <td className="px-4 py-3 text-gray-300">{doc.trabajador || 'N/A'}</td>
                              <td className="px-4 py-3 text-gray-300">{doc.titulo}</td>
                              <td className="px-4 py-3 text-gray-400">{doc.tipo}</td>
                              <td className="px-4 py-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold status-badge ${getEstadoColor(doc.estado_firma)}`}>
                                  {getEstadoTexto(doc.estado_firma)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-400">
                                {new Date(doc.fecha_creacion).toLocaleDateString('es-CL')}
                              </td>
                              <td className="px-4 py-3">
                                <button className="flex items-center gap-1 px-2 py-1 bg-[#333] text-gray-400 rounded text-xs hover:bg-[#444] transition">
                                  <IconEye />
                                  <span>Ver</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                          {documentos.length === 0 && (
                            <tr><td colSpan="6" className="text-center py-6 text-gray-500">No hay documentos cargados</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* DOCUMENTOS */}
              {activeTab === 'documentos' && (
                <div>
                  <h2 className="text-xl mb-5 font-semibold tracking-wide">
                    <span className="text-orange-500">Documentos</span>
                  </h2>
                  
                  <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#333] mb-6">
                    <h3 className="text-sm font-medium text-orange-500 mb-4">Cargar Nuevo Documento</h3>
                    <form onSubmit={cargarDocumento} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="Título del documento"
                        value={nuevoDocumento.titulo}
                        onChange={(e) => setNuevoDocumento({...nuevoDocumento, titulo: e.target.value})}
                        className="bg-[#1f1f1f] px-4 py-2.5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 border border-[#333]"
                        required
                      />
                      <select
                        value={nuevoDocumento.tipo}
                        onChange={(e) => setNuevoDocumento({...nuevoDocumento, tipo: e.target.value})}
                        className="bg-[#1f1f1f] px-4 py-2.5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 border border-[#333]"
                      >
                        <option value="CONTRATO">Contrato</option>
                        <option value="LIQUIDACION">Liquidación</option>
                        <option value="ANEXO">Anexo</option>
                        <option value="OTRO">Otro</option>
                      </select>
                      <input
                        type="number"
                        placeholder="ID del trabajador"
                        value={nuevoDocumento.usuario_id}
                        onChange={(e) => setNuevoDocumento({...nuevoDocumento, usuario_id: e.target.value})}
                        className="bg-[#1f1f1f] px-4 py-2.5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 border border-[#333]"
                        required
                      />
                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 md:col-span-3 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl transition"
                      >
                        <IconUpload />
                        <span>Cargar Documento</span>
                      </button>
                    </form>
                  </div>

                  <div className="bg-[#2a2a2a] rounded-xl border border-[#333] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-500 border-b border-[#333]">
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Título</th>
                            <th className="px-4 py-3 text-left">Trabajador</th>
                            <th className="px-4 py-3 text-left">Tipo</th>
                            <th className="px-4 py-3 text-left">Estado</th>
                            <th className="px-4 py-3 text-left">Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documentos.map((doc) => (
                            <tr key={doc.id} className="border-b border-[#333] hover:bg-white/5">
                              <td className="px-4 py-3 text-gray-400">{doc.id}</td>
                              <td className="px-4 py-3 text-gray-300">{doc.titulo}</td>
                              <td className="px-4 py-3 text-gray-300">{doc.trabajador || 'N/A'}</td>
                              <td className="px-4 py-3 text-gray-400">{doc.tipo}</td>
                              <td className="px-4 py-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold status-badge ${getEstadoColor(doc.estado_firma)}`}>
                                  {getEstadoTexto(doc.estado_firma)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-400">
                                {new Date(doc.fecha_creacion).toLocaleDateString('es-CL')}
                              </td>
                            </tr>
                          ))}
                          {documentos.length === 0 && (
                            <tr><td colSpan="6" className="text-center py-6 text-gray-500">No hay documentos</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* FIRMAS */}
              {activeTab === 'firmas' && (
                <div>
                  <h2 className="text-xl mb-5 font-semibold tracking-wide">
                    <span className="text-orange-500">Estado de Firmas</span>
                  </h2>
                  <div className="bg-[#2a2a2a] rounded-xl border border-[#333] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-500 border-b border-[#333]">
                            <th className="px-4 py-3 text-left">Trabajador</th>
                            <th className="px-4 py-3 text-left">Documento</th>
                            <th className="px-4 py-3 text-left">Estado</th>
                            <th className="px-4 py-3 text-left">Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {firmas.map((firma, index) => (
                            <tr key={index} className="border-b border-[#333] hover:bg-white/5">
                              <td className="px-4 py-3 text-gray-300">{firma.trabajador}</td>
                              <td className="px-4 py-3 text-gray-300">{firma.documento}</td>
                              <td className="px-4 py-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold status-badge ${getEstadoColor(firma.estado)}`}>
                                  {getEstadoTexto(firma.estado)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-400">
                                {firma.fecha_firma 
                                  ? new Date(firma.fecha_firma).toLocaleDateString('es-CL')
                                  : '---'}
                              </td>
                            </tr>
                          ))}
                          {firmas.length === 0 && (
                            <tr><td colSpan="4" className="text-center py-6 text-gray-500">No hay firmas registradas</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICACIONES */}
              {activeTab === 'notificaciones' && (
                <div>
                  <h2 className="text-xl mb-5 font-semibold tracking-wide">
                    <span className="text-orange-500">Notificaciones</span>
                  </h2>
                  
                  <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#333] mb-6">
                    <h3 className="text-sm font-medium text-orange-500 mb-4">Crear Notificación</h3>
                    <form onSubmit={crearNotificacion} className="grid grid-cols-1 gap-4">
                      <input
                        type="text"
                        placeholder="Título de la notificación"
                        value={nuevaNotificacion.titulo}
                        onChange={(e) => setNuevaNotificacion({...nuevaNotificacion, titulo: e.target.value})}
                        className="bg-[#1f1f1f] px-4 py-2.5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 border border-[#333]"
                        required
                      />
                      <textarea
                        placeholder="Contenido de la notificación"
                        value={nuevaNotificacion.contenido}
                        onChange={(e) => setNuevaNotificacion({...nuevaNotificacion, contenido: e.target.value})}
                        rows="3"
                        className="bg-[#1f1f1f] px-4 py-2.5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 border border-[#333]"
                        required
                      />
                      <select
                        value={nuevaNotificacion.turno_destino}
                        onChange={(e) => setNuevaNotificacion({...nuevaNotificacion, turno_destino: e.target.value})}
                        className="bg-[#1f1f1f] px-4 py-2.5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 border border-[#333]"
                      >
                        <option value="TODOS">Todos los turnos</option>
                        <option value="DIA">Turno Día</option>
                        <option value="NOCHE">Turno Noche</option>
                        <option value="GUARDIA">Guardia</option>
                      </select>
                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl transition"
                      >
                        <IconMegaphone />
                        <span>Crear Notificación</span>
                      </button>
                    </form>
                  </div>

                  <div className="bg-[#2a2a2a] rounded-xl border border-[#333] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-500 border-b border-[#333]">
                            <th className="px-4 py-3 text-left">Título</th>
                            <th className="px-4 py-3 text-left">Turno</th>
                            <th className="px-4 py-3 text-left">Creador</th>
                            <th className="px-4 py-3 text-left">Lecturas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {notificaciones.map((notif) => (
                            <tr key={notif.id} className="border-b border-[#333] hover:bg-white/5">
                              <td className="px-4 py-3 text-gray-300">{notif.titulo}</td>
                              <td className="px-4 py-3 text-gray-400">{notif.turno_destino}</td>
                              <td className="px-4 py-3 text-gray-400">{notif.creador || 'N/A'}</td>
                              <td className="px-4 py-3 text-gray-400">{notif.lecturas || 0}</td>
                            </tr>
                          ))}
                          {notificaciones.length === 0 && (
                            <tr><td colSpan="4" className="text-center py-6 text-gray-500">No hay notificaciones</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* USUARIOS */}
              {activeTab === 'usuarios' && (
                <div>
                  <h2 className="text-xl mb-5 font-semibold tracking-wide">
                    <span className="text-orange-500">Usuarios</span>
                  </h2>
                  <div className="bg-[#2a2a2a] rounded-xl border border-[#333] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-500 border-b border-[#333]">
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">RUT</th>
                            <th className="px-4 py-3 text-left">Nombre</th>
                            <th className="px-4 py-3 text-left">Rol</th>
                            <th className="px-4 py-3 text-left">Turno</th>
                            <th className="px-4 py-3 text-left">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usuarios.map((usr) => (
                            <tr key={usr.id} className="border-b border-[#333] hover:bg-white/5">
                              <td className="px-4 py-3 text-gray-400">{usr.id}</td>
                              <td className="px-4 py-3 text-gray-300">{usr.rut}</td>
                              <td className="px-4 py-3 text-gray-300">{usr.nombre}</td>
                              <td className="px-4 py-3 text-gray-400">{usr.rol}</td>
                              <td className="px-4 py-3 text-gray-400">{usr.turno}</td>
                              <td className="px-4 py-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold status-badge ${usr.activo ? 'activo' : 'inactivo'}`}>
                                  {usr.activo ? 'Activo' : 'Inactivo'}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {usuarios.length === 0 && (
                            <tr><td colSpan="6" className="text-center py-6 text-gray-500">No hay usuarios</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Estilos para los badges */}
      <style>{`
        .status-badge.firmado { background: rgba(129,199,132,0.15); color: #81c784; }
        .status-badge.pendiente { background: rgba(255,183,77,0.15); color: #ffb74d; }
        .status-badge.rechazado { background: rgba(255,107,107,0.15); color: #ff6b6b; }
        .status-badge.activo { background: rgba(129,199,132,0.15); color: #81c784; }
        .status-badge.inactivo { background: rgba(255,107,107,0.15); color: #ff6b6b; }
        .border-l-3 { border-left-width: 3px; }
      `}</style>
    </div>
  );
}