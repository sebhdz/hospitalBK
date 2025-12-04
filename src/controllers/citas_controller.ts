import { Response, Request} from 'express';
import {Cita} from "../models/citas_models";
import db from "../database";

export const getCitasPorDoctor =  (req: Request< { idDoctor:string } >, res: Response) => {

    const { idDoctor } = req.params
    const id_medico = parseInt(idDoctor);

    const citasMedico = (): Cita[] => {

        const stmt = db.prepare(`SELECT * FROM citas WHERE id_medico = ?`);

        return stmt.all(id_medico) as Cita[];
    }

    res.json(citasMedico());

}
