import { Rol } from "./roles.interfaces";

export interface Usuario {
    id: string;
    nombre: string;
    email: string;
    apellidos: string | null;
    contraseña: string;
    areaId: string | null;
    subAreaId: string | null;
    rolId: string;
    rol: Rol;
    procedencia: string | null;
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
    apellidos?: string | null;
    contraseña: string;
    areaId?: string | null;
    subAreaId?: string | null;
    rolId: string;
    procedencia?: string | null;
    tipoUsuario: "admin" | "user";
    jefe: "si" | "no";
    creadoPorId?: string | null;
}
