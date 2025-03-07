"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FolderDown, History, ArrowLeft, ArrowRight } from "lucide-react"
import type { Card as CardInterface } from "@/interfaces/cartas.interfaces"
import { useGetCardByIdTraza } from "@/lib/queries/cards.queries"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"

// Function to get the status color
const getStatusColor = (estado: string) => {
  switch (estado.toLowerCase()) {
    case "ingresado":
      return "bg-green-100 text-green-800 border-green-300"
    case "pendiente":
      return "bg-yellow-100 text-yellow-800 border-yellow-300"
    case "cerrado":
      return "bg-red-100 text-red-800 border-red-300"
    default:
      return "bg-gray-100 text-gray-800 border-gray-300"
  }
}

// Function to recursively build the traceability chain with proper typing
const buildTraceabilityChain = (card: CardInterface): CardInterface[] => {
  const chain: CardInterface[] = []
  let currentCard = card.cartaAnterior as CardInterface | null

  while (currentCard) {
    chain.push(currentCard)
    currentCard = currentCard.cartaAnterior as CardInterface | null
  }

  return chain
}

interface TraceabilityDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  id: string
  defaultTab?: string
}

export default function TraceabilityDialog({
  isOpen,
  onOpenChange,
  id,
  defaultTab = "previous",
}: TraceabilityDialogProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  // Fetch letter data when the dialog is open
  const { data: cardResponse, isLoading, error } = useGetCardByIdTraza(id, isOpen)
  const letter = cardResponse || ({} as CardInterface)

  const traceabilityChain = letter && letter.cartaAnterior ? buildTraceabilityChain(letter) : []

  // Determine which tab to show based on available data
  const hasResponses = letter?.respuestas && letter.respuestas.length > 0
  const hasPrevious = traceabilityChain && traceabilityChain.length > 0

  // Update active tab based on available data
  const determineActiveTab = useCallback(() => {
    if (defaultTab === "previous" && !hasPrevious && hasResponses) {
      setActiveTab("responses")
    } else if (defaultTab === "responses" && !hasResponses && hasPrevious) {
      setActiveTab("previous")
    }
  }, [defaultTab, hasPrevious, hasResponses])

  useEffect(() => {
    determineActiveTab()
  }, [determineActiveTab])

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogTitle>
          Trazabilidad de Carta
        </DialogTitle>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Cargando información de trazabilidad...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>{error.message || "Error al cargar los datos"}</p>
          </div>
        ) : letter && letter.id ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center">
                <History className="mr-2 h-5 w-5" />
                Trazabilidad de Carta: {letter.codigoRecibido}
              </DialogTitle>
              <DialogDescription>
                <div className="mt-2 p-3 bg-muted/30 rounded-md">
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Destinatario:</span>
                      <p className="font-medium">{letter.destinatario}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Fecha:</span>
                      <p className="font-medium">{letter.fechaIngreso.toString()}</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs text-muted-foreground">Asunto:</span>
                    <p className="font-medium">{letter.asunto}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={`${getStatusColor(letter.estado)} px-2 py-1 rounded-full text-xs font-semibold`}>
                      {letter.estado}
                    </Badge>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      <a href={letter.pdfInfo} target="_blank" rel="noopener noreferrer">
                        <FolderDown className="mr-2 h-4 w-4" />
                        Ver PDF
                      </a>
                    </Button>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="previous" disabled={!hasPrevious} className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cartas Anteriores {hasPrevious ? `(${traceabilityChain.length})` : "(0)"}
                </TabsTrigger>
                <TabsTrigger value="responses" disabled={!hasResponses} className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Respuestas {hasResponses ? `(${letter.respuestas.length})` : "(0)"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="previous" className="mt-4">
                {hasPrevious ? (
                  <div className="space-y-4">
                    {traceabilityChain.map((prevCard, index) => (
                      <div key={prevCard.id} className="relative">
                        {/* Timeline connector */}
                        {index < traceabilityChain.length - 1 && (
                          <div
                            className="absolute left-4 top-16 bottom-0 w-0.5 bg-blue-300"
                            style={{ height: "calc(100% - 4rem)" }}
                          ></div>
                        )}

                        {/* Timeline dot */}
                        <div className="absolute left-2 top-4 w-4 h-4 rounded-full bg-blue-500 border-2 border-white z-10"></div>

                        <div className="pl-10 pb-4">
                        <Card>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-blue-700">{prevCard.codigoRecibido}</h4>
                                  <p className="text-sm text-gray-500">{prevCard.fechaIngreso}</p>
                                </div>
                                <Badge
                                  className={`${getStatusColor(prevCard.estado)} px-2 py-1 rounded-full text-xs font-semibold`}
                                >
                                  {prevCard.estado}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <div>
                                  <p className="text-xs text-muted-foreground">Destinatario</p>
                                  <p className="font-medium">{prevCard.destinatario}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Asunto</p>
                                  <p className="font-medium">{prevCard.asunto}</p>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-end pt-0">
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
                              >
                                <a href={prevCard.pdfInfo} target="_blank" rel="noopener noreferrer">
                                  <FolderDown className="mr-2 h-4 w-4" />
                                  Ver PDF
                                </a>
                              </Button>
                            </CardFooter>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No hay cartas anteriores para mostrar</div>
                )}
              </TabsContent>

              <TabsContent value="responses" className="mt-4">
                {hasResponses ? (
                  <div className="space-y-4">
                    {letter.respuestas.map((response, index) => (
                      <div key={response.id} className="relative">
                        {/* Timeline connector */}
                        {index < letter.respuestas.length - 1 && (
                          <div
                            className="absolute left-4 top-16 bottom-0 w-0.5 bg-green-300"
                            style={{ height: "calc(100% - 4rem)" }}
                          ></div>
                        )}

                        {/* Timeline dot */}
                        <div className="absolute left-2 top-4 w-4 h-4 rounded-full bg-green-500 border-2 border-white z-10"></div>

                        <div className="pl-10 pb-4">
                        <Card>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-green-700">{response.codigoRecibido}</h4>
                                  <p className="text-sm text-gray-500">{response.fechaIngreso}</p>
                                </div>
                                <Badge
                                  className={`${getStatusColor(response.estado)} px-2 py-1 rounded-full text-xs font-semibold`}
                                >
                                  {response.estado}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <div>
                                  <p className="text-xs text-muted-foreground">Destinatario</p>
                                  <p className="font-medium">{response.destinatario}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Asunto</p>
                                  <p className="font-medium">{response.asunto}</p>
                                </div>
                              </div>

                              {response.resumenRecibido && (
                                <div className="mb-3">
                                  <p className="text-xs text-muted-foreground">Resumen</p>
                                  <p className="text-sm">{response.resumenRecibido}</p>
                                </div>
                              )}
                            </CardContent>
                            <CardFooter className="flex justify-end pt-0">
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="hover:bg-green-100 hover:text-green-600 transition-colors"
                              >
                                <a href={response.pdfInfo} target="_blank" rel="noopener noreferrer">
                                  <FolderDown className="mr-2 h-4 w-4" />
                                  Ver PDF
                                </a>
                              </Button>
                            </CardFooter>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No hay respuestas para mostrar</div>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No se encontró información para mostrar</div>
        )}
      </DialogContent>
    </Dialog>
  )
}

