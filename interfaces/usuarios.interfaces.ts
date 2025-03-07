import { Area } from "./areas.interfaces";
import { Rol } from "./roles.interfaces";
import { SubArea } from "./subareas.interfaces";

export interface Usuario {
    id: string;
    nombre: string;
    email: string;
    apellidos: string;
    contraseña: string;
    areaId: string;
    area: Area;
    subArea: SubArea;
    subAreaId: string;
    rolId: string;
    rol: Rol;
    procedencia: string;
    tipoUsuario: "admin" | "user";
    jefe: "si" | "no";
    creadoPorId: string | null;
  }
  
export interface Meta {
    total: number;
    page: number;
    limit: number;
    last_page: number;
  }
  
export interface UsuarioResponse {
    data: Usuario[];
    meta: Meta;
  }

  export interface CreateUsuarioDto {
    nombre: string;
    email: string;
    apellidos: string;
    contraseña: string;
    areaId: string;
    subAreaId: string;
    rolId: string;
    procedencia: string;
    tipoUsuario: "admin" | "user";
    jefe: "si" | "no";
    creadoPorId?: string | null;
}
