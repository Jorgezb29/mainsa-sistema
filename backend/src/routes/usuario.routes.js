import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import {
    getUsuarios,
    crearUsuario,
    editarUsuario,
    desactivarUsuario,
    cambiarRol
} from '../controllers/usuario.controller.js';

const router = express.Router();

// Rutas para Admin RRHH y Superadmin
router.get('/', authenticate, requireRole(['ADMIN_RRHH', 'SUPERADMIN']), getUsuarios);
router.post('/crear', authenticate, requireRole(['ADMIN_RRHH', 'SUPERADMIN']), crearUsuario);
router.put('/editar/:id', authenticate, requireRole(['ADMIN_RRHH', 'SUPERADMIN']), editarUsuario);
router.delete('/desactivar/:id', authenticate, requireRole(['ADMIN_RRHH', 'SUPERADMIN']), desactivarUsuario);

// Solo Superadmin
router.put('/rol/:id', authenticate, requireRole(['SUPERADMIN']), cambiarRol);

export default router;  // ✅ IMPORTANTE