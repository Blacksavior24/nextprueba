import { SubArea } from "./subareas.interfaces";

export interface Area{
    id: number;
    nombre: string;
    procedencia: string;
    subAreas: SubArea[]
}