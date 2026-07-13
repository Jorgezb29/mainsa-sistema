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

// Middlewares
app.use(helmet());
app.use(cors());
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

// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});