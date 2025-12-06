import { Request, Response } from 'express';
import { Paciente, PacienteDTO } from '../models/pacientes_models';
import db from '../database';

export const obtenerPacientes = (req: Request, res: Response) => {
    try {
        const stmt = db.prepare('SELECT * FROM pacientes');
        const pacientes: Paciente[] = stmt.all() as Paciente[];
        res.status(200).json(pacientes);
    } catch (error) {
        console.error("Error en DB:", error);
        res.status(500).json({ error: "Error al obtener pacientes" });
    }
};

export const obtenerPacientePorId = (req: Request<{ id: string }>, res: Response) => {
    const idPaciente = parseInt(req.params.id);

    try {
        const stmt = db.prepare('SELECT * FROM pacientes WHERE id = ?');
        const paciente = stmt.get(idPaciente) as Paciente;

        if (!paciente) {
            return res.status(404).json({ error: "Paciente no encontrado" });
        }
        res.status(200).json(paciente);
    } catch (error) {
        console.error("Error en DB:", error);
        res.status(500).json({ error: "Error al buscar el paciente" });
    }
};

export const crearPaciente = (req: Request<{}, {}, PacienteDTO>, res: Response) => {
    const nuevoPaciente: PacienteDTO = req.body;

    const query = `
        INSERT INTO pacientes (
            nombres, apellidos, fecha_nacimiento, sexo, 
            telefono, email, direccion, alergias, contacto_emergencia
        ) VALUES (
            @nombres, @apellidos, @fecha_nacimiento, @sexo, 
            @telefono, @email, @direccion, @alergias, @contacto_emergencia
        );
    `;

    try {
        const info = db.prepare(query).run(nuevoPaciente);
        res.status(201).json({ 
            message: "Paciente creado", 
            id: info.lastInsertRowid 
        });
    } catch (error: any) {
        console.error("Error en DB:", error);
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            res.status(400).json({ error: "El email ya está registrado" });
        } else {
            res.status(500).json({ error: "Error al crear paciente" });
        }
    }
};

export const actualizarPaciente = (req: Request<{ id: string }, {}, PacienteDTO>, res: Response) => {
    const datosActualizar = { 
        ...req.body, 
        id: parseInt(req.params.id) 
    };

    const query = `
        UPDATE pacientes SET 
            nombres = @nombres,
            apellidos = @apellidos,
            fecha_nacimiento = @fecha_nacimiento,
            sexo = @sexo,
            telefono = @telefono,
            email = @email,
            direccion = @direccion,
            alergias = @alergias,
            contacto_emergencia = @contacto_emergencia
        WHERE id = @id
    `;

    try {
        const info = db.prepare(query).run(datosActualizar);
        
        if (info.changes === 0) {
            return res.status(404).json({ error: "No se encontró el paciente" });
        }
        res.send("Paciente actualizado");
    } catch (error) {
        console.error("Error en DB:", error);
        res.status(500).json({ error: "Error al actualizar paciente" });
    }
};

export const eliminarPaciente = (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const stmt = db.prepare('DELETE FROM pacientes WHERE id = ?');
        const info = stmt.run(id);

        if (info.changes === 0) {
            return res.status(404).json({ error: "Paciente no encontrado" });
        }

        res.status(200).json({ message: "Paciente eliminado exitosamente" });

    } catch (error: any) {
        console.error("Error en DB:", error);
        
        if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            res.status(400).json({ 
                error: "No se puede eliminar el paciente porque tiene citas, recetas o historial asociado." 
            });
        } else {
            res.status(500).json({ error: "Error al eliminar paciente" });
        }
    }
};