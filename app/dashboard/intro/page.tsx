import { Card } from '@/components/ui/card'
import { Badge } from 'lucide-react'
import React from 'react'

export default function Intro() {
  return (
    <div className="p-4">
      <Card className="bg-zinc-100 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-zinc-800">Sistema de Cartas</h2>
          <Badge className="bg-zinc-500 text-white">GRUPO SUR</Badge>
        </div>
        <p className="mt-4 text-zinc-700">
          Sistema de cartas para la empresa <strong>GRUPO SUR</strong>.
        </p>
      </Card>
    </div>
  )
}
