import express from 'express';
import { login, recoverPassword } from '../controllers/auth.controller.js';

const router = express.Router();

// Ruta de login
router.post('/login', login);

// Ruta de recuperación de contraseña
router.post('/recover', recoverPassword);

export default router;  // ✅ IMPORTANTE: debe tener export default