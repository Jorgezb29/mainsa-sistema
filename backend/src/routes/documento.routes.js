import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import {
    getMisDocumentos,
    getAllDocumentos,
    cargarDocumento,
    descargarDocumento
} from '../controllers/documento.controller.js';

const router = express.Router();

// Rutas para trabajador
router.get('/mis-documentos', authenticate, getMisDocumentos);
router.get('/descargar/:id', authenticate, descargarDocumento);

// Rutas para Admin RRHH
router.get('/all', authenticate, requireRole(['ADMIN_RRHH', 'SUPERADMIN']), getAllDocumentos);
router.post('/cargar', authenticate, requireRole(['ADMIN_RRHH', 'SUPERADMIN']), cargarDocumento);

export default router;