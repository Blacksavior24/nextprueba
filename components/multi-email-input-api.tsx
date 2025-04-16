"use client"

import type React from "react"

import { useState, type KeyboardEvent, useEffect, useRef } from "react"
import { X, Plus, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useGetUsers } from "@/lib/queries/users.queries"
import type { UseFormReturn, FieldPath, FieldValues, PathValue } from "react-hook-form"
import { Usuario } from "@/interfaces/usuarios.interfaces"

interface MultiEmailInputApiProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  form: UseFormReturn<TFieldValues>
  name: TName
  label: string
  placeholder?: string
  externalEmails?: string[]
}

export function MultiEmailInputApi<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  label,
  placeholder = "Agregar correo electrónico",
  externalEmails,
}: MultiEmailInputApiProps<TFieldValues, TName>) {
  const [inputValue, setInputValue] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [suggestionsVisible, setSuggestionsVisible] = useState(false)

  const emails = (form.watch(name) as string[]) || []

  // Efecto para actualizar los emails cuando cambia externalEmails
  useEffect(() => {
    if (externalEmails && Array.isArray(externalEmails)) {
      form.setValue(name, externalEmails as unknown as PathValue<TFieldValues, TName>, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }, [externalEmails, form, name])

  // Implementamos el debounce para la búsqueda
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(inputValue)
      if (inputValue.trim().length > 0) {
        setSuggestionsVisible(true)
      }
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [inputValue])

  // Usamos el hook de tanstack query con los parámetros especificados
  const { data, isLoading } = useGetUsers(
    1, // página
    10, // límite
    undefined, // filters undefined como especificaste
    debouncedSearchTerm, // término de búsqueda
    ["email"], // searchBy como especificaste
  )

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const addEmail = (): void => {
    const trimmedEmail = inputValue.trim()

    if (trimmedEmail && isValidEmail(trimmedEmail) && !emails.includes(trimmedEmail)) {
      form.setValue(name, [...emails, trimmedEmail] as unknown as PathValue<TFieldValues, TName>, {
        shouldValidate: true,
        shouldDirty: true,
      })
      setInputValue("")
      setSuggestionsVisible(false)
    }
  }

  const addSuggestedEmail = (email: string): void => {
    if (email && !emails.includes(email)) {
      form.setValue(name, [...emails, email] as unknown as PathValue<TFieldValues, TName>, {
        shouldValidate: true,
        shouldDirty: true,
      })
      setInputValue("")
      setSuggestionsVisible(false)
    }
  }

  const removeEmail = (index: number): void => {
    const newEmails = [...emails]
    newEmails.splice(index, 1)
    form.setValue(name, newEmails as unknown as PathValue<TFieldValues, TName>, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addEmail()
    } else if (e.key === "Escape") {
      setSuggestionsVisible(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  // Obtener el nombre completo del usuario si está disponible
  const getUserDisplayName = (user: Usuario) => {
    if (user.nombre && user.apellidos) {
      return `${user.nombre} ${user.apellidos}`
    }
    if (user.nombre) {
      return user.nombre
    }
    return null
  }

  // Cerrar sugerencias cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setSuggestionsVisible(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {emails.map((email: string, index: number) => (
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
            <div className="flex gap-2 relative">
              <div className="flex-1 relative">
                <FormControl>
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      if (inputValue.trim().length > 0) {
                        setSuggestionsVisible(true)
                      }
                    }}
                    onBlur={() => {
                      // Pequeño retraso para permitir que se haga clic en las sugerencias
                      setTimeout(() => {
                        if (inputValue.trim() && isValidEmail(inputValue.trim())) {
                          addEmail()
                        }
                      }, 200)
                    }}
                    placeholder={placeholder}
                    className="w-full pr-8"
                  />
                </FormControl>
                {isLoading && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}

                {/* Sugerencias */}
                {suggestionsVisible && inputValue.trim().length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-md">
                    {isLoading ? (
                      <div className="p-2 text-sm text-muted-foreground flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Buscando...
                      </div>
                    ) : data?.data && data.data.length > 0 ? (
                      <div className="max-h-[200px] overflow-y-auto py-1">
                        {data.data.map((user: Usuario) => (
                          <div
                            key={user.id}
                            className="px-3 py-2 hover:bg-muted cursor-pointer flex flex-col"
                            onMouseDown={(e) => {
                              // Usamos onMouseDown en lugar de onClick para que se ejecute antes del onBlur
                              e.preventDefault()
                              addSuggestedEmail(user.email)
                            }}
                          >
                            <span className="font-medium">{user.email}</span>
                            {getUserDisplayName(user) && (
                              <span className="text-xs text-muted-foreground">{getUserDisplayName(user)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground">No se encontraron resultados</div>
                    )}
                  </div>
                )}
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addEmail}
                disabled={!inputValue.trim() || !isValidEmail(inputValue.trim())}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <FormMessage className="text-red-500 text-sm" />
        </FormItem>
      )}
    />
  )
}
