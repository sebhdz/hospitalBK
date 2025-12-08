import { Response, Request } from 'express';
import { Cita, CitaDTO } from "../models/citas_models"; // Asegúrate que esta ruta sea correcta
import db from "../database";

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
                      INNER JOIN main.pacientes p on p.id = c.id_paciente
                      INNER JOIN personal_hospital ph ON ph.id = c.id_medico
                    ORDER BY fecha_hora DESC`
        );


        const citas :Cita[] = stmt.all() as Cita[];
        res.status(200).json(citas);
    } catch (error) {
        console.error("Error obteniendo citas:", error);
        res.status(500).json({ error: "Error al obtener la lista de citas" });
    }
};

export const getCitasPorDoctor = (req: Request<{ idDoctor: string }>, res: Response) => {
    const idDoctorNumber = parseInt(req.params.idDoctor);
    try {
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
                INNER JOIN main.pacientes p on p.id = c.id_paciente
                INNER JOIN personal_hospital ph ON ph.id = c.id_medico
            WHERE id_medico = ?
            ORDER BY fecha_hora DESC
                `);

        const citas: Cita[] = stmt.all(idDoctorNumber) as Cita[];
        res.status(200).json(citas);
    } catch (error) {
        console.error("Error en la base de datos: ", error);
        res.status(500).json({ error: "Error al buscar citas" });
    }
}

export const crearCita = (req: Request<{}, {}, CitaDTO>, res: Response) => {

    const nuevaCita: CitaDTO = req.body

    const query = `
        INSERT INTO citas (fecha_hora, motivo_consulta, id_medico, id_paciente, estado) 
        VALUES (@fecha_hora, @motivo, @id_medico, @id_paciente, @estado);
    `

    try {
        db.prepare(query).run(nuevaCita);
        res.send("Cita creada");
    } catch (error) {
        console.error("Error en la base de datos: ", error);
        res.status(500).json({ error: "Error al crear cita" });
    }
}

export const actualizarCita = (req: Request<{}, {}, CitaDTO>, res: Response) => {
    const citaActualizada: CitaDTO = req.body;
    const query = `
        UPDATE citas SET 
            fecha_hora = @fecha_hora,
            motivo_consulta = @motivo,
            estado = @estado,
            id_medico = @id_medico,
            id_paciente = @id_paciente
        WHERE id = @id              
    `;

    try {
        db.prepare(query).run(citaActualizada);
        res.send("Cita actualizada");
    } catch (error) {
        console.error("Error en la base de datos: ", error);
        res.status(500).json({ error: "Error al actualizar cita" });
    }
}

export const eliminarCita = (req: Request<{ idCita: string }>, res: Response) => {
    const idCita = parseInt(req.params.idCita);
    const query = `DELETE FROM citas WHERE id = ?`

    try {
        db.prepare(query).run(idCita);
        res.send("Cita Eliminada");
    } catch (error) {
        console.error("Error en la base de datos: ", error);
        res.status(500).json({ error: "Error al eliminar cita" });
    }
}