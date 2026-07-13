import { createContext, useState, useContext, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Cargar token y usuario al iniciar
  useEffect(() => {
    console.log('🔄 AuthProvider - Inicializando...');
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    console.log('🔑 Token en localStorage:', storedToken ? '✅ SI' : '❌ NO');
    console.log('👤 User en localStorage:', storedUser ? '✅ SI' : '❌ NO');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        console.log('✅ Usuario cargado desde localStorage:', JSON.parse(storedUser).nombre);
      } catch (error) {
        console.error('❌ Error al parsear user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      console.log('❌ No hay credenciales en localStorage');
    }
    setLoading(false);
  }, []);

  const login = async (rut, password) => {
    console.log('📤 Iniciando login...');
    setLoading(true);
    
    try {
      console.log('📤 Enviando petición a:', client.defaults.baseURL + '/auth/login');
      
      const response = await client.post('/auth/login', { rut, password });
      console.log('📥 Respuesta del servidor:', response.data);
      
      const { token: newToken, user: userData } = response.data;
      
      if (!newToken || !userData) {
        throw new Error('No se recibieron credenciales válidas');
      }
      
      console.log('📥 Token recibido:', newToken.substring(0, 20) + '...');
      console.log('📥 User recibido:', userData.nombre, 'Rol:', userData.rol);
      
      // Guardar en localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('💾 Credenciales guardadas en localStorage');
      
      // Actualizar estado
      setToken(newToken);
      setUser(userData);
      console.log('💾 Estado actualizado');
      
      // Verificar
      console.log('🔍 Verificación - token:', localStorage.getItem('token') ? '✅' : '❌');
      console.log('🔍 Verificación - user:', localStorage.getItem('user') ? '✅' : '❌');
      
      setLoading(false);
      return { success: true, user: userData };
      
    } catch (error) {
      console.error('❌ ERROR en login:', error);
      console.error('❌ Response:', error.response?.data);
      setLoading(false);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al iniciar sesión' 
      };
    }
  };

  const logout = () => {
    console.log('🚪 Cerrando sesión');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // 🔥 isAuthenticated SIMPLIFICADO
  const isAuthenticated = () => {
    const hasToken = !!token && !!localStorage.getItem('token');
    const hasUser = !!user && !!localStorage.getItem('user');
    const result = hasToken && hasUser;
    console.log('🔐 isAuthenticated:', result);
    return result;
  };

  const hasRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.rol);
  };

  // Función para forzar recarga
  const refreshAuth = () => {
    console.log('🔄 refreshAuth - Recargando credenciales...');
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        console.log('✅ Credenciales recargadas');
        return true;
      } catch (error) {
        console.error('❌ Error al recargar:', error);
        return false;
      }
    }
    console.log('❌ No hay credenciales para recargar');
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      isAuthenticated,
      hasRole,
      refreshAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};