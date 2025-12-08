import { Response, Request } from 'express';
import db from "../database";

// GET: Obtener TODAS las citas (Con Nombres Reales usando JOIN)
// Esta es la versión avanzada que tenía tu main
export const obtenerTodasCitas = (req: Request, res: Response) => {
    try {
        const stmt = db.prepare(
            `SELECT
                 c.id,
                 c.fecha_hora,
                 p.nombres as nombres_paciente,
                 p.apellidos as apellidos_paciente,
                 ph.nombres as nombres_medico,
                 ph.apellidos as apellidos_medico,
                 c.motivo_consulta,
                 c.estado,
                 c.id_medico,
                 c.id_paciente
             FROM citas c
             INNER JOIN pacientes p on p.id = c.id_paciente
             INNER JOIN personal_hospital ph ON ph.id = c.id_medico
             ORDER BY fecha_hora DESC`
        );

        const citas = stmt.all();
        res.status(200).json(citas);
    } catch (error) {
        console.error("Error GET citas:", error);
        res.status(500).json({ error: "Error al obtener citas" });
    }
};

// GET: Citas por Doctor
export const getCitasPorDoctor = (req: Request<{ idDoctor: string }>, res: Response) => {
    try {
        const id = parseInt(req.params.idDoctor);
        const stmt = db.prepare(`
            SELECT
                c.id,
                c.fecha_hora,
                p.nombres as nombres_paciente,
                p.apellidos as apellidos_paciente,
                ph.nombres as nombres_medico,
                ph.apellidos as apellidos_medico,
                c.motivo_consulta,
                c.estado,
                c.id_medico,
                c.id_paciente
            FROM citas c
                     INNER JOIN pacientes p on p.id = c.id_paciente
                     INNER JOIN personal_hospital ph ON ph.id = c.id_medico
            WHERE c.id_medico = ?
            ORDER BY fecha_hora DESC
        `);
        const citas = stmt.all(id);
        res.status(200).json(citas);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar citas del doctor" });
    }
}

// POST: Crear Cita (Versión arreglada del Fix)
export const crearCita = (req: Request, res: Response) => {
    const { fecha_hora, motivo, id_medico, id_paciente, estado } = req.body;

    console.log("📥 Recibiendo petición POST /citas", req.body);

    if (!fecha_hora || !id_medico || !id_paciente) {
        console.log("❌ Faltan datos obligatorios");
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO citas (fecha_hora, motivo_consulta, estado, id_medico, id_paciente) 
            VALUES (?, ?, ?, ?, ?)
        `);

        const info = stmt.run(
            fecha_hora,
            motivo,
            estado || 'Agendada',
            id_medico,
            id_paciente
        );

        res.status(201).json({ message: "Cita creada", id: info.lastInsertRowid });
    } catch (error: any) {
        console.error("❌ Error CREATE cita:", error);
        res.status(500).json({ error: "Error interno: " + error.message });
    }
}

// PUT: Actualizar Cita (Versión arreglada del Fix)
export const actualizarCita = (req: Request, res: Response) => {
    const { id, fecha_hora, motivo, estado, id_medico, id_paciente } = req.body;

    if (!id) return res.status(400).json({ error: "Falta el ID de la cita" });

    try {
        const stmt = db.prepare(`
            UPDATE citas SET 
                fecha_hora = ?,
                motivo_consulta = ?,
                estado = ?,
                id_medico = ?,
                id_paciente = ?
            WHERE id = ?              
        `);

        const info = stmt.run(fecha_hora, motivo, estado, id_medico, id_paciente, id);

        if (info.changes === 0) return res.status(404).json({ error: "Cita no encontrada" });

        res.json({ message: "Cita actualizada correctamente" });
    } catch (error: any) {
        console.error("❌ Error UPDATE cita:", error);
        res.status(500).json({ error: "Error interno: " + error.message });
    }
}

// DELETE: Eliminar
export const eliminarCita = (req: Request<{ idCita: string }>, res: Response) => {
    try {
        const id = parseInt(req.params.idCita);
        db.prepare('DELETE FROM citas WHERE id = ?').run(id);
        res.send("Cita Eliminada");
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar cita" });
    }
}