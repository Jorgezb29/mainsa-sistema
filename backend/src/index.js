import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Importar rutas (con .js al final)
import authRoutes from './routes/auth.routes.js';
import documentoRoutes from './routes/documento.routes.js';
import firmaRoutes from './routes/firma.routes.js';
import notificacionRoutes from './routes/notificacion.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 CORS - Configuración para producción
app.use(cors({
    origin: '*', // Permite peticiones desde cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api', limiter);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/documentos', documentoRoutes);
app.use('/api/firmas', firmaRoutes);
app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/usuarios', usuarioRoutes);

// 🔥 RUTA RAÍZ - Para evitar "Cannot GET /"
app.get('/', (req, res) => {
    res.json({
        message: '🚀 MAINSA API - Sistema de Gestión Documental',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            login: '/api/auth/login',
            documentos: '/api/documentos/mis-documentos',
            notificaciones: '/api/notificaciones/mis-notificaciones',
            admin: '/api/usuarios',
            firmas: '/api/firmas/estado'
        },
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: err.message
    });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🏠 Home: http://localhost:${PORT}/`);
});