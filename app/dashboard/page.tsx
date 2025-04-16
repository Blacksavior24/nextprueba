"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Cell, Pie, PieChart } from "recharts"
import { AlertCircle, CheckCircle, Clock, FileText, Info, TrendingUp } from "lucide-react"
import { useGetStats } from "@/lib/queries/cards.queries"
import { useAuthStore } from "@/store/auth.store"

// Colores para los gráficos
const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"]

export default function DashboardCartas() {

  const { user } = useAuthStore()
  const { data, isLoading } = useGetStats(String(user?.id))
  const isAdmin = user?.rol?.nombre
  // Datos para el gráfico de barras
  const barChartData = [
    { name: "Respondidas", value: data?.cartasRespondidas },
    { name: "Informativas", value: data?.cartasInformativas },
    { name: "Urgentes", value: data?.cartasUrgentes },
    { name: "Vencidas", value: data?.cartasVencidas },
  ]
  // Datos para el gráfico circular
  const pieChartData = [
    { name: "Respondidas", value: data?.cartasRespondidas },
    { name: "Informativas", value: data?.cartasInformativas },
    { name: "Urgentes", value: data?.cartasUrgentes },
    { name: "Vencidas", value: data?.cartasVencidas },
  ]
  // Calcular cartas pendientes (total - respondidas)
  const cartasPendientes = data?.total - data?.cartasRespondidas

  if (isLoading) {
    return (<>
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Cargando...</span>
      </div>
    </>)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard de Cartas</h1>
      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="details">Detalles</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Tarjetas principales */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cartas Respondidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <div className="text-2xl font-bold">{data.cartasRespondidas}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{data.porcentajeRespuesta}% del total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cartas Informativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Info className="h-5 w-5 text-blue-500 mr-2" />
                  <div className="text-2xl font-bold">{data.cartasInformativas}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((data.cartasInformativas / data.total) * 100)}% del total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cartas Urgentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                  <div className="text-2xl font-bold">{data.cartasUrgentes}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((data.cartasUrgentes / data.total) * 100)}% del total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cartas Vencidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-red-500 mr-2" />
                  <div className="text-2xl font-bold">{data.cartasVencidas}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((data.cartasVencidas / data.total) * 100)}% del total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tarjeta de progreso */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Porcentaje de Respuesta</CardTitle>
              <CardDescription>Cartas respondidas vs. total de cartas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progreso</span>
                  <span className="text-sm font-medium">{data.porcentajeRespuesta}%</span>
                </div>
                <Progress value={data.porcentajeRespuesta} className="h-2" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-muted-foreground">Respondidas</span>
                  </div>
                  <div className="font-medium mt-1">{data.cartasRespondidas}</div>
                </div>
                <div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div>
                    <span className="text-muted-foreground">Pendientes</span>
                  </div>
                  <div className="font-medium mt-1">{cartasPendientes}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPIs para administradores */}
          {isAdmin && data.kpis && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pendientes Globales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.kpis.pendientesGlobales}</div>
                  <p className="text-xs text-muted-foreground mt-1">Cartas pendientes en todo el sistema</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tasa de Respuesta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(data.kpis.tasaRespuesta * 100).toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Promedio de respuestas por día</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Eficiencia en Plazos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(data.kpis.eficienciaPlazos * 100).toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Respuestas dentro del plazo establecido</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.kpis.tiempoPromedioDias} días</div>
                  <p className="text-xs text-muted-foreground mt-1">Tiempo promedio de respuesta</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Gráficos */}
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Cartas</CardTitle>
                <CardDescription>Desglose por tipo de carta</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    respondidas: {
                      label: "Respondidas",
                      color: COLORS[0],
                    },
                    informativas: {
                      label: "Informativas",
                      color: COLORS[1],
                    },
                    urgentes: {
                      label: "Urgentes",
                      color: COLORS[2],
                    },
                    vencidas: {
                      label: "Vencidas",
                      color: COLORS[3],
                    },
                  }}
                  className="h-full"
                >
                  <BarChart
                    data={barChartData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 10,
                      bottom: 20,
                    }}
                  >
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={4}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proporción de Cartas</CardTitle>
                <CardDescription>Distribución porcentual por tipo</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    respondidas: {
                      label: "Respondidas",
                      color: COLORS[0],
                    },
                    informativas: {
                      label: "Informativas",
                      color: COLORS[1],
                    },
                    urgentes: {
                      label: "Urgentes",
                      color: COLORS[2],
                    },
                    vencidas: {
                      label: "Vencidas",
                      color: COLORS[3],
                    },
                  }}
                  className="h-full"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Resumen Detallado</CardTitle>
              <CardDescription>Información completa sobre el estado de las cartas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Total de Cartas</h3>
                    <p className="text-2xl font-bold">{data.total}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Porcentaje de Respuesta</h3>
                    <p className="text-2xl font-bold">{data.porcentajeRespuesta}%</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Desglose por Tipo</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span>Respondidas</span>
                      </div>
                      <span className="font-medium">{data.cartasRespondidas}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span>Informativas</span>
                      </div>
                      <span className="font-medium">{data.cartasInformativas}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                        <span>Urgentes</span>
                      </div>
                      <span className="font-medium">{data.cartasUrgentes}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span>Vencidas</span>
                      </div>
                      <span className="font-medium">{data.cartasVencidas}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                        <span>Pendientes</span>
                      </div>
                      <span className="font-medium">{cartasPendientes}</span>
                    </div>
                  </div>
                </div>

                {isAdmin && data.kpis && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">KPIs de Administrador</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Pendientes Globales</span>
                        <span className="font-medium">{data.kpis.pendientesGlobales}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tasa de Respuesta</span>
                        <span className="font-medium">{(data.kpis.tasaRespuesta * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Eficiencia en Plazos</span>
                        <span className="font-medium">{(data.kpis.eficienciaPlazos * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tiempo Promedio</span>
                        <span className="font-medium">{data.kpis.tiempoPromedioDias} días</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => console.log("Exportar datos")}>
                Exportar Datos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => console.log("Ver cartas pendientes")}
            >
              <FileText className="h-4 w-4" />
              <span>Ver Pendientes ({cartasPendientes})</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => console.log("Ver cartas urgentes")}
            >
              <AlertCircle className="h-4 w-4" />
              <span>Ver Urgentes ({data.cartasUrgentes})</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => console.log("Ver estadísticas")}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Estadísticas Completas</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
