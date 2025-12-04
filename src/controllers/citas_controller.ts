import { Response, Request} from 'express';
import {Cita} from "../models/citas_models";
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
