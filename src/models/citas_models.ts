export interface Cita {
    id: number;
    fecha_hora: string;
    motivo: string;
    estado: string;
    id_medico: number;
    id_paciente: number;
}

export interface CrearCitaDTO {
    fecha_hora: string;
    motivo: string;
    id_medico: number;
    id_paciente: number;
}
