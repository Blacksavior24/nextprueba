import { Area } from "./areas.interfaces";
import { Empresa } from "./empresas.interfaces";
import { SubArea } from "./subareas.interfaces";
import { Tema } from "./temas.interfaces";

export interface ReceivedCardDto {
  pdfInfo: string;
  codigoRecibido: string;
  destinatario: string;
  asunto: string;
  esConfidencial: boolean;
  fechaIngreso: Date;
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
  id:                 string;
  pdfInfo:            string;
  codigoRecibido:     string;
  fechaIngreso:       string;
  destinatario:       string;
  asunto:             string;
  esConfidencial:     boolean;
  devuelto:           boolean;
  estado:             string;
  referencia:         string;
  resumenRecibido:    string;
  tema:               string;
  nivelImpacto:       string;
  correosCopia:       string[];
  areaResponsableId:  number;
  subAreaId:          number;
  empresaId:          number;
  temaId:             number;
  vencimiento:        boolean;
  fechadevencimiento: string;
  informativo:        boolean;
  urgente:            boolean;
  cartaborrador:      string;
  comentario:         string;
  observaciones:      string;
  codigoenviado:      string;
  fechaEnvio:         string;
  asuntoEnviado:      string;
  resumenEnviado:     string;
  cartaEnviada:       string;
  comentarioCargo:    string;
  areaResponsable:    Area;
  subArea:            SubArea;
  empresa:            Empresa;
  temaRelacion:       Tema;
}

