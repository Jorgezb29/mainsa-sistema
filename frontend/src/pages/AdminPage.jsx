import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [documentos, setDocumentos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [firmas, setFirmas] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estadísticas
  const [stats, setStats] = useState({
    totalTrabajadores: 0,
    documentosPendientes: 0,
    notificacionesHoy: 0,
    descargasMes: 0
  });

  // Formularios
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
        
        // Calcular estadísticas
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
      toast.success('✅ Documento cargado exitosamente');
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
      toast.success('✅ Notificación creada exitosamente');
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
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'documentos', icon: '📄', label: 'Documentos' },
    { id: 'firmas', icon: '✍️', label: 'Firmas' },
    { id: 'notificaciones', icon: '🔔', label: 'Notificaciones' },
    { id: 'usuarios', icon: '👥', label: 'Usuarios' },
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
          className="bg-transparent border border-[#444] text-gray-500 px-3 py-1.5 rounded-lg text-xs hover:border-orange-500 hover:text-orange-500 transition"
        >
          Cerrar Sesión
        </button>
      </header>

      <div className="flex min-h-[calc(100vh-70px)]">
        {/* Sidebar */}
        <nav className="w-[220px] bg-[#2a2a2a] border-r border-[#333] py-5 flex-shrink-0 hidden sm:block">
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-5 py-3 text-sm cursor-pointer transition-all border-l-3 ${
                activeTab === item.id 
                  ? 'text-orange-500 border-l-orange-500 bg-orange-500/5' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5 border-l-transparent'
              }`}
            >
              <span className="mr-2.5">{item.icon}</span>
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
                  <h2 className="text-xl mb-5">
                    📊 <span className="text-orange-500">Dashboard</span> RRHH
                  </h2>

                  {/* Tarjetas de estadísticas */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#333]">
                      <div className="text-3xl font-bold text-orange-500">{stats.totalTrabajadores}</div>
                      <div className="text-sm text-gray-500 mt-1">👥 Total trabajadores</div>
                    </div>
                    <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#333]">
                      <div className="text-3xl font-bold text-orange-500">{stats.documentosPendientes}</div>
                      <div className="text-sm text-gray-500 mt-1">📄 Documentos pendientes</div>
                    </div>
                    <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#333]">
                      <div className="text-3xl font-bold text-orange-500">{stats.notificacionesHoy}</div>
                      <div className="text-sm text-gray-500 mt-1">🔔 Notificaciones hoy</div>
                    </div>
                    <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#333]">
                      <div className="text-3xl font-bold text-orange-500">{stats.descargasMes || 48}</div>
                      <div className="text-sm text-gray-500 mt-1">⬇ Descargas del mes</div>
                    </div>
                  </div>

                  {/* Tabla de documentos */}
                  <div className="bg-[#2a2a2a] rounded-xl border border-[#333] overflow-hidden">
                    <div className="p-4 border-b border-[#333] flex flex-wrap justify-between items-center gap-2">
                      <h3 className="text-sm font-medium">📋 Últimos documentos cargados</h3>
                      <div className="flex gap-2 flex-wrap">
                        <button 
                          onClick={() => setActiveTab('documentos')}
                          className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-semibold hover:bg-orange-600 transition"
                        >
                          + Cargar nuevo
                        </button>
                        <button className="px-3 py-1.5 bg-[#333] text-gray-400 rounded-lg text-xs hover:bg-[#444] transition">
                          📤 Exportar
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
                                <button className="px-2 py-1 bg-[#333] text-gray-400 rounded text-xs hover:bg-[#444] transition">
                                  👁 Ver
                                </button>
                                {doc.estado_firma === 'RECHAZADO' && (
                                  <button className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs hover:bg-red-500/20 transition ml-1">
                                    Anular
                                  </button>
                                )}
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
                  <h2 className="text-xl mb-5">📄 <span className="text-orange-500">Documentos</span></h2>
                  
                  {/* Formulario de carga */}
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
                        className="md:col-span-3 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl transition"
                      >
                        📤 Cargar Documento
                      </button>
                    </form>
                  </div>

                  {/* Lista de documentos */}
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
                  <h2 className="text-xl mb-5">✍️ <span className="text-orange-500">Estado de Firmas</span></h2>
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
                  <h2 className="text-xl mb-5">🔔 <span className="text-orange-500">Notificaciones</span></h2>
                  
                  {/* Formulario */}
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
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl transition"
                      >
                        📢 Crear Notificación
                      </button>
                    </form>
                  </div>

                  {/* Lista */}
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
                  <h2 className="text-xl mb-5">👥 <span className="text-orange-500">Usuarios</span></h2>
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
                                  {usr.activo ? 'Activo ✅' : 'Inactivo ❌'}
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