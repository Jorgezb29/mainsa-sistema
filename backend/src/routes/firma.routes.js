import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import {
    firmarDocumento,
    rechazarFirma,
    anularFirma,
    getEstadoFirmas
} from '../controllers/firma.controller.js';

const router = express.Router();

// Rutas para trabajador
router.post('/firmar/:id', authenticate, firmarDocumento);
router.post('/rechazar/:id', authenticate, rechazarFirma);

// Rutas para Admin RRHH
router.get('/estado', authenticate, requireRole(['ADMIN_RRHH', 'SUPERADMIN']), getEstadoFirmas);
router.post('/anular/:id', authenticate, requireRole(['ADMIN_RRHH', 'SUPERADMIN']), anularFirma);

export default router;