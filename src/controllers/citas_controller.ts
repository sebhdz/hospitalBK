import { Response, Request} from 'express';
import {Cita, CrearCitaDTO} from "../models/citas_models";
import db from "../database";

export const getCitasPorDoctor =  (req: Request< { idDoctor:string } >, res: Response) => {

    const { idDoctor } = req.params
    const idDoctorNumber = parseInt(idDoctor);

    try{

        const stmt = db.prepare(`SELECT * FROM citas WHERE id_medico = ?`);
        const citas: Cita[] = stmt.all(idDoctorNumber) as Cita[];
        res.status(200).json(citas);

    }catch(error){

        console.error("Error en la base de datos: ", error);
        res.status(500).json({error: "Error al buscar citas"});

    }
}

export const crearCita = (req: Request<{}, {}, CrearCitaDTO>, res: Response) => {

    const nuevaCita: CrearCitaDTO = req.body

    const query = `
                INSERT INTO citas (fecha_hora, motivo_consulta, id_medico, id_paciente) 
                VALUES (@fecha_hora, @motivo, @id_medico, @id_paciente);`

    try{
        db.prepare(query).run(nuevaCita);
        res.send("Cita creada");
    }catch(error){
        console.error("Error en la base de datos: ", error);
        res.status(500).json({error: "Error al crear cita"});
    }
}
