"use client"

import { useState, type KeyboardEvent } from "react"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { UseFormReturn, FieldPath, FieldValues } from "react-hook-form"

interface MultiEmailInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  form: UseFormReturn<TFieldValues>
  name: TName
  label: string
  placeholder?: string
}

export function MultiEmailInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ form, name, label, placeholder = "Agregar correo electrónico" }: MultiEmailInputProps<TFieldValues, TName>) {
  const [inputValue, setInputValue] = useState("")

  const emails = (form.watch(name) as string[]) || []

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const addEmail = (): void => {
    const trimmedEmail = inputValue.trim()

    if (trimmedEmail && isValidEmail(trimmedEmail) && !emails.includes(trimmedEmail)) {
      form.setValue(name, [...emails, trimmedEmail] as any)
      setInputValue("")
    }
  }

  const removeEmail = (index: number): void => {
    const newEmails = [...emails]
    newEmails.splice(index, 1)
    form.setValue(name, newEmails as any)
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
      render={({ field }) => (
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

