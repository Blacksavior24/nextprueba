import * as z from "zod"

export const receivedLetterSchema = z.object({
  emision: z.boolean().default(false),
  codigoRecibido: z.string().min(1, "El código es requerido"),
  fechaIngreso: z.date({
    required_error: "La fecha de ingreso es requerida",
  }),
  destinatario: z.string().min(1, "El destinatario es requerido"),
  asunto: z.string().min(1, "El asunto es requerido"),
  pdfInfo: z.instanceof(File, { message: "El archivo es requerido" }),
  esConfidencial: z.boolean().default(false),
  vencimiento: z.boolean().default(false),
  informativo: z.boolean().default(false),
  urgente: z.boolean().default(false),
  tipo: z.boolean().default(false),
  correosCopia: z.array(z.string().email("Correo electrónico inválido")).default([]),
  temaId: z.string().min(1, "El tema es requerido"),
  areaResponsableId: z.string().min(1, "El área responsable es requerida"),
  subAreaId: z.string().min(1, "La subárea es requerida"),
  empresaId: z.string().min(1, "La empresa es requerida"),
  referencia: z.string().optional(),
  resumenRecibido: z.string().optional(),
  nivelImpacto: z.string().optional(),
  fechadevencimiento: z.date({
    required_error: "La fecha de vencimiento es requerida",
  })
})

export type ReceivedLetterForm = z.infer<typeof receivedLetterSchema>
