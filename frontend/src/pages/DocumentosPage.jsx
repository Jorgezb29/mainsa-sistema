import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

// ============================================================
// ICONOS SVG PROFESIONALES (sin emojis)
// ============================================================

const IconArrowLeft = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
  </svg>
);

const IconFile = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v6h6" />
  </svg>
);

const IconDownload = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
  </svg>
);

const IconClock = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6l4 2" />
  </svg>
);

const IconX = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconHome = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const IconDocument = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconBell = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const IconLogout = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function DocumentosPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [filtroAnio, setFiltroAnio] = useState('2026');
  const [paginaActual, setPaginaActual] = useState(1);
  const documentosPorPagina = 5;

  useEffect(() => {
    cargarDocumentos();
  }, []);

  const cargarDocumentos = async () => {
    setLoading(true);
    try {
      const response = await client.get('/documentos/mis-documentos');
      setDocumentos(response.data.documentos || []);
    } catch (error) {
      console.error('❌ Error al cargar documentos:', error);
      toast.error('Error al cargar documentos');
    }
    setLoading(false);
  };

  const descargarDocumento = async (id, titulo) => {
    try {
      toast.loading('Descargando documento...');
      await client.get(`/documentos/descargar/${id}`);
      toast.dismiss();
      toast.success(`Descargando: ${titulo}`);
    } catch (error) {
      toast.dismiss();
      toast.error('Error al descargar documento');
    }
  };

  const irAFirma = (id) => {
    navigate(`/firma/${id}`);
  };

  const rechazarDocumento = async (id) => {
    const motivo = prompt('Ingresa el motivo del rechazo:');
    if (!motivo || !motivo.trim()) {
      if (motivo !== null) toast.error('Debes ingresar un motivo');
      return;
    }
    try {
      await client.post(`/firmas/rechazar/${id}`, { motivo });
      toast.success('Documento rechazado');
      cargarDocumentos();
    } catch (error) {
      toast.error('Error al rechazar');
    }
  };

  const documentosFiltrados = documentos.filter(doc => {
    if (filtro === 'pendientes') return doc.estado_firma === 'PENDIENTE';
    if (filtro === 'firmados') return doc.estado_firma === 'FIRMADO';
    if (filtro === 'rechazados') return doc.estado_firma === 'RECHAZADO';
    if (filtro === 'contratos') return doc.tipo === 'CONTRATO';
    if (filtro === 'liquidaciones') return doc.tipo === 'LIQUIDACION';
    if (filtro === 'anexos') return doc.tipo === 'ANEXO';
    return true;
  });

  const totalPaginas = Math.ceil(documentosFiltrados.length / documentosPorPagina);
  const inicio = (paginaActual - 1) * documentosPorPagina;
  const documentosPaginados = documentosFiltrados.slice(inicio, inicio + documentosPorPagina);

  const getEstadoClase = (estado) => {
    switch (estado) {
      case 'FIRMADO': return 'firmado';
      case 'PENDIENTE': return 'pendiente';
      case 'RECHAZADO': return 'rechazado';
      default: return '';
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'FIRMADO': return 'Firmado';
      case 'PENDIENTE': return 'Pendiente';
      case 'RECHAZADO': return 'Rechazado';
      case 'ANULADO': return 'Anulado';
      default: return estado || 'Desconocido';
    }
  };

  const getTipoClase = (tipo) => {
    switch (tipo) {
      case 'CONTRATO': return 'contrato';
      case 'LIQUIDACION': return 'liquidacion';
      case 'ANEXO': return 'anexo';
      default: return 'otro';
    }
  };

  const getTipoTexto = (tipo) => {
    switch (tipo) {
      case 'CONTRATO': return 'Contrato';
      case 'LIQUIDACION': return 'Liquidación';
      case 'ANEXO': return 'Anexo';
      default: return 'Otro';
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pb-28">
      {/* Header */}
      <header className="bg-[#2a2a2a] px-4 py-4 flex justify-between items-center border-b border-[#333] sticky top-0 z-50">
        <Link to="/" className="text-gray-500 hover:text-orange-500 transition">
          <IconArrowLeft />
        </Link>
        <h2 className="text-lg font-semibold tracking-wide">Mis Documentos</h2>
        <div className="w-8"></div>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setFiltro('todos')}
            className={`px-4 py-1.5 rounded-full text-sm border transition text-xs font-medium ${
              filtro === 'todos'
                ? 'bg-orange-500 border-orange-500 text-white'
                : 'border-[#333] text-gray-400 hover:border-orange-500 hover:text-orange-500'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro('contratos')}
            className={`px-4 py-1.5 rounded-full text-sm border transition text-xs font-medium ${
              filtro === 'contratos'
                ? 'bg-orange-500 border-orange-500 text-white'
                : 'border-[#333] text-gray-400 hover:border-orange-500 hover:text-orange-500'
            }`}
          >
            Contratos
          </button>
          <button
            onClick={() => setFiltro('liquidaciones')}
            className={`px-4 py-1.5 rounded-full text-sm border transition text-xs font-medium ${
              filtro === 'liquidaciones'
                ? 'bg-orange-500 border-orange-500 text-white'
                : 'border-[#333] text-gray-400 hover:border-orange-500 hover:text-orange-500'
            }`}
          >
            Liquidaciones
          </button>
          <button
            onClick={() => setFiltro('anexos')}
            className={`px-4 py-1.5 rounded-full text-sm border transition text-xs font-medium ${
              filtro === 'anexos'
                ? 'bg-orange-500 border-orange-500 text-white'
                : 'border-[#333] text-gray-400 hover:border-orange-500 hover:text-orange-500'
            }`}
          >
            Anexos
          </button>
          <select
            value={filtroAnio}
            onChange={(e) => setFiltroAnio(e.target.value)}
            className="bg-[#2a2a2a] border border-[#333] rounded-full px-4 py-1.5 text-xs text-gray-400 outline-none focus:border-orange-500"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        {/* Lista de documentos */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 text-sm">Cargando documentos...</div>
        ) : documentosPaginados.length === 0 ? (
          <div className="text-center py-12 bg-[#2a2a2a] rounded-xl border border-[#333]">
            <IconFile />
            <div className="text-gray-500 text-sm mt-3">No hay documentos en esta categoría</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {documentosPaginados.map((doc) => (
              <div
                key={doc.id}
                className="bg-[#2a2a2a] rounded-xl p-4 border border-[#333] hover:border-[#444] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Información del documento */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <IconFile />
                    <span className="font-medium text-sm truncate">{doc.titulo}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      doc.tipo === 'CONTRATO' ? 'bg-blue-500/10 text-blue-400' :
                      doc.tipo === 'LIQUIDACION' ? 'bg-green-500/10 text-green-400' :
                      doc.tipo === 'ANEXO' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {getTipoTexto(doc.tipo)}
                    </span>
                    <span>{new Date(doc.fecha_creacion).toLocaleDateString('es-CL')}</span>
                    <span>v{doc.version}</span>
                  </div>
                </div>

                {/* Estado y acciones */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${
                    doc.estado_firma === 'FIRMADO'
                      ? 'text-green-400 bg-green-400/10'
                      : doc.estado_firma === 'PENDIENTE'
                      ? 'text-yellow-400 bg-yellow-400/10'
                      : 'text-red-400 bg-red-400/10'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      doc.estado_firma === 'FIRMADO'
                        ? 'bg-green-400'
                        : doc.estado_firma === 'PENDIENTE'
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                    }`} />
                    {getEstadoTexto(doc.estado_firma)}
                  </span>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => descargarDocumento(doc.id, doc.titulo)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#333] text-gray-300 rounded-lg text-xs hover:bg-[#444] transition"
                    >
                      <IconDownload />
                      <span>Descargar</span>
                    </button>
                    {doc.estado_firma === 'PENDIENTE' && (
                      <>
                        <button
                          onClick={() => irAFirma(doc.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs hover:bg-orange-600 transition"
                        >
                          <IconCheck />
                          <span>Firmar</span>
                        </button>
                        <button
                          onClick={() => rechazarDocumento(doc.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs hover:bg-red-500/20 transition"
                        >
                          <IconX />
                          <span>Rechazar</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPaginaActual(num)}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  paginaActual === num
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#2a2a2a] border border-[#333] text-gray-400 hover:border-orange-500 hover:text-orange-500'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#2a2a2a] border-t border-[#333] flex justify-around items-center py-2 z-50">
        <Link to="/" className="flex flex-col items-center text-gray-500 hover:text-orange-500 transition text-xs">
          <IconHome />
          <span className="mt-0.5">Inicio</span>
        </Link>
        <Link to="/documentos" className="flex flex-col items-center text-orange-500 transition text-xs">
          <IconDocument />
          <span className="mt-0.5">Documentos</span>
        </Link>
        <Link to="/notificaciones" className="flex flex-col items-center text-gray-500 hover:text-orange-500 transition text-xs">
          <IconBell />
          <span className="mt-0.5">Notificaciones</span>
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className="flex flex-col items-center text-gray-500 hover:text-orange-500 transition text-xs"
        >
          <IconLogout />
          <span className="mt-0.5">Salir</span>
        </button>
      </nav>

      {/* Estilos personalizados para badges */}
      <style>{`
        .status-badge.firmado { color: #81c784; background: rgba(129,199,132,0.1); }
        .status-badge.pendiente { color: #ffb74d; background: rgba(255,183,77,0.1); }
        .status-badge.rechazado { color: #ff6b6b; background: rgba(255,107,107,0.1); }
      `}</style>
    </div>
  );
}