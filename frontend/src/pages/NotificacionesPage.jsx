import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// ============================================================
// ICONOS SVG PROFESIONALES
// ============================================================

const IconArrowLeft = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
  </svg>
);

const IconBell = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
  </svg>
);

const IconLogout = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const IconDot = () => (
  <svg className="w-2 h-2" viewBox="0 0 10 10" fill="currentColor">
    <circle cx="5" cy="5" r="4" />
  </svg>
);

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

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
      await client.post(`/notificaciones/leer/${id}`);
      toast.success('Notificación marcada como leída');
      cargarNotificaciones();
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
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="bg-[#2a2a2a] px-4 py-4 flex justify-between items-center border-b border-[#333] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-500 hover:text-orange-500 transition">
            <IconArrowLeft />
          </Link>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Notificaciones</h2>
            {contarNoLeidas() > 0 && (
              <span className="bg-orange-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                {contarNoLeidas()} nuevas
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-300 text-sm hidden sm:inline">Hola, {user?.nombre}</span>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="text-gray-500 hover:text-orange-500 transition border border-[#333] px-3 py-1.5 rounded-lg text-xs hover:border-orange-500 flex items-center gap-1.5"
          >
            <IconLogout />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-4xl mx-auto">
        {/* Filtros */}
        <div className="flex gap-2 mb-6 flex-wrap border-b border-[#333] pb-3">
          <button
            onClick={() => setFiltro('todas')}
            className={`px-4 py-1.5 rounded-lg text-sm transition ${
              filtro === 'todas'
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#333]'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltro('no_leidas')}
            className={`px-4 py-1.5 rounded-lg text-sm transition ${
              filtro === 'no_leidas'
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#333]'
            }`}
          >
            No leídas
          </button>
          <button
            onClick={() => setFiltro('leidas')}
            className={`px-4 py-1.5 rounded-lg text-sm transition ${
              filtro === 'leidas'
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#333]'
            }`}
          >
            Leídas
          </button>
        </div>

        {/* Lista de notificaciones */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 text-sm">Cargando notificaciones...</div>
        ) : notificacionesFiltradas.length === 0 ? (
          <div className="text-center py-12 bg-[#2a2a2a] rounded-xl border border-[#333]">
            <div className="flex justify-center mb-3 text-gray-500">
              <IconBell />
            </div>
            <div className="text-gray-500 text-sm">No tienes notificaciones</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notificacionesFiltradas.map((notif) => (
              <div 
                key={notif.id} 
                className={`bg-[#2a2a2a] rounded-xl p-4 border transition cursor-pointer ${
                  !notif.leida 
                    ? 'border-orange-500/50 hover:border-orange-400' 
                    : 'border-[#333] hover:border-[#444]'
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
                    <div className="mt-1.5 text-orange-500">
                      <IconDot />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold">{notif.titulo}</h3>
                      {!notif.leida && (
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-medium">
                          Nueva
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mt-1 leading-relaxed">{notif.contenido}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                      <span>
                        {new Date(notif.created_at).toLocaleDateString('es-CL', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {notif.leida && (
                        <span className="flex items-center gap-1 text-green-400">
                          <IconCheck />
                          Leída
                        </span>
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