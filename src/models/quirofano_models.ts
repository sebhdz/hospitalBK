export interface ReservaQuirofanoDB {
    id: number;
    id_medico: number;
    id_paciente: number;
    sala: string;
    tipo_cirugia: string;
    fecha_hora: string;
}

export interface ReservaQuirofanoInputDTO {
    id_medico: number;
    id_paciente: number;
    sala: string;
    tipo_cirugia: string;
    fecha_hora: string;
}
