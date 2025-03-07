"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const initialData = {
  enPosesion: 25,
  respondidas: 40,
  informativas: 15,
  pendientes: 20,
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function DashboardCartas() {
  const [data, setData] = useState(initialData)

  const barChartData = [
    { name: "En Posesión", value: data.enPosesion },
    { name: "Respondidas", value: data.respondidas },
    { name: "Informativas", value: data.informativas },
    { name: "Pendientes", value: data.pendientes },
  ]

  const pieChartData = [
    { name: "En Posesión", value: data.enPosesion },
    { name: "Respondidas", value: data.respondidas },
    { name: "Informativas", value: data.informativas },
    { name: "Pendientes", value: data.pendientes },
  ]

  const totalCartas = Object.values(data).reduce((sum, value) => sum + value, 0)

  const handleSimulateUpdate = () => {
    setData({
      enPosesion: Math.floor(Math.random() * 50),
      respondidas: Math.floor(Math.random() * 60),
      informativas: Math.floor(Math.random() * 30),
      pendientes: Math.floor(Math.random() * 40),
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard de Cartas</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>En Posesión</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">{data.enPosesion}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Respondidas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">{data.respondidas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Informativas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-yellow-600">{data.informativas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-600">{data.pendientes}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Cartas</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proporción de Cartas</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            Total de cartas: <span className="font-bold">{totalCartas}</span>
          </p>
          <div className="flex justify-between items-center">
            <Button onClick={() => console.log("Navegando a pendientes")}>Ver Pendientes</Button>
            <Button variant="outline" onClick={handleSimulateUpdate}>
              Simular Actualización
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

