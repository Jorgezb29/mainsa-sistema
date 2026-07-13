import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import client from '../api/client';

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
      {/* ============================================================ */}
      {/* HEADER - IDÉNTICO AL ADMIN */}
      {/* ============================================================ */}
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
          className="bg-transparent border border-[#444] text-gray-500 px-3 py-1.5 rounded-lg text-xs hover:border-orange-500 hover:text-orange-500 transition"
        >
          Cerrar Sesión
        </button>
      </header>

      {/* ============================================================ */}
      {/* CONTENIDO - MISMO ESTILO QUE ADMIN */}
      {/* ============================================================ */}
      <main className="p-4 sm:p-6 max-w-6xl mx-auto">
        
        {/* Título - igual que Admin */}
        <h2 className="text-xl mb-5">
          📊 <span className="text-orange-500">Dashboard</span> Trabajador
        </h2>

        {/* Tarjetas de estadísticas - MISMO ESTILO QUE ADMIN */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#333]">
            <div className="text-2xl font-bold text-orange-500">{documentosPendientes}</div>
            <div className="text-sm text-gray-500 mt-1">📄 Documentos pendientes</div>
          </div>
          <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#333]">
            <div className="text-2xl font-bold text-orange-500">{notificacionesNoLeidas}</div>
            <div className="text-sm text-gray-500 mt-1">🔔 Notificaciones no leídas</div>
          </div>
          <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#333]">
            <div className="text-2xl font-bold text-orange-500">0</div>
            <div className="text-sm text-gray-500 mt-1">📋 Mis documentos</div>
          </div>
          <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#333]">
            <div className="text-2xl font-bold text-orange-500">1</div>
            <div className="text-sm text-gray-500 mt-1">📜 Certificados</div>
          </div>
        </div>

        {/* Menú de acciones - MISMO ESTILO QUE ADMIN */}
        <div className="bg-[#2a2a2a] rounded-xl border border-[#333] overflow-hidden">
          <div className="p-4 border-b border-[#333]">
            <h3 className="text-sm font-medium">🚀 Acciones rápidas</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            
            <Link 
              to="/documentos" 
              className="bg-[#1f1f1f] rounded-xl p-4 hover:bg-[#333] transition border border-[#333] hover:border-orange-500 text-center"
            >
              <div className="text-3xl mb-2">📄</div>
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
              <div className="text-3xl mb-2">✍️</div>
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
              <div className="text-3xl mb-2">🔔</div>
              <h4 className="text-sm font-semibold">Notificaciones</h4>
              <p className="text-gray-500 text-xs mt-1">Mensajes importantes</p>
            </Link>

            <div className="bg-[#1f1f1f] rounded-xl p-4 hover:bg-[#333] transition border border-[#333] hover:border-orange-500 text-center cursor-pointer">
              <div className="text-3xl mb-2">📜</div>
              <h4 className="text-sm font-semibold">Certificado</h4>
              <p className="text-gray-500 text-xs mt-1">Descargar</p>
            </div>
          </div>
        </div>

        {/* Panel Admin - MISMO ESTILO QUE ADMIN */}
        {(user?.rol === 'ADMIN_RRHH' || user?.rol === 'SUPERADMIN') && (
          <div className="mt-6">
            <Link 
              to="/admin" 
              className="block bg-[#2a2a2a] rounded-xl p-5 border border-purple-700 hover:border-purple-500 transition text-center hover:bg-[#333]"
            >
              <div className="text-2xl mb-1">👨‍💼</div>
              <h3 className="text-base font-semibold text-purple-400">Panel de Administración</h3>
              <p className="text-gray-500 text-sm">Gestionar documentos, usuarios y notificaciones</p>
            </Link>
          </div>
        )}
        
      </main>
    </div>
  );
}