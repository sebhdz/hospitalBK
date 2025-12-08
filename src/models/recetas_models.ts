export interface RecetaDB {
    id: number;
    fecha_emision: string;
    medicamentos: string;
    indicaciones: string;
    id_paciente: number;
    id_medico: number;
}

export interface RecetaInputDTO {
    medicamentos: string;
    indicaciones: string;
    id_paciente: number;
    id_medico: number;
}
