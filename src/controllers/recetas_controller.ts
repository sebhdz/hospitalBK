import { Request, Response } from 'express';
import db from '../database';
import { RecetaInputDTO, RecetaDB } from '../models/recetas_models';

export const crearReceta = (req: Request<{}, {}, RecetaInputDTO>, res: Response) => {
    const { medicamentos, indicaciones, id_paciente, id_medico } = req.body;

    if (!medicamentos || !indicaciones || !id_paciente || !id_medico) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO recetas (medicamentos, indicaciones, id_paciente, id_medico)
            VALUES (?, ?, ?, ?)
        `);

        const info = stmt.run(medicamentos, indicaciones, id_paciente, id_medico);

        res.status(201).json({
            message: "Receta creada exitosamente",
            id: info.lastInsertRowid
        });

    } catch (error) {
        console.error("Error al crear receta:", error);
        res.status(500).json({ error: "Error al crear la receta" });
    }
};

export const obtenerRecetasPorPaciente = (req: Request<{ idPaciente: string }>, res: Response) => {
    const { idPaciente } = req.params;

    try {
        const stmt = db.prepare(`
            SELECT r.*, p.nombres as medico_nombres, p.apellidos as medico_apellidos 
            FROM recetas r
            JOIN personal_hospital p ON r.id_medico = p.id
            WHERE r.id_paciente = ?
            ORDER BY r.fecha_emision DESC
        `);

        const recetas = stmt.all(idPaciente);
        res.json(recetas);
    } catch (error) {
        console.error("Error al obtener recetas:", error);
        res.status(500).json({ error: "Error al obtener recetas" });
    }
};
