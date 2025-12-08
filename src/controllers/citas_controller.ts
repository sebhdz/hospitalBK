import { Response, Request } from 'express';
import db from "../database";

// GET: Obtener TODAS las citas
export const obtenerTodasCitas = (req: Request, res: Response) => {
    try {
        const stmt = db.prepare('SELECT * FROM citas ORDER BY fecha_hora DESC');
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
        const stmt = db.prepare('SELECT * FROM citas WHERE id_medico = ?');
        const citas = stmt.all(id);
        res.status(200).json(citas);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar citas del doctor" });
    }
}

// POST: Crear Cita (Aquí estaba el error 500)
export const crearCita = (req: Request, res: Response) => {
    const { fecha_hora, motivo, id_medico, id_paciente, estado } = req.body;

    // --- DEBUG: Agrega esto para ver qué está llegando ---
    console.log("📥 Recibiendo petición POST /citas");
    console.log("Datos:", req.body);
    // ----------------------------------------------------

    // Validación: Si id_medico es 0 o null, esto salta
    if (!fecha_hora || !id_medico || !id_paciente) {
        console.log("❌ Faltan datos obligatorios");
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // ... resto del código igual ...

    try {
        const stmt = db.prepare(`
            INSERT INTO citas (fecha_hora, motivo_consulta, estado, id_medico, id_paciente) 
            VALUES (?, ?, ?, ?, ?)
        `);
        
        // 2. Ejecutamos respetando el orden EXACTO de los signos ?
        const info = stmt.run(
            fecha_hora, 
            motivo, // El frontend manda 'motivo', la DB guarda en 'motivo_consulta'
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

// PUT: Actualizar Cita (Check-in y Terminar)
export const actualizarCita = (req: Request, res: Response) => {
    // El frontend a veces manda el ID en el body, a veces no. Lo buscamos.
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

        // El ID va al final (corresponde al WHERE id = ?)
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