"use client"

import { useAnswerPendingCardMutation } from "@/lib/queries/cards.queries"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { CalendarIcon, FolderDown, LoaderCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from "./ui/dialog"
import { ScrollArea } from "./ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Separator } from "@/components/ui/separator"
import { PendingCardSchema, type PendingLetterForm } from "@/schemas/pending-letter-schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { DragAndDropInput } from "./drag-and-drop-input"
import { Checkbox } from "./ui/checkbox"
import { Textarea } from "./ui/textarea"
import { useGetCardById } from "@/lib/queries/cards.queries"
import { Label } from "./ui/label"
import { useEffect } from "react"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  id: string
}

export function PendingForm({ open, onOpenChange, id }: DialogProps) {
  const form = useForm<PendingLetterForm>({
    resolver: zodResolver(PendingCardSchema),
    defaultValues: {
      cartaborrador: undefined,
      comentario: "",
      devuelto: false,
      observaciones: "",
    },
  })

  const devuelto = useWatch({
    control: form.control,
    name: "devuelto",
    defaultValue: false,
  })

  const { data,  isLoading ,error } = useGetCardById(id, open)

  const { AlertDialog, mutation } = useAnswerPendingCardMutation(id, form.reset, onOpenChange)

  function onSubmit(data: PendingLetterForm) {
    mutation.mutate(data)
  }
  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "ingresado":
        return "bg-green-100 text-green-800 border-green-300"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "cerrado":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  useEffect(() => {
    if (open && data) {
      form.setValue("comentario", data.comentario || "");
      form.setValue("observaciones", data.observaciones || "");
      form.setValue("devuelto", data.devuelto || false);
    }
    if (!open) {
      form.reset({
        comentario: '',
        observaciones: "",
        devuelto: false
      });
  }
  }, [open, data, form, id])
  
  if (!open) return null; // No renderizar si el modal no está abierto


  if (isLoading ) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
      {/* Ícono de Lucide con animación */}
      <LoaderCircle className="w-12 h-12 text-blue-500 animate-spin" />
      {/* Texto de carga */}
      <p className="mt-4 text-lg text-gray-700">Cargando...</p>
    </div>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          form.reset()
        }
        onOpenChange(newOpen)
      }}
    >
      <DialogOverlay className={open ? "visible" : "hidden"} asChild />
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">Responder Carta</DialogTitle>
        </DialogHeader>
        <DialogDescription className="px-6">{error?.message}</DialogDescription>
        <ScrollArea className="flex-grow px-6 pb-6">
          <Card className="w-full border-0 shadow-none">
            <CardHeader className="px-0 pt-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-medium">Detalles de Carta</CardTitle>
              <Badge variant={data?.tipo ? "default" : "secondary"} className="ml-auto">
                {data?.tipo ? "Emitiendo" : "Recibido"}
              </Badge>
              <Badge className={`${getStatusColor(data?.estado || '-')} ml-auto`}>
                {data?.estado}
              </Badge>
            </CardHeader>
            <CardContent className="px-0 py-2 space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Código de Carta</p>
                  <p className="font-medium">{data?.codigoRecibido}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Fecha de ingreso</p>
                  <p className="font-medium flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    {data?.fechaIngreso ? format(data?.fechaIngreso, "PPP", { locale: es }) : "No especificada"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-xs mb-1">{data?.tipo ? "Remitente" : "Destinatario"}</p>
                <p className="font-medium">{data?.destinatario}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs mb-1">Asunto</p>
                <p className="font-medium">{data?.asunto}</p>
              </div>

              {data?.pdfInfo && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Carta adjunta</p>
                  <Button variant="outline" size="sm" asChild className="h-8">
                    <a href={data?.pdfInfo} target="_blank" rel="noopener noreferrer">
                      <FolderDown className="mr-2 h-3.5 w-3.5" />
                      Ver documento
                    </a>
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {data?.esConfidencial && (
                  <Badge variant="destructive" className="text-xs">
                    Confidencial
                  </Badge>
                )}
                {data?.urgente && (
                  <Badge variant="destructive" className="text-xs">
                    Urgente
                  </Badge>
                )}
                {data?.informativo && <Badge className="text-xs">Informativo</Badge>}
                {data?.tipo && <Badge className="text-xs">Respondido</Badge>}
              </div>

              {data?.tipo && data?.referencia && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Referencia</p>
                  <p className="font-medium">{data?.cartaAnterior?.codigoRecibido}</p>
                </div>
              )}

              <div>
                <p className="text-muted-foreground text-xs mb-1">Resumen</p>
                <p className="text-sm whitespace-pre-line">{data?.resumenRecibido}</p>
              </div>

              <Table className="w-full">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-8 text-xs w-[30%]">Tema</TableHead>
                    <TableHead className="h-8 text-xs w-[25%]">Empresa</TableHead>
                    <TableHead className="h-8 text-xs w-[25%]">Área</TableHead>
                    <TableHead className="h-8 text-xs w-[20%]">Subárea</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-transparent">
                    <TableCell className="py-2 text-xs">{data?.temaRelacion?.nombre || "-"}</TableCell>
                    <TableCell className="py-2 text-xs">{data?.empresa?.nombre || "-"}</TableCell>
                    <TableCell className="py-2 text-xs">{data?.areaResponsable?.nombre || "-"}</TableCell>
                    <TableCell className="py-2 text-xs">{data?.subArea?.nombre || "-"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Nivel de Impacto</p>
                  <Badge variant={data?.nivelImpacto === "ALTO" ? "destructive" : "outline"} className="text-xs">
                    {data?.nivelImpacto}
                  </Badge>
                </div>
              </div>

              {data?.correosCopia && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Correos en Copia</p>
                  <p className="text-sm">{data?.correosCopia}</p>
                </div>
              )}

              {data?.vencimiento && data?.fechadevencimiento && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Fecha de vencimiento</p>
                  <p className="text-sm flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    {format(data?.fechadevencimiento, "PPP", { locale: es })}
                  </p>
                </div>
              )}
              {data?.observaciones && (
                <div>
                    <p>Observaciones de esta carta:</p>
                    <Label className="text-destructive text-xs">{data.observaciones}</Label>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="w-full border shadow-sm">
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="text-lg font-medium">Formulario de Respuesta</CardTitle>
              <CardDescription>Envía un archivo junto con un comentario o solo un comentario para solicitar una respuesta. Si deseas devolver la carta, indica el motivo en las observaciones.</CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="cartaborrador"
                    disabled={devuelto}
                    render={({ field: { onChange } }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Adjuntar Carta Borrador</FormLabel>
                        <FormControl>
                          <DragAndDropInput
                            onChange={(file) => onChange(file)}
                            accept=".pdf"
                            disabled={devuelto}
                          />
                        </FormControl>
                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />
                  {data?.cartaborrador ? (
                                <>
                                    <h1>Carta Borrador:</h1>
                                    <Button asChild >
                                        <a href={data?.cartaborrador} target="_blank" rel="noopener noreferrer">
                                            <FolderDown />
                                        </a>
                                    </Button>
                                </>
                            ) : null}
                  <FormField
                    control={form.control}
                    name="devuelto"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} id="devuelto" />
                        </FormControl>
                        <FormLabel htmlFor="devuelto" className="text-sm font-medium cursor-pointer">
                          Devolver carta para revisión
                        </FormLabel>
                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      disabled={devuelto}
                      name="comentario"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-sm font-medium">Comentario</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="w-full resize-none min-h-[80px]"
                              placeholder="Añade un comentario sobre esta carta..."
                            />
                          </FormControl>
                          <FormMessage className="text-destructive text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="observaciones"
                      disabled={!devuelto}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-sm font-medium">Observaciones</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="w-full resize-none min-h-[80px]"
                              placeholder="Añade observaciones adicionales si es necesario..."
                            />
                          </FormControl>
                          <FormMessage className="text-destructive text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="p-4 flex justify-end">
          <Button variant="outline" size="sm" className="mr-2" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            size="sm"
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            className="bg-primary hover:bg-primary/90"
          >
            Enviar Respuesta
          </Button>
        </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </ScrollArea>
        <Separator />
        
        <AlertDialog />
      </DialogContent>
    </Dialog>
  )
}

