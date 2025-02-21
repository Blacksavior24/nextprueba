"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Pencil, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  startDate: z.date({
    required_error: "Start date is required.",
  }),
})

type Employee = z.infer<typeof formSchema>

const initialEmployee: Employee = {
  name: "John Doe",
  email: "john@example.com",
  startDate: new Date("2023-01-15"),
}

export default function EmployeeTable() {
  const [isMainDialogOpen, setIsMainDialogOpen] = React.useState(false)
  const [isNestedDialogOpen, setIsNestedDialogOpen] = React.useState(false)

  const form = useForm<Employee>({
    resolver: zodResolver(formSchema),
    defaultValues: initialEmployee,
  })

  function onSubmit(values: Employee) {
    console.log(values)
    setIsMainDialogOpen(false)
  }

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{initialEmployee.name}</TableCell>
            <TableCell>{initialEmployee.email}</TableCell>
            <TableCell>{format(initialEmployee.startDate, "PPP", { locale: es })}</TableCell>
            <TableCell>
              <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader className="flex flex-row items-center justify-between">
                    <div>
                      <DialogTitle>Edit Employee</DialogTitle>
                      <DialogDescription>Make changes to the employee information here.</DialogDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-4 rounded-full p-0 transition-colors hover:bg-red-100"
                      onClick={() => setIsMainDialogOpen(false)}
                    >
                      <X className="h-4 w-4 text-red-500 transition-colors hover:text-red-700" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <ScrollArea className="max-h-[60vh] pr-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Start Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {field.value ? (
                                        format(field.value, "PPP", { locale: es })
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    locale={es}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Dialog open={isNestedDialogOpen} onOpenChange={setIsNestedDialogOpen}>
                          <DialogTrigger asChild>
                            <Button type="button" variant="outline" className="mt-4">
                              Open Nested Dialog
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[325px]">
                            <DialogHeader>
                              <DialogTitle>Nested Dialog</DialogTitle>
                              <DialogDescription>This is a nested dialog within the main form.</DialogDescription>
                            </DialogHeader>
                            <p>You can add additional content or forms here.</p>
                            <DialogFooter>
                              <Button type="button" onClick={() => setIsNestedDialogOpen(false)}>
                                Close
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </ScrollArea>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

