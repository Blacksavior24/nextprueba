import { z } from "zod";

export const PendingCardSchema = z.object({
  cartaborrador: z.instanceof(File, {message: 'El archivo es requerido'}).optional(),
  comentario: z.string().optional(),
  devuelto: z.boolean().optional(),
  observaciones: z.string().optional()
});

export type PendingLetterForm = z.infer<typeof PendingCardSchema>;
