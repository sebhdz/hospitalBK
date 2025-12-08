import { Request, Response } from 'express';
import db from '../database';
import { NotaClinicaDB, NotaInputDTO } from '../models/notas_models';

export const obtenerNotasPorPaciente = (req: Request<{ idPaciente: string }>, res: Response) => {
    const { idPaciente } = req.params;

    try {
        const query = `
            SELECT n.*, m.nombres as medico_nombres, m.apellidos as medico_apellidos
            FROM notas_clinicas n
            JOIN historial_clinico h ON n.id_historial = h.id
            JOIN personal_hospital m ON n.id_medico = m.id
            WHERE h.id_paciente = ?
            ORDER BY n.fecha_hora DESC
        `;
        
        const notas = db.prepare(query).all(idPaciente);
        res.json(notas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener las notas clínicas" });
    }
};

export const crearNota = (req: Request<{}, {}, NotaInputDTO>, res: Response) => {
    const { 
        id_paciente, id_medico, 
        peso, altura, presion, temperatura, saturacion, 
        diagnostico, tratamiento 
    } = req.body;

    try {
        const historial = db.prepare('SELECT id FROM historial_clinico WHERE id_paciente = ?').get(id_paciente) as any;

        if (!historial) {
            return res.status(404).json({ error: "El paciente no tiene historial clínico abierto" });
        }

        const stmt = db.prepare(`
            INSERT INTO notas_clinicas (
                fecha_hora, peso_kg, altura_cm, presion_arterial, 
                temperatura_c, saturacion_oxigeno, diagnostico, 
                plan_tratamiento, id_historial, id_medico
            ) VALUES (datetime('now'), ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const info = stmt.run(
            peso, altura, presion, temperatura, saturacion, 
            diagnostico, tratamiento, 
            historial.id, id_medico
        );

        res.status(201).json({ message: "Nota clínica agregada", id: info.lastInsertRowid });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear la nota" });
    }
};