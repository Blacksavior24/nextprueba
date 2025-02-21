// Definir la interfaz para un Rol
export interface Rol {
    id: number;
    nombre: string;
}

export interface CreateRolDto {
    nombre: string;
}