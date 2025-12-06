import { Request, Response } from 'express';
import db from '../database';
import { PacienteInputDTO, PacienteDB } from '../models/pacientes_models';


export const obtenerPacientes = (req: Request, res: Response) => {
    try {
        const stmt = db.prepare('SELECT * FROM pacientes');
        const pacientesRaw = stmt.all() as PacienteDB[];

        const pacientesFrontend = pacientesRaw.map(p => ({
            id: p.id,
            nombres: p.nombres,
            apellidos: p.apellidos,
            edad: calcularEdad(p.fecha_nacimiento),
            telefono: p.telefono,
            correo: p.email, 
            sexo: p.sexo
        }));

        res.json(pacientesFrontend);
    } catch (error) {
        console.error("Error al listar:", error);
        res.status(500).json({ error: "Error al obtener pacientes" });
    }
};


export const crearPaciente = (req: Request<{}, {}, PacienteInputDTO>, res: Response) => {
    const { 
        nombres, apellidos, fechaNacimiento, sexo, 
        telefono, email, direccion, 
        contactoEmergencia, telefonoEmergencia 
    } = req.body;

    const contactoCompleto = contactoEmergencia 
        ? `${contactoEmergencia} (${telefonoEmergencia || ''})` 
        : null;

    try {
        const stmt = db.prepare(`
            INSERT INTO pacientes (
                nombres, apellidos, fecha_nacimiento, sexo, 
                telefono, email, direccion, contacto_emergencia
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const info = stmt.run(
            nombres, 
            apellidos, 
            fechaNacimiento, 
            sexo, 
            telefono, 
            email, 
            direccion, 
            contactoCompleto
        );

        res.status(201).json({ 
            message: "Paciente registrado", 
            id: info.lastInsertRowid 
        });

    } catch (error: any) {
        console.error("Error al crear:", error);
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            res.status(400).json({ error: "El correo electrónico ya está registrado." });
        } else {
            res.status(500).json({ error: "Error interno al guardar paciente." });
        }
    }
};


export const obtenerPacientePorId = (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    try {
        const stmt = db.prepare('SELECT * FROM pacientes WHERE id = ?');
        const p = stmt.get(id) as PacienteDB;

        if (!p) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }

        const pacienteFrontend = {
            id: p.id,
            nombres: p.nombres,
            apellidos: p.apellidos,
            edad: calcularEdad(p.fecha_nacimiento),
            fechaNacimiento: p.fecha_nacimiento, 
            telefono: p.telefono,
            correo: p.email,
            email: p.email,
            sexo: p.sexo,
            direccion: p.direccion,
            contactoEmergencia: p.contacto_emergencia
        };

        res.json(pacienteFrontend);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el paciente' });
    }
};


export const actualizarPaciente = (req: Request<{ id: string }, {}, PacienteInputDTO>, res: Response) => {
    const { id } = req.params;
    const { 
        nombres, apellidos, fechaNacimiento, sexo,
        telefono, email, direccion, 
        contactoEmergencia, telefonoEmergencia 
    } = req.body;

    const contactoCompleto = contactoEmergencia 
        ? `${contactoEmergencia} (${telefonoEmergencia || ''})`
        : null;

    try {
        const stmt = db.prepare(`
            UPDATE pacientes 
            SET nombres = ?, apellidos = ?, fecha_nacimiento = ?, sexo = ?,
                telefono = ?, email = ?, direccion = ?, contacto_emergencia = ?
            WHERE id = ?
        `);
        
        const info = stmt.run(
            nombres, apellidos, fechaNacimiento, sexo,
            telefono, email, direccion, contactoCompleto, id
        );

        if (info.changes === 0) {
            return res.status(404).json({ error: 'No se encontró el paciente para actualizar' });
        }

        res.json({ message: 'Datos del paciente actualizados correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar paciente' });
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
        if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            res.status(400).json({ 
                error: "No se puede eliminar: el paciente tiene historial médico o citas." 
            });
        } else {
            res.status(500).json({ error: "Error al eliminar paciente" });
        }
    }
};


function calcularEdad(fechaString: string): number {
    if (!fechaString) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fechaString);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}