// "use client"

// import { useEffect, useState } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { CalendarIcon, Plus } from "lucide-react"
// import { format } from "date-fns"
// import { es } from "date-fns/locale"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Textarea } from "@/components/ui/textarea"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Calendar } from "@/components/ui/calendar"
// import { RecipientDialog } from "@/components/reciepient-dialog";
// import { receivedLetterSchema, type ReceivedLetterForm } from "@/schemas/received-letter-schema"
// import useDestinatariosStore from "@/store/destinatarios.store"
// import { useCreateReceivedCardMutation } from "@/lib/queries/cards.queries"

// export default function Page() {
//   const [recipientDialogOpen, setRecipientDialogOpen] = useState(false)
//   const { destinatarios, fetchDestinatarios } = useDestinatariosStore()

//   const form = useForm<ReceivedLetterForm>({
//     resolver: zodResolver(receivedLetterSchema),
//     defaultValues: {
//       esConfidencial: false,
//     },
//   })

//   const { mutate :  createReceivedCard } = useCreateReceivedCardMutation(form.reset)

  
//   useEffect(() => {
//     fetchDestinatarios()
//   }, [fetchDestinatarios])
  

//   function onSubmit(data: ReceivedLetterForm) {
//     createReceivedCard(data)
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-2xl font-semibold text-center mb-6">Carta</h1>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <FormField
//             control={form.control}
//             name="codigoRecibido"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Código Recibido:</FormLabel>
//                 <FormControl>
//                   <Input {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="fechaIngreso"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Fecha de ingreso:</FormLabel>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <FormControl>
//                       <Button
//                         variant="outline"
//                         className={`w-full justify-start text-left font-normal ${
//                           !field.value && "text-muted-foreground"
//                         }`}
//                       >
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
//                       </Button>
//                     </FormControl>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
//                   </PopoverContent>
//                 </Popover>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <div className="flex gap-2">
//             <FormField
//               control={form.control}
//               name="destinatario"
//               render={({ field }) => (
//                 <FormItem className="flex-1">
//                   <FormLabel>Destinatario:</FormLabel>
//                   <Select onValueChange={field.onChange} value={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="--Seleccionar--" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="default">--Seleccionar--</SelectItem> {/* Changed default value */}
//                       {destinatarios?.map((recipient) => (
//                         <SelectItem key={recipient.id} value={recipient.nombre}>
//                           {recipient.nombre}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button
//               type="button"
//               variant="outline"
//               size="icon"
//               className="mt-8"
//               onClick={() => setRecipientDialogOpen(true)}
//             >
//               <Plus className="h-4 w-4" />
//             </Button>
//           </div>

//           <FormField
//             control={form.control}
//             name="asunto"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Asunto Recibido:</FormLabel>
//                 <FormControl>
//                   <Textarea {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="pdfInfo"
//             render={({ field: { value, onChange, ...field } }) => (
//               <FormItem>
//                 <FormLabel>Carta Recibida:</FormLabel>
//                 <FormControl>
//                   <Input type="file" onChange={(e) => onChange(e.target.files?.[0])} {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="esConfidencial"
//             render={({ field }) => (
//               <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                 <FormControl>
//                   <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                 </FormControl>
//                 <div className="space-y-1 leading-none">
//                   <FormLabel>Marcar solo en caso sera confidencial</FormLabel>
//                 </div>
//               </FormItem>
//             )}
//           />

//           <div className="flex justify-center ">
//             <Button type="submit">Enviar</Button>
//             {/* <Button type="button" variant="secondary">
//               Continuar
//             </Button> */}
//           </div>
//         </form>
//       </Form>

//       <RecipientDialog
//         open={recipientDialogOpen}
//         onOpenChange={setRecipientDialogOpen}
//       />
//     </div>
//   )
// }

