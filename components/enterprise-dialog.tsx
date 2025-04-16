"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCreateEmpresa } from "@/lib/queries/companies.queries"


interface EnterpriseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EnterpriseDialog({ open, onOpenChange }: EnterpriseDialogProps) {


  const {mutation} = useCreateEmpresa()

  const [formData, setFormData] = useState({
    nombre: "",
  })

  const handleSubmit = async() => {
    mutation.mutate(formData)
    
    if (!mutation.error) {
    setFormData({
      nombre: ''
    })
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Administración de Empresas / De</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          
        </DialogDescription>
        <div className="grid gap-4 py-4" >
          <div className="grid gap-2">
            <Input
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
          </div>
          {mutation.error && 
              <div className='bg-red-500 p-3 rounded-lg '>
                <p className="text-red-50 text-sm text-center font-bold">
                  {mutation.error}
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

