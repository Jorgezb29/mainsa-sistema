import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [rut, setRut] = useState('12.345.678-9');
  const [password, setPassword] = useState('password123');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Formatear RUT automáticamente
  const formatRut = (value) => {
    let clean = value.replace(/[^0-9kK]/g, '');
    if (clean.length > 1) {
      let rut = clean.slice(0, -1);
      let dv = clean.slice(-1);
      let formatted = '';
      for (let i = rut.length - 1, j = 0; i >= 0; i--, j++) {
        formatted = rut[i] + formatted;
        if (j % 3 === 2 && i > 0) formatted = '.' + formatted;
      }
      return formatted + '-' + dv.toUpperCase();
    }
    return clean;
  };

  const handleRutChange = (e) => {
    const formatted = formatRut(e.target.value);
    setRut(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Limpiar RUT para enviar (sin puntos y con guion)
    const cleanRut = rut.replace(/\./g, '');

    const result = await login(cleanRut, password);

    if (result.success) {
      toast.success('¡Bienvenido!');
      navigate('/', { replace: true });
    } else {
      setError(result.error || 'RUT o contraseña incorrectos.');
      toast.error(result.error || 'Error al iniciar sesión');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradientes de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_20%_50%,rgba(255,107,0,0.1)_0%,transparent_60%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_80%_50%,rgba(255,107,0,0.05)_0%,transparent_60%)]"></div>
      </div>

      <div className="bg-[#2a2a2a] rounded-2xl p-8 sm:p-10 max-w-md w-full shadow-2xl border border-orange-500/10 relative">
        {/* Línea superior animada */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-[length:200%_100%] animate-[gradientMove_3s_ease_infinite] rounded-t-2xl"></div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
            <span className="text-4xl font-black text-white">M⛏️</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            MAIN<span className="text-orange-500">SA</span>
          </h1>
          <p className="text-gray-500 text-xs tracking-widest mt-1">
            SISTEMA DE GESTIÓN DOCUMENTAL
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-3 rounded-lg mb-5 flex items-center gap-3 text-sm">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Campo RUT */}
          <div className="mb-5">
            <label className="block text-gray-300 text-sm font-semibold mb-1.5">
              RUT
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">👤</span>
              <input
                type="text"
                value={rut}
                onChange={handleRutChange}
                placeholder="12.345.678-9"
                className="w-full bg-[#1f1f1f] text-white pl-12 pr-4 py-3.5 rounded-xl border-2 border-[#333] focus:border-orange-500 focus:outline-none focus:shadow-[0_0_0_4px_rgba(255,107,0,0.1)] transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className="mb-5">
            <label className="block text-gray-300 text-sm font-semibold mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full bg-[#1f1f1f] text-white pl-12 pr-12 py-3.5 rounded-xl border-2 border-[#333] focus:border-orange-500 focus:outline-none focus:shadow-[0_0_0_4px_rgba(255,107,0,0.1)] transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition text-lg"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Opciones */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
            <label className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 accent-orange-500 rounded border-gray-600 bg-[#1f1f1f]"
              />
              Recordarme
            </label>
            <a href="#" className="text-orange-500 text-sm font-medium hover:text-orange-400 hover:underline transition">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 min-h-[52px]"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            ) : (
              'INGRESAR'
            )}
          </button>
        </form>

        {/* Demo Hint */}
        <div className="mt-4 bg-orange-500/5 border border-dashed border-orange-500/20 rounded-lg py-2 px-3 text-center">
          <span className="text-gray-500 text-xs">
            💡 Demo: <code className="text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded text-xs">RUT: 12.345.678-9</code>
            {' '}<code className="text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded text-xs">Contraseña: 123456</code>
          </span>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 pt-5 border-t border-[#333]">
          <p className="text-gray-500 text-xs">Sistema de Gestión Documental Laboral v1.0</p>
          <p className="text-gray-600 text-[11px] mt-1">MAINSA - Faena Minera © 2026</p>
          <p className="text-gray-600 text-[11px] mt-1">
            ¿Problemas? Contacta a <a href="#" className="text-orange-500 hover:text-orange-400 transition">soporte@mainsa.cl</a>
          </p>
        </div>
      </div>
    </div>
  );
}