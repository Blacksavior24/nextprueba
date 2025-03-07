'use client'

import { useCreateReceivedCardMutation, useGetCardById, useGetCards } from "@/lib/queries/cards.queries"
import { ReceivedLetterForm, receivedLetterSchema } from "@/schemas/received-letter-schema"
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
import { CalendarIcon, FolderDown, LoaderCircle, Plus } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { RecipientDialog } from "./reciepient-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from "./ui/dialog"
import { ScrollArea } from "./ui/scroll-area"
import { Switch } from "./ui/switch"
import SearchableSelect from "./SearchableSelect"
import { useGetReceiver } from "@/lib/queries/receivers.queries"
import { useGetTemas } from "@/lib/queries/themes.queries"
import { useGetEmpresas } from "@/lib/queries/companies.queries"
import { useGetAreas } from "@/lib/queries/areas.queries"
import { useGetSubAreas } from "@/lib/queries/subareas.queries"
import { DragAndDropInput } from "./drag-and-drop-input"

interface DialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    id: string
}

export function AssignForm({ open, onOpenChange, id }: DialogProps) {

    const [openPopover, setOpenPopover] = useState(false);
    const [openPopoverOne, setOpenPopoverOne] = useState(false);
    const [recipientDialogOpen, setRecipientDialogOpen] = useState(false)
    const {data: destinatarios, isLoading: isLoadingDestinatario} = useGetReceiver()
    const { data: temas, isLoading: isLoadingTemas } = useGetTemas()
    const { data: empresas, isLoading: isLoadingEmpresa } = useGetEmpresas()
    const { data: areas, isLoading: isLoadingAreas } = useGetAreas()
    const { data: subareas, isLoading: isLoadingSub } = useGetSubAreas()

    const form = useForm<ReceivedLetterForm>({
        resolver: zodResolver(receivedLetterSchema),
        defaultValues: {
            codigoRecibido: "",
            fechaIngreso: new Date(),
            destinatario: "",
            asunto: "",
            pdfInfo: undefined,
            esConfidencial: false,
            tipo: false,
            referencia: "",
            resumenRecibido: "",
            temaId: "",
            areaResponsableId: "",
            subAreaId: "",
            empresaId: "",
            nivelImpacto: "",
            correosCopia: "",
            vencimiento: false,
            fechadevencimiento: undefined,
            informativo: false,
            urgente: false,
        },
        
    })

    const { data: cards, isLoading: isLoadingCards } = useGetCards()
    const { data, error, isLoading } = useGetCardById(id, open)
    const { AlertDialog, mutation } = useCreateReceivedCardMutation(form.reset, onOpenChange)

    useEffect(() => {
        
        if (open && data) {
            
            form.setValue("codigoRecibido", data.codigoRecibido || "");
            form.setValue("destinatario", data.destinatario || "");
            form.setValue("asunto", data.asunto || "");
            form.setValue("fechaIngreso", data.fechaIngreso || new Date());
            form.setValue("esConfidencial", data.esConfidencial || false);
            form.setValue("tipo", data.tipo==="Respondido"?true:false);
            form.setValue("referencia", data.referencia || "");
            form.setValue("resumenRecibido", data.resumenRecibido || "");
            form.setValue("temaId", String(data.temaId) );
            form.setValue("areaResponsableId", String(data.areaResponsableId) );
            form.setValue("subAreaId", String(data.subAreaId) );
            form.setValue("empresaId", String(data.empresaId) );
            form.setValue("nivelImpacto", data.nivelImpacto || "");
            form.setValue("correosCopia", data.correosCopia);
            form.setValue("vencimiento", data.vencimiento || false);
            //form.setValue("fechadevencimiento", data.fechadevencimiento || new Date());
            form.setValue("informativo", data.informativo || false);
            form.setValue("urgente", data.urgente || false);
        }
        if (!open) {
            form.reset({
                codigoRecibido: "",
                fechaIngreso: new Date(),
                destinatario: "",
                asunto: "",
                pdfInfo: undefined,
                esConfidencial: false,
                tipo: false,
                referencia: "",
                resumenRecibido: "",
                temaId: "",
                areaResponsableId: "",
                subAreaId: "",
                empresaId: "",
                nivelImpacto: "",
                correosCopia: "",
                vencimiento: false,
                fechadevencimiento: new Date(),
                informativo: false,
                urgente: false,
            });
        }
    }, [data, form, open, id]) // Este effect depende de los datos de la carta y los destinatarios

    function onSubmit(data: ReceivedLetterForm) {
        mutation.mutate(data)
    }

    if (!open) return null; // No renderizar si el modal no está abierto

    // Si se está cargando alguna de las entidades, mostrar el loading
    if (isLoading || isLoadingCards || isLoadingSub || isLoadingTemas ||isLoadingAreas || isLoadingDestinatario || isLoadingEmpresa) {
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
            onOpenChange={
                (open) => { 
                    onOpenChange(open) 
                    
                }}
        >
            <DialogOverlay className={open ? "visible" : "hidden"} asChild />
            <DialogContent
                className="sm:max-w-[700px] h-[80vh] flex flex-col"
            >
                <DialogHeader>
                    <DialogTitle>
                        Generar Carta
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {error?.message}
                </DialogDescription>
                <ScrollArea className="flex-grow pr-4">

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
                                            <Popover open={openPopover} onOpenChange={setOpenPopover}>
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
                                                <PopoverContent className="w-auto p-0" align="start" forceMount>
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(date) => {
                                                            field.onChange(date)
                                                            setOpenPopover(false)
                                                        }}
                                                        initialFocus
                                                        locale={es}
                                                    />
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
                            {data?.pdfInfo ? (
                                <>
                                    <h1>Carta recibida</h1>
                                    <Button asChild >
                                        <a href={data?.pdfInfo} target="_blank" rel="noopener noreferrer">
                                            <FolderDown />
                                        </a>
                                    </Button>
                                </>
                            ) : null}
                            <FormField
                                control={form.control}
                                name="pdfInfo"
                                render={({ field: { onChange } }) => (
                                    <FormItem>
                                        <FormLabel>Carta Recibida:</FormLabel>
                                        <FormControl>
                                            {/* <Input 
                                                type="file" 
                                                onChange={(e) => onChange(e.target.files?.[0])} 
                                                {...field} 
                                                className="w-full" /> */}
                                            <DragAndDropInput onChange={(file) => onChange(file)} accept=".pdf" />
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
                                name="tipo"
                                render={({field}) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>{field.value? 'Respondido':'Recibido'}</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            {form.watch('tipo') ? <FormField
                                control={form.control}
                                name="referencia"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Referencia:</FormLabel>
                                        <SearchableSelect
                                            options={cards?.data?.map((card)=>({
                                                value: String(card.id),
                                                label: card.codigoRecibido
                                            }))}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Seleccionar la Carta a Responder"
                                        />
                                        <FormMessage className="text-red-500 text-sm" />
                                    </FormItem>
                                )}
                            />: null}
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
                                                    <SelectItem value={String(tema.id)} key={tema.id}>{tema.nombre}</SelectItem>
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
                                            <SearchableSelect
                                                options={areas && areas.map((area)=>({
                                                    value: String(area.id),
                                                    label: area.nombre
                                                }))}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Seleccionar Area"
                                            />
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
                                                        <SelectItem value={String(area.id)} key={area.id}>{area.nombre}</SelectItem>
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
                                                        <SelectItem value={String(empresa.id)} key={empresa.id}>{empresa.nombre}</SelectItem>
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
                                            <FormLabel>Vencimiento</FormLabel>
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
                                                <Popover open={openPopoverOne} onOpenChange={setOpenPopoverOne}>
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
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={(date) => {
                                                                field.onChange(date)
                                                                setOpenPopoverOne(false)
                                                            }}
                                                            initialFocus />
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
                        <RecipientDialog
                            open={recipientDialogOpen}
                            onOpenChange={setRecipientDialogOpen}
                        />
                    </Form>

                </ScrollArea>
             <AlertDialog />
            </DialogContent>
        </Dialog>
    )
}