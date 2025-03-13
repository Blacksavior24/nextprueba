"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGetCards } from "@/lib/queries/cards.queries"
import { FileDown, FolderDown, MoreHorizontal, Pencil, Trash2, Search, History } from 'lucide-react'
import * as XLSX from "xlsx"
import { AssignForm } from "@/components/Asignar-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TraceabilityDialog from "@/components/trazability-dialog"
import { useAuthStore } from "@/store/auth.store"

const ITEMS_PER_PAGE = 8

interface FilterState {
  [key: string]: string;
  fechaIngreso: string
  estado: string
}

export default function ReportTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [debounceTerm, setDebounceTerm] = useState('')
  const [searchBy, setSearchBy] = useState<string[]>(['codigoRecibido', 'destinatario', 'asunto'])
  const [filters, setFilters] = useState<FilterState>({
    fechaIngreso: "",
    estado: ""
  })
  const [openEdit, setOpenEdit] = useState(false)
  const [openTraza, setOpenTraza] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState("")
  const [isFiltering, setIsFiltering] = useState(false)

  const {user} = useAuthStore()

  console.log(user)
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceTerm(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const { data: cardsResponse, isLoading, refetch, error } = useGetCards(
    currentPage,
    ITEMS_PER_PAGE,
    isFiltering ? filters : undefined,
    debounceTerm,
    searchBy
  )
  
  const cards = cardsResponse?.data || []
  const totalPages = cardsResponse?.meta.last_page || 1
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  const applyFilters = () => {
    setIsFiltering(true)
    setCurrentPage(1)
    refetch()
  }

  const resetFilters = () => {
    setFilters({
      fechaIngreso: "",
      estado: ""
    })
    setIsFiltering(false)
    setCurrentPage(1)
    refetch()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyFilters()
    }
  }

  const exportToExcel = () => {
    if (!cards.length) return
    
    const dataToExport = cards.map((card) => ({
      "Código Recibido": card.codigoRecibido,
      "Destinatario": card.destinatario,
      "Asunto": card.asunto,
      "Fecha Ingreso": card.fechaIngreso,
      "Estado": card.estado,
      "Devuelto": card.devuelto ? "SI" : "NO",
      "Código Carta Anterior": card.cartaAnterior?.codigoRecibido || "",
      "Asunto Carta Anterior": card.cartaAnterior?.asunto || ""
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
      case "pendientearea":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "cerrado":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const handleEdit = (id: string) => {
    setSelectedCardId(id)
    setOpenEdit(true)
  }

  const handleDelete = (id: string) => {
    // Implement delete functionality
    if (confirm("¿Está seguro que desea eliminar esta carta?")) {
      // Call delete API
      console.log("Deleting card with ID:", id)
      // After successful deletion
      refetch()
    }
  }

  const handleTraza = (id: string) => {
    setSelectedCardId(id)
    setOpenTraza(true)
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold">Reporte de Cartas</CardTitle>
          <Button onClick={exportToExcel} variant="outline" disabled={!cards.length}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Buscar en todos los campos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select 
            value={searchBy.join(',')} 
            onValueChange={(value) => setSearchBy(value.split(','))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Buscar en..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="codigoRecibido,destinatario,asunto">Todos los campos</SelectItem>
              <SelectItem value="codigoRecibido">Código</SelectItem>
              <SelectItem value="destinatario">Destinatario</SelectItem>
              <SelectItem value="asunto">Asunto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            <Select 
              value={filters.estado} 
              onValueChange={(value) => handleFilterChange("estado", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ingresado">Ingresado</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="PendienteArea">Pendiente de Area</SelectItem>
                <SelectItem value="Cerrado">Cerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={applyFilters} className="flex-1">
              Aplicar Filtros
            </Button>
            <Button onClick={resetFilters} variant="outline" className="flex-1">
              Limpiar
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center bg-emerald-500 text-white font-bold" colSpan={7}>
                  CARTA
                </TableHead>
                <TableHead className="text-center bg-blue-500 text-white font-bold" colSpan={1}>
                  CARTA ANTERIOR
                </TableHead>
              </TableRow>
              <TableRow className="bg-muted/50">
                <TableHead className="font-bold">Código</TableHead>
                <TableHead className="font-bold">Destinatario</TableHead>
                <TableHead className="font-bold">Asunto</TableHead>
                <TableHead className="font-bold">Fecha</TableHead>
                <TableHead className="font-bold">PDF</TableHead>
                <TableHead className="font-bold">Devuelto</TableHead>
                <TableHead className="font-bold">Estado</TableHead>
                <TableHead className="font-bold">Código Anterior</TableHead>
                <TableHead className="font-bold">Trazabilidad</TableHead>
                <TableHead className="text-right font-bold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2">Cargando...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-red-600 py-8">
                    Error: No se puede obtener las cartas
                  </TableCell>
                </TableRow>
              ) : cards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    No se encontraron resultados
                  </TableCell>
                </TableRow>
              ) : (
                cards.map((card) => (
                  <TableRow key={card.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{card.codigoRecibido}</TableCell>
                    <TableCell>{card.destinatario}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={card.asunto}>
                      {card.asunto}
                    </TableCell>
                    <TableCell>{card.fechaIngreso}</TableCell>
                    <TableCell>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
                      >
                        <a href={card.pdfInfo} target="_blank" rel="noopener noreferrer">
                          <FolderDown className="mr-2 h-4 w-4" />
                          Ver PDF
                        </a>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge variant={card.devuelto ? "default" : "secondary"}>
                        {card.devuelto ? "SI" : "NO"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(card.estado)} px-2 py-1 rounded-full text-xs font-semibold`}>
                        {card.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>{card.cartaAnterior?.codigoRecibido || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center space-x-1">
                      <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-primary"
                          onClick={() => handleTraza(card.id)}
                        >
                          <History className="h-4 w-4" />
                          <span className="text-xs">Observar</span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild
                          disabled={!user?.rol?.nombre.includes("admin")}
                        >
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-blue-600 cursor-pointer"
                            onClick={() => handleEdit(card.id)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Actualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 cursor-pointer"
                            onClick={() => handleDelete(card.id)}
                          >
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t flex justify-center">
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
                        <PaginationItem key={`ellipsis-${pageNumber}`}>
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
          )}
        </div>
      </CardContent>

      {/* Edit Modal */}
      <AssignForm
        open={openEdit}
        onOpenChange={setOpenEdit}
        id={selectedCardId}
      />
      <TraceabilityDialog
        isOpen={openTraza}
        onOpenChange={setOpenTraza}
        id={selectedCardId}
      />

    </Card>
  )
}
