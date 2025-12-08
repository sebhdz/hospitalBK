export interface Cita {
    id: number;
    fecha_hora: string;
    nombres_paciente: string;
    apellidos_paciente: string;
    nombres_medico: string;
    apellidos_medico: string;
    motivo: string;
    estado: string;
    id_medico: number;
    id_paciente: number;
}

export interface CitaDTO {
    id?: number;
    fecha_hora: string;
    motivo: string;
    estado?: string;
    id_medico: number;
    id_paciente: number;
}
