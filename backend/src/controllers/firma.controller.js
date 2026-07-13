import pool from '../config/database.js';
import crypto from 'crypto';

// Firmar documento
export const firmarDocumento = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const ip = req.ip || req.connection.remoteAddress;

        console.log('✍️ Firmando documento:', id, 'Usuario:', userId);

        // Verificar que el documento existe y está pendiente
        const docCheck = await pool.query(
            `SELECT d.*, f.id as firma_id, f.estado as estado_firma
             FROM documento d
             JOIN firma_digital f ON d.id = f.documento_id
             WHERE d.id = $1 AND d.usuario_id = $2 AND d.activo = true`,
            [id, userId]
        );

        if (docCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Documento no disponible para firma' });
        }

        const doc = docCheck.rows[0];

        if (doc.estado_firma !== 'PENDIENTE') {
            return res.status(400).json({ error: 'Documento ya fue firmado o rechazado' });
        }

        // Generar hash del documento (simulado)
        const hashDocumento = crypto
            .createHash('sha256')
            .update(`${doc.titulo}-${doc.id}-${Date.now()}`)
            .digest('hex');

        // Actualizar firma
        await pool.query(
            `UPDATE firma_digital 
             SET estado = 'FIRMADO', 
                 timestamp = CURRENT_TIMESTAMP, 
                 ip_origen = $1,
                 hash_documento = $2
             WHERE id = $3`,
            [ip, hashDocumento, doc.firma_id]
        );

        // Registrar log
        await pool.query(
            `INSERT INTO log_actividad (usuario_id, accion, entidad_tipo, entidad_id, ip_origen)
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, 'FIRMA_DOCUMENTO', 'FIRMA_DIGITAL', doc.firma_id, ip]
        );

        console.log('✅ Documento firmado exitosamente:', id);

        res.json({
            success: true,
            message: 'Documento firmado exitosamente',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error al firmar:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Rechazar firma
export const rechazarFirma = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;
        const userId = req.user.id;
        const ip = req.ip || req.connection.remoteAddress;

        if (!motivo) {
            return res.status(400).json({ error: 'Motivo de rechazo es requerido' });
        }

        const docCheck = await pool.query(
            `SELECT f.id as firma_id, f.estado as estado_firma
             FROM documento d
             JOIN firma_digital f ON d.id = f.documento_id
             WHERE d.id = $1 AND d.usuario_id = $2 AND d.activo = true`,
            [id, userId]
        );

        if (docCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Documento no disponible' });
        }

        const doc = docCheck.rows[0];

        if (doc.estado_firma !== 'PENDIENTE') {
            return res.status(400).json({ error: 'Documento ya fue firmado o rechazado' });
        }

        await pool.query(
            `UPDATE firma_digital 
             SET estado = 'RECHAZADO', 
                 timestamp = CURRENT_TIMESTAMP, 
                 ip_origen = $1,
                 motivo_rechazo = $2
             WHERE id = $3`,
            [ip, motivo, doc.firma_id]
        );

        await pool.query(
            `INSERT INTO log_actividad (usuario_id, accion, entidad_tipo, entidad_id, ip_origen)
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, 'RECHAZO_FIRMA', 'FIRMA_DIGITAL', doc.firma_id, ip]
        );

        res.json({
            success: true,
            message: 'Firma rechazada'
        });

    } catch (error) {
        console.error('❌ Error al rechazar firma:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Anular firma (Admin RRHH)
export const anularFirma = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;
        const userId = req.user.id;
        const ip = req.ip || req.connection.remoteAddress;

        if (!motivo) {
            return res.status(400).json({ error: 'Motivo de anulación es requerido' });
        }

        const result = await pool.query(
            `SELECT * FROM firma_digital WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Firma no encontrada' });
        }

        const firma = result.rows[0];

        if (firma.estado === 'ANULADO') {
            return res.status(400).json({ error: 'Esta firma ya fue anulada' });
        }

        await pool.query(
            `UPDATE firma_digital 
             SET estado = 'ANULADO', 
                 motivo_rechazo = $1
             WHERE id = $2`,
            [motivo, id]
        );

        await pool.query(
            `INSERT INTO log_actividad (usuario_id, accion, entidad_tipo, entidad_id, ip_origen)
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, 'ANULAR_FIRMA', 'FIRMA_DIGITAL', id, ip]
        );

        res.json({
            success: true,
            message: 'Firma anulada correctamente'
        });

    } catch (error) {
        console.error('❌ Error al anular firma:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Consultar estado de firmas (Admin RRHH)
export const getEstadoFirmas = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                u.nombre as trabajador,
                u.rut as trabajador_rut,
                d.titulo as documento,
                d.tipo as tipo_documento,
                f.estado,
                f.timestamp as fecha_firma,
                f.motivo_rechazo
             FROM firma_digital f
             JOIN documento d ON f.documento_id = d.id
             JOIN usuario u ON f.usuario_id = u.id
             WHERE d.activo = true
             ORDER BY f.timestamp DESC NULLS LAST`
        );

        res.json({
            success: true,
            firmas: result.rows
        });

    } catch (error) {
        console.error('❌ Error al consultar firmas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};