import * as z from "zod"

export const userSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  apellidoPaterno: z.string().min(2, "El apellido paterno es requerido"),
  apellidoMaterno: z.string().min(2, "El apellido materno es requerido"),
  correo: z.string().email("Correo inválido"),
  area: z.string().min(1, "El área es requerida"),
  subArea: z.string().min(1, "La sub área es requerida"),
  tipoUsuario: z.string().min(1, "El tipo de usuario es requerido"),
})

export type UserFormValues = z.infer<typeof userSchema>

