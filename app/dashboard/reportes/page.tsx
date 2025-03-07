"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetCards } from "@/lib/queries/cards.queries"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { FileDown, FolderDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import * as XLSX from "xlsx"
import { AssignForm } from "@/components/Asignar-form"

const ITEMS_PER_PAGE = 8

interface FilterState {
  codigoRecibido: string
  destinatario: string
  asunto: string
  fechaIngreso: string
  estado: string
  devuelto: string
}

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceTerm, setDebounceTerm] = useState('')
  const [searchBy, setSearchBy] = useState<string[]>(['codigoRecibido', 'destinatario', 'asunto']); // Campos de búsqueda
  const [filters, setFilters] = useState<FilterState>({
    codigoRecibido: "",
    destinatario: "",
    asunto: "",
    fechaIngreso: "",
    estado: "",
    devuelto: "",
  })
  const [openEdit, setOpenEdit] = useState(false)
  const [select, setSelect] = useState("")

  // Modified to accept filter parameters
      const { data: cardsResponse, isLoading, refetch, error } = useGetCards(
          currentPage,
          ITEMS_PER_PAGE,
          undefined, // Filtros (opcional)
          debounceTerm,
          searchBy
      );

      const cards = cardsResponse?.data || [];
      const totalPages = cardsResponse?.meta.last_page || 1; // Usar meta.last_page directamente
  

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      refetch()
    }
  }

  const exportToExcel = () => {
    if (!cards) return

    const dataToExport = cards.map((card) => ({
      "Código Recibido": card.codigoRecibido,
      Destinatario: card.destinatario,
      Asunto: card.asunto,
      "Fecha Ingreso": card.fechaIngreso,
      Estado: card.estado,
      Devuelto: card.devuelto ? "SI" : "NO",
    }))

    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Cartas")
    XLSX.writeFile(wb, "reporte-cartas.xlsx")
  }

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

  return (
    <div className="container mx-auto px-10">
      <div className="rounded-md border">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Reporte de Cartas</h2>
            <Button onClick={exportToExcel} variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Exportar Excel
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Código:</label>
              <Input
                placeholder="Filtrar por código..."
                value={filters.codigoRecibido}
                onChange={(e) => handleFilterChange("codigoRecibido", e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Destinatario:</label>
              <Input
                placeholder="Filtrar por destinatario..."
                value={filters.destinatario}
                onChange={(e) => handleFilterChange("destinatario", e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Asunto:</label>
              <Input
                placeholder="Filtrar por asunto..."
                value={filters.asunto}
                onChange={(e) => handleFilterChange("asunto", e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Fecha:</label>
              <Input
                type="date"
                value={filters.fechaIngreso}
                onChange={(e) => handleFilterChange("fechaIngreso", e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Estado:</label>
              <Input
                placeholder="Filtrar por estado..."
                value={filters.estado}
                onChange={(e) => handleFilterChange("estado", e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Devuelto:</label>
              <Input
                placeholder="SI/NO"
                value={filters.devuelto}
                onChange={(e) => handleFilterChange("devuelto", e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        </div>

        {/* Rest of the table code remains the same */}
        <Table>
          <TableHeader className="bg-zinc-500/30">
            <TableRow>
                <TableHead className="text-center bg-emerald-500 text-white font-bold" colSpan={6}>
                CARTA
                </TableHead>
                <TableHead className="text-center bg-blue-500 text-white font-bold" colSpan={6}>
                CARTA ANTERIOR
                </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="font-bold">Código Recibido</TableHead>
              <TableHead className="font-bold">Destinatario</TableHead>
              <TableHead className="font-bold">Asunto Recibido</TableHead>
              <TableHead className="font-bold">Fecha Ingreso</TableHead>
              <TableHead className="font-bold">Carta Recibida</TableHead>
              <TableHead className="font-bold">Devuelto</TableHead>
              <TableHead className="font-bold">Estado</TableHead>
              <TableHead className="font-bold">Código de Carta Anterior</TableHead>
              <TableHead className="font-bold">Asunto de Carta Anterior</TableHead>
              <TableHead className="text-right font-bold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-red-600">
                  Error: No se puede obtener las cartas
                </TableCell>
              </TableRow>
            ) : (
              cards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell>{card.codigoRecibido}</TableCell>
                  <TableCell>{card.destinatario}</TableCell>
                  <TableCell>{card.asunto}</TableCell>
                  <TableCell>{card.fechaIngreso.toString()}</TableCell>
                  {/* <TableCell>{card.areaResponsable.nombre}</TableCell>
                  <TableCell>{card.subArea.nombre}</TableCell>
                  <TableCell>{card.temaRelacion.nombre}</TableCell> */}
                  <TableCell>
                    <Button
                      asChild
                      variant="outline"
                      className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      <a href={card.pdfInfo} target="_blank" rel="noopener noreferrer">
                        <FolderDown className="mr-2 h-4 w-4" />
                        Ver Pdf
                      </a>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge variant={card.devuelto ? "default" : "secondary"}>{card.devuelto ? "SI" : "NO"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(card.estado)} px-2 py-1 rounded-full text-xs font-semibold`}>
                      {card.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>{card.cartaAnterior?.codigoRecibido}</TableCell>
                  <TableCell>{card.cartaAnterior?.asunto}</TableCell>
                  {/* <TableCell>{card.cartaAnterior?.areaResponsable.nombre}</TableCell>
                  <TableCell>{card.cartaAnterior?.subArea.nombre}</TableCell>
                  <TableCell>{card.cartaAnterior?.temaRelacion.nombre}</TableCell> */}

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-blue-600"
                          onClick={() => {
                            setOpenEdit(true)
                            setSelect(card.id)
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Actualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {pageNumbers.map((pageNumber) => {
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(pageNumber)
                        }}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }
                return null
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <AssignForm
                            open={openEdit}
                            onOpenChange={setOpenEdit}
                            id={select}
                        />
      </div>
    </div>
  )
}

