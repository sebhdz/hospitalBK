import { Request, Response } from 'express';
import db from '../database';
import { PagoDTO } from '../models/pagos_models';

export const obtenerIngresos = (req: Request, res: Response) => {
    try {
        const query = `
            SELECT fecha_pago as fecha, SUM(monto_total) as monto
            FROM pagos
            GROUP BY fecha_pago
            ORDER BY fecha_pago ASC
            LIMIT 30
        `;

        const ingresosRaw = db.prepare(query).all() as { fecha: string; monto: number }[];

        const ingresosFrontend = ingresosRaw.map(d => {
            const fechaObj = new Date(d.fecha);
            fechaObj.setMinutes(fechaObj.getMinutes() + fechaObj.getTimezoneOffset());
            
            const dia = fechaObj.getDate().toString().padStart(2, '0');
            const mes = fechaObj.toLocaleString('es-MX', { month: 'short' });
            const mesCap = mes.charAt(0).toUpperCase() + mes.slice(1);
            
            return {
                fecha: `${dia} ${mesCap}`,
                monto: d.monto
            };
        });

        res.json(ingresosFrontend);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener ingresos" });
    }
};

export const crearPago = (req: Request<{}, {}, PagoDTO>, res: Response) => {
    const { id_paciente, id_recepcionista, monto, metodo } = req.body;
    
    try {
        const stmt = db.prepare(`
            INSERT INTO pagos (id_paciente, id_recepcionista, monto_total, metodo_pago)
            VALUES (?, ?, ?, ?)
        `);
        
        const info = stmt.run(id_paciente, id_recepcionista, monto, metodo);
        
        res.status(201).json({ 
            message: "Pago registrado exitosamente", 
            id: info.lastInsertRowid 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar pago" });
    }
};