import * as z from "zod"

export const letterSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  recipient: z.string().min(1, "El destinatario es requerido"),
  subject: z.string().min(1, "El asunto es requerido"),
  letter: z.instanceof(File),
  isConfidential: z.boolean().default(false),
})

export type LetterFormValues = z.infer<typeof letterSchema>

export const recipientSchema = z.object({
  documentType: z.string({
    required_error: "Debe seleccionar un tipo de documento",
  }),
  documentNumber: z.string().refine((val) => {
    if (!val) return false;
    // Validación según tipo de documento
    switch (val.length) {
      case 8: // DNI
        return /^\d{8}$/.test(val);
      case 11: // RUC
        return /^\d{11}$/.test(val);
      case 12: // CE
        return /^[A-Z0-9]{12}$/.test(val);
      default:
        return false;
    }
  }, {
    message: "Número de documento inválido. DNI: 8 dígitos, RUC: 11 dígitos, CE: 12 caracteres",
  }),
  name: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder los 100 caracteres")
    .refine((val) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), {
      message: "El nombre solo puede contener letras y espacios",
    }),
})

export type RecipientFormValues = z.infer<typeof recipientSchema>
