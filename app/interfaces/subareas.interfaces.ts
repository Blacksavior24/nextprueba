import { Area } from "./areas.interfaces";

export interface SubArea {
    id: number;
    nombre: string;
    areaResponsableId: number;
    procedencia: string;
    jefatura: string;
    creadoPorId: number;
    areaResponsable: Area
}