export interface PersonalDB {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
    cedula_profesional: string;
    especialidad: string;
    turno: string;
    rol: string;
    activo: number;
    password?: string;
}

export interface PersonalInputDTO {
    nombres: string;
    apellidos: string;
    email: string;
    cedula: string;
    especialidad: string;
    horarioLaboral: string;
    password?: string;
    rol?: string;
}