"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { userSchema, type UserFormValues } from "../schemas/user-schema"

const areas = [
  "COMERCIAL",
  "OPERACIONES",
  "DESARROLLO DE NUEVOS PROYECTOS",
  "SGI",
]

const subAreas = [
  "SUBCONTRATOS",
  "CALIDAD",
  "OPERACION Y MANTENIMIENTO",
  "DESARROLLO DE NUEVOS PROYECTOS",
  "SGI",
]

const tiposUsuario = ["UNIDAD", "ADMINISTRADOR"]

export function UserForm() {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      correo: "",
      area: "",
      subArea: "",
      tipoUsuario: "",
    },
  })

  function onSubmit(data: UserFormValues) {
    console.log(data)
    // Aquí iría la lógica para guardar el usuario
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Agregar Usuario</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Usuarios</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apellidoPaterno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido Paterno:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apellidoMaterno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido Materno:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="correo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo:</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Pertenece:</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="--Seleccionar--" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub Área:</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="--Seleccionar--" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subAreas.map((subArea) => (
                          <SelectItem key={subArea} value={subArea}>
                            {subArea}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipoUsuario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo Usuario:</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="--Seleccionar--" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposUsuario.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="submit">Guardar</Button>
              <DialogTrigger asChild>
                <Button type="button" variant="secondary">
                  Salir
                </Button>
              </DialogTrigger>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

