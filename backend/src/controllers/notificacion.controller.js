import pool from '../config/database.js';

// Crear notificación (Admin RRHH)
export const crearNotificacion = async (req, res) => {
    try {
        const { titulo, contenido, turno_destino, fecha_envio } = req.body;
        const creado_por = req.user.id;

        if (!titulo || !contenido || !turno_destino) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        const result = await pool.query(
            `INSERT INTO notificacion (titulo, contenido, turno_destino, fecha_envio, creado_por)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [titulo, contenido, turno_destino, fecha_envio || null, creado_por]
        );

        await pool.query(
            `INSERT INTO log_actividad (usuario_id, accion, entidad_tipo, entidad_id, ip_origen)
             VALUES ($1, $2, $3, $4, $5)`,
            [req.user.id, 'CREAR_NOTIFICACION', 'NOTIFICACION', result.rows[0].id, req.ip]
        );

        res.status(201).json({
            success: true,
            notificacion: result.rows[0]
        });

    } catch (error) {
        console.error('❌ Error al crear notificación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener notificaciones del trabajador
export const getMisNotificaciones = async (req, res) => {
    try {
        const userId = req.user.id;
        const turno = req.user.turno;

        console.log('🔔 Obteniendo notificaciones para:', userId, 'Turno:', turno);

        const result = await pool.query(
            `SELECT n.*, 
                CASE WHEN l.id IS NOT NULL THEN true ELSE false END as leida,
                l.fecha_lectura
             FROM notificacion n
             LEFT JOIN lectura_notificacion l 
                ON n.id = l.notificacion_id AND l.usuario_id = $1
             WHERE n.activo = true 
               AND (n.turno_destino = $2 OR n.turno_destino = 'TODOS')
               AND (n.fecha_envio IS NULL OR n.fecha_envio <= CURRENT_TIMESTAMP)
             ORDER BY n.created_at DESC`,
            [userId, turno]
        );

        console.log('🔔 Notificaciones encontradas:', result.rows.length);
        res.json({
            success: true,
            notificaciones: result.rows
        });

    } catch (error) {
        console.error('❌ Error al obtener notificaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Marcar notificación como leída
export const marcarLeida = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const check = await pool.query(
            'SELECT * FROM notificacion WHERE id = $1 AND activo = true',
            [id]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({ error: 'Notificación no disponible' });
        }

        await pool.query(
            `INSERT INTO lectura_notificacion (notificacion_id, usuario_id)
             VALUES ($1, $2)
             ON CONFLICT (notificacion_id, usuario_id) DO NOTHING`,
            [id, userId]
        );

        res.json({
            success: true,
            message: 'Notificación marcada como leída'
        });

    } catch (error) {
        console.error('❌ Error al marcar como leída:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar notificación (baja lógica - Admin RRHH)
export const eliminarNotificacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;

        if (!motivo) {
            return res.status(400).json({ error: 'Motivo de eliminación es requerido' });
        }

        await pool.query(
            'UPDATE notificacion SET activo = false WHERE id = $1',
            [id]
        );

        await pool.query(
            `INSERT INTO log_actividad (usuario_id, accion, entidad_tipo, entidad_id, ip_origen)
             VALUES ($1, $2, $3, $4, $5)`,
            [req.user.id, 'ELIMINAR_NOTIFICACION', 'NOTIFICACION', id, req.ip]
        );

        res.json({
            success: true,
            message: 'Notificación eliminada'
        });

    } catch (error) {
        console.error('❌ Error al eliminar notificación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener notificaciones para admin
export const getAllNotificaciones = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT n.*, 
                u.nombre as creador,
                (SELECT COUNT(*) FROM lectura_notificacion WHERE notificacion_id = n.id) as lecturas
             FROM notificacion n
             JOIN usuario u ON n.creado_por = u.id
             WHERE n.activo = true
             ORDER BY n.created_at DESC`
        );

        res.json({
            success: true,
            notificaciones: result.rows
        });

    } catch (error) {
        console.error('❌ Error al obtener notificaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};