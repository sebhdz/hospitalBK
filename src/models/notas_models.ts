export interface NotaClinicaDB {
    id: number;
    fecha_hora: string;
    peso_kg: number;
    altura_cm: number;
    presion_arterial: string;
    temperatura_c: number;
    saturacion_oxigeno: number;
    diagnostico: string;
    plan_tratamiento: string;
    id_historial: number;
    id_medico: number;
}

export interface NotaInputDTO {
    id_paciente: number; 
    id_medico: number;
    peso: number;
    altura: number;
    presion: string;
    temperatura: number;
    saturacion: number;
    diagnostico: string;
    tratamiento: string;
}