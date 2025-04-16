"use client"

import { useState, useEffect, useRef } from "react"
import { X, Check, Loader2, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useGetUsers } from "@/lib/queries/users.queries" // Importamos el hook
import type { UseFormReturn, FieldPath, FieldValues, PathValue } from "react-hook-form"
import { Usuario } from "@/interfaces/usuarios.interfaces"

interface MultiEmailSearchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  form: UseFormReturn<TFieldValues>
  name: TName
  label: string
  placeholder?: string
}

export function MultiEmailSearch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ form, name, label, placeholder = "Buscar correo electrónico" }: MultiEmailSearchProps<TFieldValues, TName>) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  const selectedEmails = (form.watch(name) as string[]) || []

  // Implementamos el debounce para la búsqueda
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchTerm])

  // Usamos el hook de tanstack query con los parámetros especificados
  const { data, isLoading } = useGetUsers(
    1, // página
    10, // límite
    undefined, // filters undefined como especificaste
    debouncedSearchTerm, // término de búsqueda
    ["email"], // searchBy como especificaste
  )

  // Función para manejar el cambio en el input de búsqueda
  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  // Agregar un correo electrónico seleccionado
  const addEmail = (email: string): void => {
    if (email && !selectedEmails.includes(email)) {
      form.setValue(name, [...selectedEmails, email] as unknown as PathValue<TFieldValues, TName>, {
        shouldValidate: true,
        shouldDirty: true,
      })
      setSearchTerm("")
    }
  }

  // Eliminar un correo electrónico
  const removeEmail = (index: number): void => {
    const newEmails = [...selectedEmails]
    newEmails.splice(index, 1)
    form.setValue(name, newEmails as unknown as PathValue<TFieldValues, TName>, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  // Obtener el nombre completo del usuario si está disponible
  const getUserDisplayName = (user: Usuario) => {
    if (user.nombre) {
      return `${user.nombre}`
    }
    if (user.nombre) {
      return user.nombre
    }
    return null
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedEmails.map((email: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-2">
                  {email}
                  <button
                    type="button"
                    onClick={() => removeEmail(index)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <div className="flex items-center relative">
                    <Input
                      placeholder={placeholder}
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      onClick={() => setOpen(true)}
                      className="w-full pr-10"
                    />
                    <Search className="absolute right-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[300px]" align="start">
                <Command>
                  <CommandInput
                    placeholder="Buscar correo electrónico"
                    value={searchTerm}
                    onValueChange={handleSearch}
                  />
                  <CommandList>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>No se encontraron resultados</CommandEmpty>
                        <CommandGroup>
                          {data?.data &&
                            data.data.map((user) => {
                              const isSelected = selectedEmails.includes(user.email)
                              const displayName = getUserDisplayName(user)

                              return (
                                <CommandItem
                                  key={user.id}
                                  value={user.email}
                                  onSelect={() => {
                                    if (!isSelected) {
                                      addEmail(user.email)
                                    }
                                    setOpen(false)
                                  }}
                                  className={cn("flex items-center justify-between", isSelected && "opacity-50")}
                                  disabled={isSelected}
                                >
                                  <div>
                                    <p>{user.email}</p>
                                    {displayName && <p className="text-xs text-muted-foreground">{displayName}</p>}
                                  </div>
                                  {isSelected && <Check className="h-4 w-4" />}
                                </CommandItem>
                              )
                            })}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage className="text-red-500 text-sm" />
        </FormItem>
      )}
    />
  )
}
