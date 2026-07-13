import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import client from '../api/client';

// ============================================================
// ICONOS SVG PROFESIONALES
// ============================================================

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

const IconFile = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v6h6" />
  </svg>
);

const IconBell = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
  </svg>
);

const IconLogout = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const IconUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconRocket = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
  </svg>
);

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function HomePage() {
  const { user, logout } = useAuth();
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0);
  const [documentosPendientes, setDocumentosPendientes] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const notifRes = await client.get('/notificaciones/mis-notificaciones');
        const noLeidas = notifRes.data.notificaciones?.filter(n => !n.leida).length || 0;
        setNotificacionesNoLeidas(noLeidas);

        const docRes = await client.get('/documentos/mis-documentos');
        const pendientes = docRes.data.documentos?.filter(d => d.estado_firma === 'PENDIENTE').length || 0;
        setDocumentosPendientes(pendientes);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    cargarDatos();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="bg-[#2a2a2a] px-4 py-3 flex justify-between items-center border-b border-[#333] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center font-bold text-sm">
            {user?.nombre?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="text-sm font-medium">{user?.nombre || 'Usuario'}</div>
            <div className="text-[11px] text-gray-500">
              Turno: {user?.turno || 'N/A'} · {user?.rol || 'TRABAJADOR'}
            </div>
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

      <main className="p-4 sm:p-6 max-w-6xl mx-auto">
        
        {/* Título */}
        <h2 className="text-xl mb-5 font-semibold tracking-wide">
          <span className="text-orange-500">Dashboard</span> Trabajador
        </h2>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#333]">
            <div className="text-2xl font-bold text-orange-500">{documentosPendientes}</div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <IconDocument />
              <span>Documentos pendientes</span>
            </div>
          </div>
          <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#333]">
            <div className="text-2xl font-bold text-orange-500">{notificacionesNoLeidas}</div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <IconBell />
              <span>Notificaciones no leídas</span>
            </div>
          </div>
          <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#333]">
            <div className="text-2xl font-bold text-orange-500">0</div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <IconFile />
              <span>Mis documentos</span>
            </div>
          </div>
          <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#333]">
            <div className="text-2xl font-bold text-orange-500">1</div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <IconCheck />
              <span>Certificados</span>
            </div>
          </div>
        </div>

        {/* Menú de acciones rápidas */}
        <div className="bg-[#2a2a2a] rounded-xl border border-[#333] overflow-hidden">
          <div className="p-4 border-b border-[#333]">
            <h3 className="text-sm font-medium tracking-wide">Acciones rápidas</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            
            <Link 
              to="/documentos" 
              className="bg-[#1f1f1f] rounded-xl p-4 hover:bg-[#333] transition border border-[#333] hover:border-orange-500 text-center"
            >
              <div className="flex justify-center mb-2 text-orange-400">
                <IconDocument />
              </div>
              <h4 className="text-sm font-semibold">Mis Documentos</h4>
              <p className="text-gray-500 text-xs mt-1">Ver y firmar</p>
            </Link>

            <Link 
              to="/documentos?filtro=pendientes" 
              className="bg-[#1f1f1f] rounded-xl p-4 hover:bg-[#333] transition border border-[#333] hover:border-orange-500 text-center relative"
            >
              {documentosPendientes > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {documentosPendientes}
                </div>
              )}
              <div className="flex justify-center mb-2 text-orange-400">
                <IconCheck />
              </div>
              <h4 className="text-sm font-semibold">Por Firmar</h4>
              <p className="text-gray-500 text-xs mt-1">{documentosPendientes} pendientes</p>
            </Link>

            <Link 
              to="/notificaciones" 
              className="bg-[#1f1f1f] rounded-xl p-4 hover:bg-[#333] transition border border-[#333] hover:border-orange-500 text-center relative"
            >
              {notificacionesNoLeidas > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {notificacionesNoLeidas}
                </div>
              )}
              <div className="flex justify-center mb-2 text-orange-400">
                <IconBell />
              </div>
              <h4 className="text-sm font-semibold">Notificaciones</h4>
              <p className="text-gray-500 text-xs mt-1">Mensajes importantes</p>
            </Link>

            <div className="bg-[#1f1f1f] rounded-xl p-4 hover:bg-[#333] transition border border-[#333] hover:border-orange-500 text-center cursor-pointer">
              <div className="flex justify-center mb-2 text-orange-400">
                <IconRocket />
              </div>
              <h4 className="text-sm font-semibold">Certificado</h4>
              <p className="text-gray-500 text-xs mt-1">Descargar</p>
            </div>
          </div>
        </div>

        {/* Panel Admin */}
        {(user?.rol === 'ADMIN_RRHH' || user?.rol === 'SUPERADMIN') && (
          <div className="mt-6">
            <Link 
              to="/admin" 
              className="block bg-[#2a2a2a] rounded-xl p-5 border border-purple-700 hover:border-purple-500 transition text-center hover:bg-[#333]"
            >
              <div className="flex justify-center mb-1">
                <IconUser />
              </div>
              <h3 className="text-base font-semibold text-purple-400">Panel de Administración</h3>
              <p className="text-gray-500 text-sm">Gestionar documentos, usuarios y notificaciones</p>
            </Link>
          </div>
        )}
        
      </main>
    </div>
  );
}