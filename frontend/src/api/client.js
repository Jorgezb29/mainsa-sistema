import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔗 API URL configurada:', API_URL);

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔥 Interceptor para agregar token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(`📤 ${config.method.toUpperCase()} ${config.url} - Token:`, token ? '✅ SI' : '❌ NO');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

// 🔥 Interceptor para manejar errores
client.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url} - ✅ OK`);
    return response;
  },
  (error) => {
    // Si no hay respuesta del servidor
    if (!error.response) {
      console.error('❌ Error de red o servidor no disponible');
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    console.error(`❌ Error ${status}:`, data?.error || data?.message || 'Error desconocido');

    // Solo redirigir si es 401 y NO estamos en login
    if (status === 401 && !window.location.pathname.includes('/login')) {
      console.log('🔒 401 - No autorizado, redirigiendo a login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Evitar múltiples redirecciones
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default client;