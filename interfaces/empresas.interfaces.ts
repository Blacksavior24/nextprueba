// Definir la interfaz para una Empresa
export interface Empresa {
    id: number;
    nombre: string;
    creadoPorId: number;
}

export interface CreateEmpresaDto {
    nombre: string;
}
