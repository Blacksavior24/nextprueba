'use client'

import { useCreateReceivedCardMutation, useGetCardById } from "@/lib/queries/cards.queries"
import { ReceivedLetterForm, receivedLetterSchema } from "@/schemas/received-letter-schema"
import useDestinatariosStore from "@/store/destinatarios.store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, FolderDown, Plus } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { RecipientDialog } from "./reciepient-dialog"
import useTemasStore from "@/store/temas.store"
import useEmpresasStore from "@/store/empresas.store"
import useAreasStore from "@/store/areas.store"
import useSubAreasStore from "@/store/subareas.store"

interface DialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    id: string
}

export function AssignForm({ open, onOpenChange, id }: DialogProps) {

    const [recipientDialogOpen, setRecipientDialogOpen] = useState(false)
    const { destinatarios, fetchDestinatarios } = useDestinatariosStore()
    const { temas, fetchTemas } = useTemasStore()
    const { empresas, fetchEmpresas } = useEmpresasStore()
    const { areas, fetchAreas } = useAreasStore()
    const { subareas, fetchSubAreas } = useSubAreasStore()

    const form = useForm<ReceivedLetterForm>({
        resolver: zodResolver(receivedLetterSchema),
        defaultValues: {
            esConfidencial: false,
            vencimiento: false,
            informativo: false,
            urgente: false,
        },
    })

    const { data, error, isLoading } = useGetCardById(id)
    const { mutate: createReceivedCard } = useCreateReceivedCardMutation(form.reset)

    useEffect(() => {
        fetchDestinatarios() // Obtener destinatarios
        fetchSubAreas()
        fetchAreas()
        fetchTemas()
        fetchEmpresas()
        if (data) {
            form.setValue("codigoRecibido", data.codigoRecibido || "")
            form.setValue("destinatario", data.destinatario || "")
            form.setValue("asunto", data.asunto || "")
            form.setValue("esConfidencial", data.esConfidencial || false)
        }
    }, [data, fetchDestinatarios, fetchSubAreas, fetchSubAreas, fetchTemas, fetchEmpresas, form]) // Este effect depende de los datos de la carta y los destinatarios


    function onSubmit(data: ReceivedLetterForm) {
        createReceivedCard(data)
    }

    if (!open) return null; // No renderizar si el formulario no está abierto


    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 ${open ? "flex" : "hidden"} justify-center items-center`}>
            <div className="bg-white w-full max-w-2xl p-6 rounded-lg relative max-h-[80vh] overflow-auto">
                <button
                    onClick={() => {
                        onOpenChange(false); // Cerrar el formulario
                        form.reset(); // Restablecer los valores a los valores iniciales
                    }}
                    className="absolute top-4 right-4 text-xl text-red-600 hover:text-red-800"
                >
                    X
                </button>
                <h1 className="text-2xl font-semibold text-center mb-6">Asignación de Cartas</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        
                        <div className="flex gap-2">
                        <FormField
                            control={form.control}
                            name="codigoRecibido"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Código Recibido:</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fechaIngreso"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Fecha de ingreso:</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"
                                                        }`}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>
                        

                        <div className="flex gap-2">
                            <FormField
                                control={form.control}
                                name="destinatario"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Destinatario:</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="--Seleccionar--" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="default">--Seleccionar--</SelectItem>
                                                {destinatarios?.map((recipient) => (
                                                    <SelectItem key={recipient.id} value={recipient.nombre}>
                                                        {recipient.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-red-500 text-sm" />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="mt-8"
                                onClick={() => setRecipientDialogOpen(true)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <FormField
                            control={form.control}
                            name="asunto"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Asunto Recibido:</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        <h1>Carta recibida</h1>
                        <Button asChild >
                            <a href={data?.pdfInfo} target="_blank" rel="noopener noreferrer">
                                <FolderDown />
                            </a>
                        </Button>
                        <FormField
                            control={form.control}
                            name="pdfInfo"
                            render={({ field: { value, onChange, ...field } }) => (
                                <FormItem>
                                    <FormLabel>Carta Recibida:</FormLabel>
                                    <FormControl>
                                        <Input type="file" onChange={(e) => onChange(e.target.files?.[0])} {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="esConfidencial"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Marcar solo en caso sera confidencial</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="referencia"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Referencia:</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="resumenRecibido"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Resumen Recibido:</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="temaId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tema:</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Seleccionar Tema" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {temas && temas.map(tema => (
                                                <SelectItem value={String(tema.id)}>{tema.nombre}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2">
                            <FormField
                                control={form.control}
                                name="areaResponsableId"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Area Responsable:</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccionar Area" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {areas && areas.map(area => (
                                                    <SelectItem value={String(area.id)}>{area.nombre}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-red-500 text-sm" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="subAreaId"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Sub Area:</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccionar Sub Area" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {subareas && subareas.filter(sub => String(sub.areaResponsableId) === form.getValues("areaResponsableId")).map(area => (
                                                    <SelectItem value={String(area.id)}>{area.nombre}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-red-500 text-sm" />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <div className="flex gap-2">
                        <FormField
                            control={form.control}
                            name="empresaId"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Empresa:</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Seleccionar Empresa" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {empresas && empresas.map(empresa => (
                                                <SelectItem value={String(empresa.id)}>{empresa.nombre}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="nivelImpacto"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Nivel de Impacto:</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Seleccionar Nivel de Impacto" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ALTO">ALTO</SelectItem>
                                            <SelectItem value="BAJO">BAJO</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />
                        </div>

                        
                        <FormField
                            control={form.control}
                            name="correosCopia"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correos de Copia:</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="w-full"
                                            placeholder="Ingrese correos separados por coma"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-6">
                            <FormField
                                control={form.control}
                                name="vencimiento"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Marcar si tiene vencimiento</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            {form.watch("vencimiento") && (
                                <FormField
                                    control={form.control}
                                    name="fechadevencimiento"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha de ingreso:</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"
                                                                }`}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <FormField
                            control={form.control}
                            name="informativo"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Informativo</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="urgente"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Urgente</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />



                        <div className="flex justify-center">
                            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                                Enviar
                            </Button>
                        </div>
                    </form>
                </Form>

                <RecipientDialog
                    open={recipientDialogOpen}
                    onOpenChange={setRecipientDialogOpen}
                />
            </div>
        </div>
    )
}