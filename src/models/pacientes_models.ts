export interface PacienteDB {
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

export interface PacienteInputDTO {
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;     
    sexo: string;
    telefono: string;
    email: string;
    direccion: string;
    contactoEmergencia: string;  
    telefonoEmergencia: string; 
}