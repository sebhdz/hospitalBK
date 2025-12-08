import { Request } from 'express';
import db from '../database';

export const logAudit = (
    accion: string,
    tabla: string,
    valoresAnteriores: any | null,
    valoresNuevos: any | null,
    idUsuario: number
) => {
    try {
        const stmt = db.prepare(`
            INSERT INTO logs_auditoria (accion, tabla_afectada, valores_anteriores, valores_nuevos, id_usuario)
            VALUES (?, ?, ?, ?, ?)
        `);

        stmt.run(
            accion,
            tabla,
            valoresAnteriores ? JSON.stringify(valoresAnteriores) : null,
            valoresNuevos ? JSON.stringify(valoresNuevos) : null,
            idUsuario
        );
    } catch (error) {
        console.error("⚠️ Error al registrar auditoría:", error);
    }
};

export const getUserIdFromRequest = (req: Request): number => {
    // Idealmente vendría de un token JWT o sesión.
    // Por ahora, aceptamos un header 'x-user-id' o default a 1 (Admin/Sistema).
    const headerId = req.headers['x-user-id'];
    if (headerId && !Array.isArray(headerId)) {
        const parsed = parseInt(headerId);
        if (!isNaN(parsed)) return parsed;
    }
    return 1; // ID de fallback (asegúrate de que el usuario ID 1 exista en tu seed)
};
