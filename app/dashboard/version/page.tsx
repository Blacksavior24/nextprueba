import { Card } from '@/components/ui/card'
import { Badge } from 'lucide-react'
import React from 'react'

export default function Version() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-50">
      <Card className="bg-zinc-100 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-zinc-800">Versión 0.0.1</h2>
          <Badge className="bg-zinc-500 text-white">Diciembre 2024</Badge>
        </div>

        <p className="text-zinc-700 mb-6">
          Esta es la primera versión del sistema, lanzada en diciembre de 2024.
        </p>

        <h3 className="text-xl font-semibold text-zinc-800 mb-2">Registro de Cambios:</h3>
        <ul className="list-disc pl-5 text-zinc-700">
          <li>Interfaces de formularios</li>
          <li>Interfaces de diálogos</li>
          <li>Componentes básicos</li>
          <li>Y más...</li>
        </ul>
      </Card>
    </div>
  )
}
