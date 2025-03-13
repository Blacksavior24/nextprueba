"use client"

import { useState, type KeyboardEvent, useEffect } from "react"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { UseFormReturn, FieldPath, FieldValues, PathValue } from "react-hook-form"
import SearchableSelect from "./SearchableSelect"

// Datos de ejemplo para los correos
const MOCK_EMAIL_OPTIONS = [
  { value: "juan.perez@ejemplo.com", label: "Juan Pérez (juan.perez@ejemplo.com)" },
  { value: "maria.garcia@ejemplo.com", label: "María García (maria.garcia@ejemplo.com)" },
  { value: "carlos.rodriguez@ejemplo.com", label: "Carlos Rodríguez (carlos.rodriguez@ejemplo.com)" },
  { value: "ana.martinez@ejemplo.com", label: "Ana Martínez (ana.martinez@ejemplo.com)" },
  { value: "luis.gonzalez@ejemplo.com", label: "Luis González (luis.gonzalez@ejemplo.com)" },
  { value: "laura.sanchez@ejemplo.com", label: "Laura Sánchez (laura.sanchez@ejemplo.com)" },
  { value: "pedro.diaz@ejemplo.com", label: "Pedro Díaz (pedro.diaz@ejemplo.com)" },
  { value: "sofia.lopez@ejemplo.com", label: "Sofía López (sofia.lopez@ejemplo.com)" },
  { value: "miguel.torres@ejemplo.com", label: "Miguel Torres (miguel.torres@ejemplo.com)" },
  { value: "carmen.ruiz@ejemplo.com", label: "Carmen Ruiz (carmen.ruiz@ejemplo.com)" },
]

interface MultiEmailInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  form: UseFormReturn<TFieldValues>
  name: TName
  label: string
  placeholder?: string
  externalEmails?: string[]
  emailOptions?: Array<{ value: string; label: string }>
}

export function MultiEmailInputWithSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  label,
  placeholder = "Agregar correo electrónico",
  externalEmails,
  emailOptions = MOCK_EMAIL_OPTIONS,
}: MultiEmailInputProps<TFieldValues, TName>) {
  const [inputValue, setInputValue] = useState("")
  const [selectedEmail, setSelectedEmail] = useState<string>("")

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

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const addEmail = (emailToAdd?: string): void => {
    const trimmedEmail = emailToAdd || inputValue.trim()

    if (trimmedEmail && isValidEmail(trimmedEmail) && !emails.includes(trimmedEmail)) {
      form.setValue(name, [...emails, trimmedEmail] as unknown as PathValue<TFieldValues, TName>, {
        shouldValidate: true,
        shouldDirty: true,
      })
      setInputValue("")
    }
  }

  const handleSelectChange = (value: string) => {
    setSelectedEmail(value)
    if (value) {
      addEmail(value)
      setSelectedEmail("")
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
    }
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="space-y-4">
            {/* Lista de correos seleccionados */}
            <div className="flex flex-wrap gap-2">
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

            {/* Selector de correos */}
            <div className="mb-2">
              <SearchableSelect
                options={emailOptions}
                value={selectedEmail}
                onChange={handleSelectChange}
                placeholder="Buscar contacto..."
              />
            </div>

            {/* Entrada manual de correos */}
            <div className="flex gap-2">
              <FormControl>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => inputValue.trim() && addEmail()}
                  placeholder={placeholder}
                  className="flex-1"
                />
              </FormControl>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addEmail()}
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

