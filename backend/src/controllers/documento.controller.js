import pool from '../config/database.js';

// Obtener documentos del trabajador autenticado
export const getMisDocumentos = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('📄 Obteniendo documentos para usuario:', userId);

        const result = await pool.query(
            `SELECT d.*, f.estado as estado_firma, f.timestamp as fecha_firma
             FROM documento d
             LEFT JOIN firma_digital f ON d.id = f.documento_id
             WHERE d.usuario_id = $1 AND d.activo = true
             ORDER BY d.fecha_creacion DESC`,
            [userId]
        );

        console.log('📄 Documentos encontrados:', result.rows.length);
        res.json({
            success: true,
            documentos: result.rows
        });

    } catch (error) {
        console.error('❌ Error al obtener documentos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener todos los documentos (Admin RRHH)
export const getAllDocumentos = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT d.*, u.nombre as trabajador, u.rut as trabajador_rut,
                    f.estado as estado_firma
             FROM documento d
             JOIN usuario u ON d.usuario_id = u.id
             LEFT JOIN firma_digital f ON d.id = f.documento_id
             WHERE d.activo = true
             ORDER BY d.fecha_creacion DESC`
        );

        res.json({
            success: true,
            documentos: result.rows
        });

    } catch (error) {
        console.error('Error al obtener documentos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Cargar documento (Admin RRHH)
export const cargarDocumento = async (req, res) => {
    try {
        const { tipo, titulo, usuario_id } = req.body;
        const subido_por = req.user.id;

        if (!tipo || !titulo || !usuario_id) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // Verificar que el usuario exista
        const userCheck = await pool.query(
            'SELECT * FROM usuario WHERE id = $1',
            [usuario_id]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Trabajador no encontrado' });
        }

        const ruta_archivo = `documentos/${Date.now()}_${titulo.replace(/\s/g, '_')}.pdf`;

        const result = await pool.query(
            `INSERT INTO documento (tipo, titulo, ruta_archivo, usuario_id, subido_por)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [tipo, titulo, ruta_archivo, usuario_id, subido_por]
        );

        // Crear registro de firma pendiente
        await pool.query(
            `INSERT INTO firma_digital (estado, documento_id, usuario_id)
             VALUES ('PENDIENTE', $1, $2)`,
            [result.rows[0].id, usuario_id]
        );

        // Registrar log
        await pool.query(
            `INSERT INTO log_actividad (usuario_id, accion, entidad_tipo, entidad_id, ip_origen)
             VALUES ($1, $2, $3, $4, $5)`,
            [req.user.id, 'CARGA_DOCUMENTO', 'DOCUMENTO', result.rows[0].id, req.ip]
        );

        res.status(201).json({
            success: true,
            documento: result.rows[0]
        });

    } catch (error) {
        console.error('Error al cargar documento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Descargar documento (registra en log)
export const descargarDocumento = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await pool.query(
            'SELECT * FROM documento WHERE id = $1 AND activo = true',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Documento no disponible' });
        }

        // Registrar descarga
        await pool.query(
            `INSERT INTO log_actividad (usuario_id, accion, entidad_tipo, entidad_id, ip_origen)
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, 'DESCARGA_DOCUMENTO', 'DOCUMENTO', id, req.ip]
        );

        res.json({
            success: true,
            message: 'Descarga registrada',
            documento: result.rows[0]
        });

    } catch (error) {
        console.error('Error al descargar documento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};