import { Request, Response } from 'express';
import db from '../database';
import { PersonalDB, PersonalInputDTO } from '../models/personal_models';

export const obtenerMedicos = (req: Request, res: Response) => {
    try {
        const stmt = db.prepare("SELECT * FROM personal_hospital WHERE rol = 'doctor' AND activo = 1");
        const medicosRaw = stmt.all() as PersonalDB[];

        const medicosFrontend = medicosRaw.map(m => ({
            id: m.id,
            nombres: m.nombres,
            apellidos: m.apellidos,
            nombreCorto: `Dr. ${m.nombres.charAt(0)}. ${m.apellidos}`,
            especialidad: m.especialidad,
            cedula: m.cedula_profesional,
            anosExperiencia: 5,
            consultorio: "Consultorio General",
            horarioLaboral: m.turno,
            serviciosOfrece: ["Consulta General", "Valoración"],
            telefono: "449 000 00 00",
            sexo: "M",
            correo: m.email,
            formacion: [
                { tipo: "Educación", detalle: "Facultad de Medicina" }
            ],
            certificaciones: ["Certificación Básica"],
            stats: {
                pacientesAtendidos: 0,
                satisfaccion: 100,
                ingresosGenerados: 0,
                calificacionPromedio: 5.0,
            },
        }));

        res.json(medicosFrontend);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener médicos" });
    }
};

export const obtenerMedicoPorId = (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare("SELECT * FROM personal_hospital WHERE id = ? AND rol = 'doctor'");
        const m = stmt.get(id) as PersonalDB;

        if (!m) {
            return res.status(404).json({ error: "Médico no encontrado" });
        }

        const medicoFrontend = {
            id: m.id,
            nombres: m.nombres,
            apellidos: m.apellidos,
            nombreCorto: `Dr. ${m.nombres.charAt(0)}. ${m.apellidos}`,
            especialidad: m.especialidad,
            cedula: m.cedula_profesional,
            anosExperiencia: 5,
            consultorio: "Consultorio Asignado",
            horarioLaboral: m.turno,
            serviciosOfrece: ["Consulta General"],
            telefono: "Sin registro",
            sexo: "M",
            correo: m.email,
            formacion: [],
            certificaciones: [],
            stats: {
                pacientesAtendidos: 0,
                satisfaccion: 100,
                ingresosGenerados: 0,
                calificacionPromedio: 5.0,
            },
        };

        res.json(medicoFrontend);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el médico" });
    }
};

export const crearMedico = (req: Request<{}, {}, PersonalInputDTO>, res: Response) => {
    // 1. Añadimos 'rol' a la destructuración para leerlo del body
    const { nombres, apellidos, email, cedula, especialidad, horarioLaboral, password, rol } = req.body;

    try {
        // 2. Cambiamos 'doctor' fijo por el signo de interrogación ?
        const stmt = db.prepare(`
            INSERT INTO personal_hospital (
                nombres, apellidos, email, password, rol, 
                cedula_profesional, especialidad, turno, activo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        `);

        const info = stmt.run(
            nombres,
            apellidos,
            email,
            password || '123456',
            rol || 'doctor', // 3. Usamos el rol que llega, o 'doctor' por defecto
            cedula,
            especialidad,
            horarioLaboral
        );

        res.status(201).json({ message: "Personal registrado", id: info.lastInsertRowid });

    } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            res.status(400).json({ error: "El email ya está registrado" });
        } else {
            console.error(error);
            res.status(500).json({ error: "Error al crear personal" });
        }
    }
};

export const eliminarMedico = (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const stmt = db.prepare("UPDATE personal_hospital SET activo = 0 WHERE id = ?");
        const info = stmt.run(id);

        if (info.changes === 0) {
            return res.status(404).json({ error: "Médico no encontrado" });
        }
        res.json({ message: "Médico dado de baja exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar médico" });
    }
};
// ACTUALIZAR MÉDICO
export const actualizarMedico = (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const { nombres, apellidos, email, especialidad, horarioLaboral, cedula } = req.body;

    try {
        const stmt = db.prepare(`
            UPDATE personal_hospital 
            SET nombres = ?, apellidos = ?, email = ?, especialidad = ?, turno = ?, cedula_profesional = ?
            WHERE id = ? AND rol = 'doctor'
        `);

        const info = stmt.run(nombres, apellidos, email, especialidad, horarioLaboral, cedula, id);

        if (info.changes === 0) {
            return res.status(404).json({ error: "Médico no encontrado" });
        }

        res.json({ message: "Médico actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar médico" });
    }
};

export const login = (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const stmt = db.prepare("SELECT * FROM personal_hospital WHERE email = ? AND activo = 1");
        const user = stmt.get(email) as PersonalDB;

        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // Return user info (excluding password)
        const { password: _, ...userInfo } = user;
        res.json({ message: "Login exitoso", user: userInfo });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};