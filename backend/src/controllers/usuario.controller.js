import pool from '../config/database.js';
import { hashPassword } from '../utils/bcrypt.utils.js';

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, rut, nombre, correo, rol, turno, fecha_ingreso, activo, created_at 
             FROM usuario 
             ORDER BY nombre`
        );
        res.json({ success: true, usuarios: result.rows });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear usuario
export const crearUsuario = async (req, res) => {
    try {
        const { rut, nombre, correo, password, rol, turno, fecha_ingreso } = req.body;

        if (!rut || !nombre || !correo || !password || !rol || !turno || !fecha_ingreso) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // Verificar si ya existe
        const check = await pool.query(
            'SELECT * FROM usuario WHERE rut = $1 OR correo = $2',
            [rut, correo]
        );

        if (check.rows.length > 0) {
            return res.status(400).json({ error: 'RUT o correo ya registrado' });
        }

        const pwd_hash = await hashPassword(password);

        const result = await pool.query(
            `INSERT INTO usuario (rut, nombre, correo, pwd_hash, rol, turno, fecha_ingreso)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, rut, nombre, correo, rol, turno, fecha_ingreso, activo`,
            [rut, nombre, correo, pwd_hash, rol, turno, fecha_ingreso]
        );

        // Registrar log
        await pool.query(
            `INSERT INTO log_actividad (usuario_id, accion, entidad_tipo, entidad_id, ip_origen)
             VALUES ($1, $2, $3, $4, $5)`,
            [req.user.id, 'CREAR_USUARIO', 'USUARIO', result.rows[0].id, req.ip]
        );

        res.status(201).json({ success: true, usuario: result.rows[0] });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Editar usuario
export const editarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, correo, turno, rol } = req.body;

        const result = await pool.query(
            `UPDATE usuario 
             SET nombre = COALESCE($1, nombre),
                 correo = COALESCE($2, correo),
                 turno = COALESCE($3, turno),
                 rol = COALESCE($4, rol)
             WHERE id = $5
             RETURNING id, rut, nombre, correo, rol, turno, fecha_ingreso, activo`,
            [nombre, correo, turno, rol, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await pool.query(
            `INSERT INTO log_actividad (usuario_id, accion, entidad_tipo, entidad_id, ip_origen)
             VALUES ($1, $2, $3, $4, $5)`,
            [req.user.id, 'EDITAR_USUARIO', 'USUARIO', id, req.ip]
        );

        res.json({ success: true, usuario: result.rows[0] });
    } catch (error) {
        console.error('Error al editar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Desactivar usuario
export const desactivarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        // No permitir desactivarse a sí mismo
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ error: 'No puedes desactivar tu propia cuenta' });
        }

        const result = await pool.query(
            `UPDATE usuario SET activo = false WHERE id = $1
             RETURNING id, rut, nombre, activo`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await pool.query(
            `INSERT INTO log_actividad (usuario_id, accion, entidad_tipo, entidad_id, ip_origen)
             VALUES ($1, $2, $3, $4, $5)`,
            [req.user.id, 'DESACTIVAR_USUARIO', 'USUARIO', id, req.ip]
        );

        res.json({ success: true, usuario: result.rows[0] });
    } catch (error) {
        console.error('Error al desactivar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Cambiar rol (Solo Superadmin)
export const cambiarRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;

        if (!rol || !['TRABAJADOR', 'ADMIN_RRHH', 'SUPERADMIN'].includes(rol)) {
            return res.status(400).json({ error: 'Rol inválido' });
        }

        // No permitir cambiar el rol del único SUPERADMIN
        const adminCheck = await pool.query(
            'SELECT COUNT(*) FROM usuario WHERE rol = $1 AND activo = true',
            ['SUPERADMIN']
        );

        if (parseInt(adminCheck.rows[0].count) === 1) {
            const userCheck = await pool.query(
                'SELECT rol FROM usuario WHERE id = $1',
                [id]
            );
            if (userCheck.rows[0]?.rol === 'SUPERADMIN') {
                return res.status(400).json({ error: 'No puedes cambiar el rol del único Superadmin' });
            }
        }

        const result = await pool.query(
            `UPDATE usuario SET rol = $1 WHERE id = $2
             RETURNING id, rut, nombre, rol`,
            [rol, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await pool.query(
            `INSERT INTO log_actividad (usuario_id, accion, entidad_tipo, entidad_id, ip_origen)
             VALUES ($1, $2, $3, $4, $5)`,
            [req.user.id, 'CAMBIO_ROL', 'USUARIO', id, req.ip]
        );

        res.json({ success: true, usuario: result.rows[0] });
    } catch (error) {
        console.error('Error al cambiar rol:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};