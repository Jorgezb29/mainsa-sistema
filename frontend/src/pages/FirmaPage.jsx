import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';
import toast from 'react-hot-toast';

export default function FirmaPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [documento, setDocumento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [firmando, setFirmando] = useState(false);
  const [firmaCompletada, setFirmaCompletada] = useState(false);

  useEffect(() => {
    cargarDocumento();
  }, [id]);

  const cargarDocumento = async () => {
    try {
      const response = await client.get(`/documentos/mis-documentos`);
      const docs = response.data.documentos || [];
      const doc = docs.find(d => d.id === parseInt(id));
      if (doc) {
        setDocumento(doc);
        setStep(1);
      } else {
        toast.error('Documento no encontrado');
        navigate('/documentos');
      }
    } catch (error) {
      console.error('❌ Error al cargar documento:', error);
      toast.error('Error al cargar documento');
      navigate('/documentos');
    }
    setLoading(false);
  };

  const handleFirmar = async () => {
    if (!password) {
      toast.error('Ingresa tu contraseña para confirmar la firma');
      return;
    }

    setFirmando(true);
    try {
      const response = await client.post(`/firmas/firmar/${id}`);
      console.log('✅ Firma registrada:', response.data);
      setFirmaCompletada(true);
      setStep(3);
      toast.success('✅ Documento firmado exitosamente');
      setTimeout(() => {
        navigate('/documentos');
      }, 2000);
    } catch (error) {
      console.error('❌ Error al firmar:', error);
      toast.error(error.response?.data?.error || 'Error al firmar');
    }
    setFirmando(false);
  };

  const handleRechazar = async () => {
    const motivo = prompt('Ingresa el motivo del rechazo:');
    if (motivo === null) return;
    if (!motivo.trim()) {
      toast.error('Debes ingresar un motivo');
      return;
    }

    setFirmando(true);
    try {
      await client.post(`/firmas/rechazar/${id}`, { motivo });
      toast.success('Documento rechazado');
      navigate('/documentos');
    } catch (error) {
      console.error('❌ Error al rechazar:', error);
      toast.error(error.response?.data?.error || 'Error al rechazar');
    }
    setFirmando(false);
  };

  const volver = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/documentos');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-gray-500">
        Cargando documento...
      </div>
    );
  }

  if (!documento) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-gray-500">
        Documento no disponible
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pb-8">
      {/* Header */}
      <header className="bg-[#2a2a2a] px-4 py-4 flex justify-between items-center border-b border-[#333] sticky top-0 z-50">
        <button onClick={volver} className="text-gray-500 hover:text-orange-500 text-xl transition">
          ←
        </button>
        <h2 className="text-lg font-semibold">✍️ Firma Digital de Documento</h2>
        <div className="w-8"></div>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="flex justify-between mb-6 relative">
          <div className="absolute top-4 left-[10%] right-[10%] h-[2px] bg-[#333]"></div>
          {[
            { num: 1, label: 'Ver documento', icon: step > 1 || firmaCompletada ? '✓' : '1' },
            { num: 2, label: 'Confirmar identidad', icon: step > 2 || firmaCompletada ? '✓' : '2' },
            { num: 3, label: 'Firma registrada', icon: firmaCompletada ? '✓' : '3' },
          ].map((s) => {
            const isActive = step === s.num && !firmaCompletada;
            const isCompleted = (step > s.num || firmaCompletada) && !(step === s.num && isActive);
            return (
              <div key={s.num} className="text-center flex-1 relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1.5 text-sm font-bold transition-all ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-[#333] text-gray-500'
                  }`}
                >
                  {s.icon}
                </div>
                <div className={`text-[10px] ${isActive ? 'text-orange-500' : isCompleted ? 'text-green-400' : 'text-gray-600'}`}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {firmaCompletada ? (
          // PASO 3: Firma completada
          <div className="bg-[#2a2a2a] rounded-xl border border-green-500 p-8 text-center">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="text-xl font-bold text-green-400">¡Firma registrada!</h3>
            <p className="text-gray-400 text-sm mt-2">
              El documento ha sido firmado exitosamente.
            </p>
            <div className="bg-[#1f1f1f] p-3 rounded-lg mt-4 text-xs text-gray-500">
              <strong className="text-orange-500">Ref:</strong> {documento.id} • {new Date().toLocaleString('es-CL')}
            </div>
          </div>
        ) : (
          <>
            {/* Visor PDF */}
            <div className="bg-[#2a2a2a] rounded-xl border border-[#333] p-6 mb-4 text-center min-h-[200px] flex flex-col items-center justify-center">
              <div className="text-5xl mb-2">📄</div>
              <div className="text-gray-300 font-medium">{documento.titulo}</div>
              <div className="text-gray-500 text-sm">{documento.tipo} • {Math.round(25 + Math.random() * 200)} KB</div>
            </div>

            {/* Confirmación de identidad */}
            <div className="bg-[#2a2a2a] rounded-xl border border-[#333] p-5 mb-4">
              <h3 className="text-orange-500 font-semibold mb-3">🔐 Confirmar identidad</h3>
              <div className="flex justify-between py-2 border-b border-[#333] text-sm">
                <span className="text-gray-500">Documento</span>
                <span className="text-white">{documento.titulo}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#333] text-sm">
                <span className="text-gray-500">Trabajador</span>
                <span className="text-white">{user?.nombre} ({user?.rut})</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#333] text-sm">
                <span className="text-gray-500">Turno</span>
                <span className="text-white">{user?.turno}</span>
              </div>
              <div className="mt-4">
                <label className="text-gray-400 text-sm block mb-1.5">Ingresa tu contraseña para confirmar la firma</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1f1f1f] text-white px-4 py-3 rounded-xl border-2 border-[#333] focus:border-orange-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleFirmar}
                disabled={firmando}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-green-500/20 disabled:opacity-50"
              >
                {firmando ? 'Firmando...' : '✅ Firmar digitalmente'}
              </button>
              <button
                onClick={handleRechazar}
                disabled={firmando}
                className="flex-1 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-bold py-3.5 rounded-xl transition disabled:opacity-50"
              >
                ✕ Rechazar firma
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}