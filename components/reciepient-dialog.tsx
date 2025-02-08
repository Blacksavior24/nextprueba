"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useDestinatariosStore from "@/store/destinatarios.store"

interface RecipientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecipientDialog({ open, onOpenChange }: RecipientDialogProps) {

  const { isLoading, error, createDestinatario } = useDestinatariosStore()

  const [formData, setFormData] = useState({
    tipodoc: "",
    numdoc: "",
    nombre: "",
  })

  const handleSubmit = async() => {
    await createDestinatario(formData)
    if (!error) {
    setFormData({
      tipodoc: '',
      nombre: '',
      numdoc: ''
    })
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="Destinatarios form">
        <DialogHeader>
          <DialogTitle>Administración de Destinatario</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Select value={formData.tipodoc} onValueChange={(value) => setFormData({ ...formData, tipodoc: value })}>
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
              value={formData.numdoc}
              onChange={(e) => setFormData({ ...formData, numdoc: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Input
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
          </div>
          {error && 
              <div className='bg-red-500 p-3 rounded-lg '>
                <p className="text-red-50 text-sm text-center font-bold">
                  {error}
                </p>
              </div>
              }
          <Button
            onClick={() => {
              handleSubmit()
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

