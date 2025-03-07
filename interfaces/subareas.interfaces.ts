import { Area } from "./areas.interfaces";

export interface SubArea {
    id: number;
    nombre: string;
    areaResponsableId: string;
    procedencia: string;
    jefatura: string;
    creadoPorId: number;
    areaResponsable: Area
}

export interface CreateSubAreaDto {
    nombre: string;
    procedencia?: string;
    areaResponsableId: string;
    jefatura?: string;
}