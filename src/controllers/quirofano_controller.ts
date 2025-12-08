import { Request, Response } from 'express';
import db from '../database';
import { ReservaQuirofanoInputDTO, ReservaQuirofanoDB } from '../models/quirofano_models';

export const crearReserva = (req: Request<{}, {}, ReservaQuirofanoInputDTO>, res: Response) => {
    const { id_medico, id_paciente, sala, tipo_cirugia, fecha_hora } = req.body;

    if (!id_medico || !id_paciente || !sala || !tipo_cirugia || !fecha_hora) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        // Verificar disponibilidad (opcional pero recomendado)
        const stmtCheck = db.prepare(`
            SELECT COUNT(*) as count FROM reservas_quirofano 
            WHERE sala = ? AND fecha_hora = ?
        `);
        const resultCheck = stmtCheck.get(sala, fecha_hora) as { count: number };

        if (resultCheck.count > 0) {
            return res.status(409).json({ error: "La sala ya está reservada para esa hora" });
        }

        const stmt = db.prepare(`
            INSERT INTO reservas_quirofano (
                id_medico, id_paciente, sala, tipo_cirugia, fecha_hora
            ) VALUES (?, ?, ?, ?, ?)
        `);

        const info = stmt.run(id_medico, id_paciente, sala, tipo_cirugia, fecha_hora);

        res.status(201).json({
            message: "Quirófano reservado exitosamente",
            id: info.lastInsertRowid
        });

    } catch (error) {
        console.error("Error al reservar quirófano:", error);
        res.status(500).json({ error: "Error al crear la reserva" });
    }
};

export const obtenerReservas = (req: Request, res: Response) => {
    try {
        const stmt = db.prepare(`
            SELECT r.*, 
                   doc.nombres as medico_nombres, doc.apellidos as medico_apellidos,
                   p.nombres as paciente_nombres, p.apellidos as paciente_apellidos
            FROM reservas_quirofano r
            JOIN personal_hospital doc ON r.id_medico = doc.id
            JOIN pacientes p ON r.id_paciente = p.id
            ORDER BY r.fecha_hora DESC
        `);

        const reservas = stmt.all();
        res.json(reservas);
    } catch (error) {
        console.error("Error al obtener reservas:", error);
        res.status(500).json({ error: "Error al obtener las reservas" });
    }
};
