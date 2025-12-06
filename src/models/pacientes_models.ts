export interface Paciente {
    id: number;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string;
    sexo: string;
    telefono: string;
    email: string;
    direccion: string;
    alergias?: string;        
    contacto_emergencia?: string;
}

export interface PacienteDTO {
    id?: number; 
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string;
    sexo: string;
    telefono: string;
    email: string;
    direccion: string;
    alergias?: string;
    contacto_emergencia?: string;
}