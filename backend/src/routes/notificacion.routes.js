import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import {
    crearNotificacion,
    getMisNotificaciones,
    marcarLeida,
    eliminarNotificacion,
    getAllNotificaciones
} from '../controllers/notificacion.controller.js';

const router = express.Router();

// Rutas para trabajador
router.get('/mis-notificaciones', authenticate, getMisNotificaciones);
router.post('/leer/:id', authenticate, marcarLeida);

// Rutas para Admin RRHH
router.get('/all', authenticate, requireRole(['ADMIN_RRHH', 'SUPERADMIN']), getAllNotificaciones);
router.post('/crear', authenticate, requireRole(['ADMIN_RRHH', 'SUPERADMIN']), crearNotificacion);
router.delete('/eliminar/:id', authenticate, requireRole(['ADMIN_RRHH', 'SUPERADMIN']), eliminarNotificacion);

export default router;