export interface PagoDB {
    id: number;
    id_paciente: number;
    id_recepcionista: number;
    monto_total: number;
    metodo_pago: string;
    fecha_pago: string;
}

export interface IngresoGrafico {
    fecha: string;
    monto: number;
}

export interface PagoDTO {
    id_paciente: number;
    id_recepcionista: number;
    monto: number;
    metodo: string;
}