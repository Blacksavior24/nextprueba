// Definir la interfaz para un Destinatario
export interface Destinatario {
    id: number;
    tipodoc: string;
    numdoc: string;
    nombre: string;
}


export interface CreateDestinatarioDto {
    tipodoc: string;
    numdoc: string;
    nombre: string;
}
