import * as z from "zod"

export const receivedLetterSchema = z.object({
  codigoRecibido: z.string().min(1, "El código es requerido"),
  fechaIngreso: z.date({
    required_error: "La fecha es requerida",
  }),
  destinatario: z.string().min(1, "El destinatario es requerido"),
  asuntoRecibido: z.string().min(1, "El asunto es requerido"),
  cartaRecibida: z.instanceof(File, { message: "El archivo es requerido" }).nullable(),
  esConfidencial: z.boolean().default(false),
})

export type ReceivedLetterForm = z.infer<typeof receivedLetterSchema>

