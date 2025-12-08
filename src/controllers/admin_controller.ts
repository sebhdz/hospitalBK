import { Request, Response } from 'express';
import db from '../database';

export const obtenerRegistros = (req: Request, res: Response) => {
    try {
        // Hacemos JOIN para obtener el nombre del usuario que hizo la acción
        const query = `
            SELECT 
                l.id, 
                l.accion, 
                l.tabla_afectada, 
                l.fecha_hora,
                p.nombres, 
                p.apellidos
            FROM logs_auditoria l
            LEFT JOIN personal_hospital p ON l.id_usuario = p.id
            ORDER BY l.fecha_hora DESC
        `;
        
        const logsRaw = db.prepare(query).all() as any[];

        // Formateamos para el frontend
        const logsFrontend = logsRaw.map(log => {
            const fechaObj = new Date(log.fecha_hora);
            
            return {
                id: log.id,
                // Si el usuario se borró, mostramos "Usuario Desconocido"
                usuario: log.nombres ? `${log.nombres} ${log.apellidos}` : 'Usuario Sistema/Borrado',
                accion: log.accion, // "CREAR", "ACTUALIZAR", etc.
                descripcion: `Cambio en tabla ${log.tabla_afectada}`,
                fecha: fechaObj.toLocaleDateString("es-MX"), 
                hora: fechaObj.toLocaleTimeString("es-MX", { hour: '2-digit', minute: '2-digit' })
            };
        });

        res.json(logsFrontend);

    } catch (error) {
        console.error("Error obteniendo logs:", error);
        res.status(500).json({ error: "Error al obtener registros" });
    }
};