import pool from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req, res) => {
    console.log('📥 1. Llegó la petición');
    
    try {
        const { rut, password } = req.body;
        console.log('📥 2. RUT recibido:', rut);

        if (!rut || !password) {
            console.log('❌ Faltan campos');
            return res.status(400).json({ error: 'RUT y contraseña son requeridos' });
        }

        console.log('📥 3. Buscando en la base de datos...');
        
        const result = await pool.query('SELECT * FROM usuario WHERE rut = $1', [rut]);
        console.log('📥 4. Resultado de la consulta:', result.rows.length);

        if (result.rows.length === 0) {
            console.log('❌ Usuario no encontrado');
            return res.status(401).json({ error: 'Usuario no registrado' });
        }

        const user = result.rows[0];
        console.log('📥 5. Usuario encontrado:', user.nombre);

        // Verificar contraseña
        const isValid = await bcrypt.compare(password, user.pwd_hash);
        console.log('🔐 Contraseña válida:', isValid);

        if (!isValid) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // 🔥 Generar token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                rut: user.rut, 
                rol: user.rol,
                nombre: user.nombre,
                turno: user.turno
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
        );

        console.log('✅ Token generado:', token.substring(0, 30) + '...');

        // 🔥 RESPONDER CON EL FORMATO QUE ESPERA EL FRONTEND
        res.json({
            success: true,
            token: token,
            user: {
                id: user.id,
                rut: user.rut,
                nombre: user.nombre,
                correo: user.correo,
                rol: user.rol,
                turno: user.turno
            }
        });

    } catch (error) {
        console.error('❌ ERROR en login:', error.message);
        res.status(500).json({ 
            error: 'Error interno del servidor', 
            details: error.message 
        });
    }
};

export const recoverPassword = async (req, res) => {
    res.json({ message: 'Recuperación de contraseña' });
};