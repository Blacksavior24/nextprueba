import { Area } from "./areas.interfaces";
import { Empresa } from "./empresas.interfaces";
import { SubArea } from "./subareas.interfaces";
import { Tema } from "./temas.interfaces";

export interface CreateCardDto {
  codigoRecibido: string; // string, opcional
  fechaIngreso: Date; // Date, opcional
  destinatario: string; // string, opcional
  asunto: string; // string, opcional
  pdfInfo?: string; // File, opcional
  esConfidencial: boolean; // boolean, valor por defecto false
  vencimiento: boolean; // boolean, valor por defecto false
  informativo: boolean; // boolean, valor por defecto false
  urgente: boolean; // boolean, valor por defecto false
  correosCopia?: string[]; // string (correo electrónico), opcional
  temaId: string; // string
  areaResponsableId: string; // string
  subAreaId: string; // string
  empresaId: string; // string
  referencia?: string; // string, opcional
  resumenRecibido?: string; // string, opcional
  nivelImpacto?: string; // string, opcional
  fechadevencimiento: Date; // Date, requerida
  tipo: boolean
}

export interface ReceivedCardDto {
  pdfInfo: string;
  codigoRecibido: string;
  destinatario: string;
  asunto: string;
  referencia?: string;
  esConfidencial: boolean;
  fechaIngreso: Date;
  correosCopia?: string[],
  areaResponsableId: string;
  subAreaId: string;
  empresaId: string;
  nivelImpacto?: string;
  temaId: string;
  vencimiento?: boolean;
  fechadevencimiento?: Date;
  informativo?: boolean;
  urgente?: boolean;
  tipo: boolean
}

export interface AssignedCardDto {

  estado?: string;
  referencia?: string;
  resumenRecibido: string;
  correosCopia?: string[];
  areaResponsableId: number;
  subAreaId: number;
  empresaId: number;
  nivelImpacto: string;
  temaId: number;
  vencimiento?: boolean;
  fechadevencimiento?: string;
  informativo?: boolean;
  urgente?: boolean;
  devuelto?: boolean;
}

export interface PendingCardDto {

  cartaborrador?: string;
  comentario?: string;
  devuelto?: boolean;
  observaciones?: string;
}

export interface AssignmentCardDto {

  cartaborrador?: string;
  codigoEnviado: string;
  fechaEnvio: string;
  asuntoEnviado: string;
  resumenEnviado: string;

  cartaEnviada?: string;

  comentarioCargo?: string;
}

export interface Card {
  id: string;
  pdfInfo: string;
  codigoRecibido: string;
  fechaIngreso: string;
  destinatario: string;
  asunto: string;
  esConfidencial: boolean;
  devuelto: boolean;
  estado: string;
  resumenRecibido: string;
  tema: string;
  nivelImpacto: string;
  correosCopia: string[];
  areaResponsableId: number;
  subAreaId: number;
  empresaId: number;
  temaId: number;
  vencimiento: boolean;
  fechadevencimiento: string;
  informativo: boolean;
  urgente: boolean;
  cartaborrador: string;
  comentario: string;
  observaciones: string;
  codigoenviado: string;
  fechaEnvio: string;
  asuntoEnviado: string;
  resumenEnviado: string;
  cartaEnviada: string;
  comentarioCargo: string;
  emision: boolean;
  partida: boolean;
  areaResponsable: Area;
  subArea: SubArea;
  empresa: Empresa;
  temaRelacion: Tema;
  referencia?: string;
  cartaAnterior?: Card;
  respuestas: Card[];
  tipo: type;
}

enum type {
  Recibido = "Recibido",
  Respondido = "Respondido"
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  last_page: number;
}


export interface CardsResponse{
  data: Card[];
  meta: Meta;

}



