import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function NotificacionesPage() {
  const { user } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas');

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    setLoading(true);
    try {
      const response = await client.get('/notificaciones/mis-notificaciones');
      console.log('🔔 Notificaciones recibidas:', response.data);
      setNotificaciones(response.data.notificaciones || []);
    } catch (error) {
      console.error('❌ Error al cargar notificaciones:', error);
      toast.error('Error al cargar notificaciones');
    }
    setLoading(false);
  };

  const marcarLeida = async (id) => {
    try {
      const response = await client.post(`/notificaciones/leer/${id}`);
      console.log('📖 Notificación marcada como leída:', response.data);
      cargarNotificaciones(); // Recargar
    } catch (error) {
      console.error('❌ Error al marcar como leída:', error);
      toast.error('Error al marcar como leída');
    }
  };

  const notificacionesFiltradas = notificaciones.filter(n => {
    if (filtro === 'todas') return true;
    if (filtro === 'no_leidas') return !n.leida;
    if (filtro === 'leidas') return n.leida;
    return true;
  });

  const contarNoLeidas = () => {
    return notificaciones.filter(n => !n.leida).length;
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
            <h1 className="text-2xl font-bold text-orange-500">Notificaciones</h1>
            {contarNoLeidas() > 0 && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {contarNoLeidas()} nuevas
              </span>
            )}
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
            onClick={() => setFiltro('todas')}
            className={`px-4 py-2 rounded-lg transition ${
              filtro === 'todas' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltro('no_leidas')}
            className={`px-4 py-2 rounded-lg transition ${
              filtro === 'no_leidas' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            No leídas
          </button>
          <button
            onClick={() => setFiltro('leidas')}
            className={`px-4 py-2 rounded-lg transition ${
              filtro === 'leidas' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Leídas
          </button>
        </div>

        {/* Lista de notificaciones */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400">Cargando notificaciones...</div>
          </div>
        ) : notificacionesFiltradas.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-4xl mb-4">🔔</div>
            <div className="text-gray-400">No tienes notificaciones</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {notificacionesFiltradas.map((notif) => (
              <div 
                key={notif.id} 
                className={`bg-gray-800 rounded-lg p-4 border transition cursor-pointer ${
                  !notif.leida 
                    ? 'border-orange-500 hover:border-orange-400' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => {
                  if (!notif.leida) {
                    marcarLeida(notif.id);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Indicador de no leída */}
                  {!notif.leida && (
                    <div className="w-2 h-2 mt-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                  )}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{notif.titulo}</h3>
                      {!notif.leida && (
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                          Nueva
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 mt-1">{notif.contenido}</p>
                    <div className="text-sm text-gray-400 mt-2">
                      {new Date(notif.created_at).toLocaleDateString('es-CL', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {notif.leida && (
                        <span className="ml-3 text-green-400">✓ Leída</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}