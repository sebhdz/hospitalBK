export interface HistorialDB {
    id: number;
    id_paciente: number;
    fecha_apertura: string;
    tipo_sangre: string;
    antecedentes_hered: string;
    antecedentes_patol: string;
}

export interface HistorialInputDTO {
    tipoSangre: string;
    antecedentesHereditarios: string;
    antecedentesPatologicos: string;
}