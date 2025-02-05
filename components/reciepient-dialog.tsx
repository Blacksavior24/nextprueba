"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RecipientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: { tipo: string; numero: string; nombre: string }) => void
}

export function RecipientDialog({ open, onOpenChange, onSave }: RecipientDialogProps) {
  const [formData, setFormData] = useState({
    tipo: "",
    numero: "",
    nombre: "",
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Administración de Destinatario</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
              <SelectTrigger>
                <SelectValue placeholder="--Seleccionar--" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">--Seleccionar--</SelectItem>
                <SelectItem value="DNI">DNI</SelectItem>
                <SelectItem value="RUC">RUC</SelectItem>
                <SelectItem value="SIN_DOCUMENTO">SIN DOCUMENTO</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Input
              placeholder="Numero Documento"
              value={formData.numero}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Input
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
          </div>
          <Button
            onClick={() => {
              onSave(formData)
              onOpenChange(false)
            }}
          >
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

