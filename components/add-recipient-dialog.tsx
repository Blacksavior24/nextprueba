"use client"

import { useState } from "react"
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from 'lucide-react'
import { recipientSchema, type RecipientFormValues } from "@/schemas/letter-schema"

export function AddRecipientDialog({ onAddRecipient }: { onAddRecipient: (name: string) => void }) {
  const [open, setOpen] = useState(false)
  const form = useForm<RecipientFormValues>({
    resolver: zodResolver(recipientSchema),
    defaultValues: {
      documentType: "",
      documentNumber: "",
      name: "",
    },
  })

  function onSubmit(data: RecipientFormValues) {
    onAddRecipient(data.name)
    form.reset()
    setOpen(false)
  }

  // Actualizar validación del número de documento según el tipo seleccionado
  const watchDocumentType = form.watch("documentType")
  const documentNumberPattern = watchDocumentType === "dni" ? "\\d*" : undefined
  const documentNumberMaxLength = watchDocumentType === "dni" 
    ? 8 
    : watchDocumentType === "ruc" 
      ? 11 
      : watchDocumentType === "ce" 
        ? 12 
        : undefined

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left">Administración de Destinatario</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TipoDocumento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="--Seleccionar--" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="dni">DNI</SelectItem>
                      <SelectItem value="ruc">RUC</SelectItem>
                      <SelectItem value="ce">Carnet de Extranjería</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero Documento</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      pattern={documentNumberPattern}
                      maxLength={documentNumberMaxLength}
                      onChange={(e) => {
                        if (watchDocumentType === "dni" || watchDocumentType === "ruc") {
                          // Solo permitir números
                          const value = e.target.value.replace(/[^\d]/g, '')
                          field.onChange(value)
                        } else {
                          field.onChange(e.target.value.toUpperCase())
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <Button 
                type="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={!form.formState.isValid}
              >
                Guardar
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setOpen(false)}
                className="w-full"
              >
                Salir
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

