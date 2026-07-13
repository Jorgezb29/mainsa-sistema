import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function DocumentosPage() {
  const { user } = useAuth();
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [modalFirma, setModalFirma] = useState(null); // Documento seleccionado para firmar
  const [firmando, setFirmando] = useState(false);

  useEffect(() => {
    cargarDocumentos();
  }, []);

  const cargarDocumentos = async () => {
    setLoading(true);
    try {
      const response = await client.get('/documentos/mis-documentos');
      console.log('📄 Documentos recibidos:', response.data);
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
      const response = await client.get(`/documentos/descargar/${id}`);
      console.log('📥 Descarga registrada:', response.data);
      toast.dismiss();
      toast.success(`Descargando: ${titulo}`);
    } catch (error) {
      toast.dismiss();
      toast.error('Error al descargar documento');
    }
  };

  const firmarDocumento = async (id) => {
    setFirmando(true);
    try {
      const response = await client.post(`/firmas/firmar/${id}`);
      console.log('✅ Firma registrada:', response.data);
      toast.success('✅ Documento firmado exitosamente');
      setModalFirma(null);
      cargarDocumentos(); // Recargar lista
    } catch (error) {
      console.error('❌ Error al firmar:', error);
      toast.error(error.response?.data?.error || 'Error al firmar');
    }
    setFirmando(false);
  };

  const rechazarFirma = async (id, motivo) => {
    if (!motivo) {
      toast.error('Debes ingresar un motivo');
      return;
    }
    setFirmando(true);
    try {
      const response = await client.post(`/firmas/rechazar/${id}`, { motivo });
      console.log('❌ Rechazo registrado:', response.data);
      toast.success('Documento rechazado');
      setModalFirma(null);
      cargarDocumentos();
    } catch (error) {
      console.error('❌ Error al rechazar:', error);
      toast.error(error.response?.data?.error || 'Error al rechazar');
    }
    setFirmando(false);
  };

  const documentosFiltrados = documentos.filter(doc => {
    if (filtro === 'todos') return true;
    if (filtro === 'pendientes') return doc.estado_firma === 'PENDIENTE';
    if (filtro === 'firmados') return doc.estado_firma === 'FIRMADO';
    if (filtro === 'rechazados') return doc.estado_firma === 'RECHAZADO';
    return true;
  });

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'FIRMADO': return 'text-green-400 bg-green-400/10';
      case 'PENDIENTE': return 'text-yellow-400 bg-yellow-400/10';
      case 'RECHAZADO': return 'text-red-400 bg-red-400/10';
      case 'ANULADO': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'FIRMADO': return 'Firmado ✅';
      case 'PENDIENTE': return 'Pendiente ⏳';
      case 'RECHAZADO': return 'Rechazado ❌';
      case 'ANULADO': return 'Anulado ⚠️';
      default: return estado || 'Desconocido';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-orange-500 hover:text-orange-400">
              ← Volver
            </Link>
            <h1 className="text-2xl font-bold text-orange-500">Mis Documentos</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Hola, {user?.nombre}</span>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="text-gray-400 hover:text-white text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Filtros */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setFiltro('todos')}
            className={`px-4 py-2 rounded-lg transition ${
              filtro === 'todos' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro('pendientes')}
            className={`px-4 py-2 rounded-lg transition ${
              filtro === 'pendientes' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFiltro('firmados')}
            className={`px-4 py-2 rounded-lg transition ${
              filtro === 'firmados' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Firmados
          </button>
          <button
            onClick={() => setFiltro('rechazados')}
            className={`px-4 py-2 rounded-lg transition ${
              filtro === 'rechazados' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Rechazados
          </button>
        </div>

        {/* Lista de documentos */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400">Cargando documentos...</div>
          </div>
        ) : documentosFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-4xl mb-4">📄</div>
            <div className="text-gray-400">No tienes documentos {filtro !== 'todos' ? 'en este estado' : ''}</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {documentosFiltrados.map((doc) => (
              <div key={doc.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-orange-500 transition">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-gray-400">{doc.tipo}</span>
                      <h3 className="text-lg font-semibold">{doc.titulo}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(doc.estado_firma)}`}>
                        {getEstadoTexto(doc.estado_firma)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Versión {doc.version} • {new Date(doc.fecha_creacion).toLocaleDateString('es-CL')}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => descargarDocumento(doc.id, doc.titulo)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition text-sm"
                    >
                      📥 Descargar
                    </button>
                    {doc.estado_firma === 'PENDIENTE' && (
                      <button
                        onClick={() => setModalFirma(doc)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition text-sm"
                      >
                        ✍️ Firmar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 🔥 MODAL DE FIRMA */}
      {modalFirma && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-2 text-orange-500">Firmar Documento</h2>
            <p className="text-gray-300 mb-4">
              ¿Estás seguro que deseas firmar el documento <strong className="text-white">{modalFirma.titulo}</strong>?
            </p>
            <div className="text-sm text-gray-400 mb-4">
              <p>Tipo: {modalFirma.tipo}</p>
              <p>Fecha: {new Date(modalFirma.fecha_creacion).toLocaleDateString('es-CL')}</p>
              <p>Versión: {modalFirma.version}</p>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => firmarDocumento(modalFirma.id)}
                disabled={firmando}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition disabled:opacity-50"
              >
                {firmando ? 'Procesando...' : '✅ Confirmar Firma'}
              </button>
              <button
                onClick={() => {
                  const motivo = prompt('Ingresa el motivo del rechazo:');
                  if (motivo !== null) {
                    rechazarFirma(modalFirma.id, motivo);
                  }
                }}
                disabled={firmando}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition disabled:opacity-50"
              >
                ❌ Rechazar
              </button>
              <button
                onClick={() => setModalFirma(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}