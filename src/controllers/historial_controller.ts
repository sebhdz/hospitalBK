import { Request, Response } from 'express';
import db from '../database';
import { HistorialDB, HistorialInputDTO } from '../models/historial_models';

export const obtenerHistorial = (req: Request<{ idPaciente: string }>, res: Response) => {
    const { idPaciente } = req.params;

    try {
        const stmt = db.prepare('SELECT * FROM historial_clinico WHERE id_paciente = ?');
        const historial = stmt.get(idPaciente) as HistorialDB;

        if (!historial) {
            return res.json({
                existe: false,
                tipo_sangre: "No registrado",
                antecedentes_hered: "",
                antecedentes_patol: ""
            });
        }

        res.json({
            existe: true,
            ...historial
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener historial clínico" });
    }
};

export const actualizarHistorial = (req: Request<{ idPaciente: string }, {}, HistorialInputDTO>, res: Response) => {
    const { idPaciente } = req.params;
    const { tipoSangre, antecedentesHereditarios, antecedentesPatologicos } = req.body;

    try {
        const existe = db.prepare('SELECT id FROM historial_clinico WHERE id_paciente = ?').get(idPaciente);

        if (existe) {
            const stmt = db.prepare(`
                UPDATE historial_clinico 
                SET tipo_sangre = ?, antecedentes_hered = ?, antecedentes_patol = ?
                WHERE id_paciente = ?
            `);
            stmt.run(tipoSangre, antecedentesHereditarios, antecedentesPatologicos, idPaciente);
            res.json({ message: "Historial actualizado" });
        } else {
            const stmt = db.prepare(`
                INSERT INTO historial_clinico (id_paciente, tipo_sangre, antecedentes_hered, antecedentes_patol)
                VALUES (?, ?, ?, ?)
            `);
            stmt.run(idPaciente, tipoSangre, antecedentesHereditarios, antecedentesPatologicos);
            res.json({ message: "Historial creado exitosamente" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al guardar el historial" });
    }
};