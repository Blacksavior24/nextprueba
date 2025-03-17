"use client"
import { AssignForm } from "@/components/Asignar-form";
import { PendingForm } from "@/components/Pendiente-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useClosePendingCardMutation, useGetCardsPending } from "@/lib/queries/cards.queries";
import { useAuthStore } from "@/store/auth.store";
import { FolderDown, MailOpen, MessageSquareOff, MoreHorizontal, Pencil, PlusSquare, RefreshCcw } from "lucide-react";
import { useState } from "react";

const ITEMS_PER_PAGE = 8;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceTerm, setDebounceTerm] = useState('')
  const [searchBy, setSearchBy] = useState<string[]>(['codigoRecibido', 'destinatario', 'asunto']); // Campos de búsqueda
  const [openEdit, setOpenEdit] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [select, setSelect] = useState('');

  const { user } = useAuthStore()

  // Determina el subAreaId basado en el rol del usuario
  const subAreaId = user?.rol?.nombre === "admin" ? 0 : user?.subAreaId || 0;

  const { data: cardsResponse, isLoading, refetch, error } = useGetCardsPending(
    subAreaId,
    currentPage,
    ITEMS_PER_PAGE,
    undefined, // Filtros (opcional)
    debounceTerm,
    searchBy
  );

  const { AlertDialog, mutation: ClosePendingMutation} = useClosePendingCardMutation()

  const cards = cardsResponse?.data || [];
  const totalPages = cardsResponse?.meta.last_page || 1; // Usar meta.last_page directamente

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setDebounceTerm(searchTerm)
      setCurrentPage(1); // Reiniciar a la primera página al buscar
      refetch(); // Volver a cargar los datos
    }
  };

  // Cambiar los campos de búsqueda
  const handleSearchByChange = (field: string) => {
    setSearchBy((prev) =>
      prev.includes(field)
        ? prev.filter((f) => f !== field) // Remover si ya está seleccionado
        : [...prev, field] // Agregar si no está seleccionado
    );
  };

  const getStatusColor = (plazo: string) => {
    switch (plazo) {
      case "En plazo":
        return "bg-green-100 text-green-800 border-green-300"
      case "Fuera de plazo":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }
  const normalizarFecha = (fecha: Date): Date => {
    return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  };
  const compararFechas = (fechaIngreso: string, fechaVencimiento: string | null): string => {
    const fechaActual = normalizarFecha(new Date());
    const fechaIngresoDate = normalizarFecha(new Date(fechaIngreso));
    const fechaVencimientoDate = fechaVencimiento ? normalizarFecha(new Date(fechaVencimiento)) : null;
    if (!fechaVencimientoDate) {
      return "En plazo";
    }
    if (fechaVencimientoDate < fechaActual) {
      return "Fuera de plazo";
    }
    if (fechaIngresoDate > fechaActual) {
      return "En plazo";
    }
    return "En plazo";
  };

  const handleCloseCard = (id: string) => {
    ClosePendingMutation.mutate(id)
    refetch()
  }

  return (
    <div className="container mx-auto px-10">
      <AlertDialog />
      <div className="rounded-md border">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-center">
            Pendientes
          </h2>
          <div className="flex justify-between items-center mb-4">
          <div className="flex">
                            <Button onClick={() => refetch()}>
                                <RefreshCcw />
                            </Button>
                            { subAreaId === 0  &&<Button onClick={() => { setSelect('');  setOpenNew(true)}}>
                                <PlusSquare />
                                Crear Carta
                            </Button>}
                        </div>
            <div className="flex items-center gap-2">
              <span>Buscar:</span>
              <Input
                type="search"
                placeholder="Buscar..."
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch} // Buscar al presionar Enter
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Buscar por
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {['codigoRecibido', 'destinatario', 'asunto'].map((field) => (
                    <DropdownMenuItem
                      key={field}
                      onSelect={() => handleSearchByChange(field)}
                    >
                      {field}
                      {searchBy.includes(field) && (
                        <span className="ml-2">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <Table>
          <TableHeader className="bg-zinc-500/30">
            <TableRow>
              <TableHead className="font-semibold">Código Recibido</TableHead>
              <TableHead className="font-semibold">Fecha Ingreso</TableHead>
              <TableHead className="font-semibold">De</TableHead>
              <TableHead className="font-semibold">Para/Destinatario</TableHead>
              <TableHead className="font-semibold">Asunto Recibido</TableHead>
              <TableHead className="font-semibold">Carta Recibida</TableHead>
              <TableHead className="font-semibold">Area</TableHead>
              <TableHead className="font-semibold">Sub Area</TableHead>
              <TableHead className="font-semibold">Informativo</TableHead>
              <TableHead className="font-semibold">Plazo</TableHead>
              <TableHead className="font-semibold">Vencimiento</TableHead>
              <TableHead className="text-right font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-red-600">
                  Error: No se puede obtener las cartas
                </TableCell>
              </TableRow>
            ) : (
              cards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell>{card.codigoRecibido || '-'}</TableCell>
                  <TableCell>{card.fechaIngreso?.toString() || '-'}</TableCell>
                  <TableCell>{card.empresa?.nombre || '-'}</TableCell>
                  <TableCell>{card.destinatario}</TableCell>
                  <TableCell>{card.asunto}</TableCell>
                  <TableCell>
                    <Button asChild >
                      <a href={card.pdfInfo} target="_blank" rel="noopener noreferrer">
                        <FolderDown />
                      </a>
                    </Button>
                  </TableCell>
                  <TableCell>{card.areaResponsable?.nombre || '-'}</TableCell>
                  <TableCell>{card.subArea?.nombre || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={card.informativo ? "default" : "secondary"}>
                      {card.informativo ? "SI" : "NO"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(compararFechas(card.fechaIngreso, card.fechadevencimiento))} px-2 py-1 rounded-full text-xs font-semibold`}>
                      {compararFechas(card.fechaIngreso, card.fechadevencimiento)}
                    </Badge>
                  </TableCell>
                  <TableCell>{card.fechadevencimiento?.toString() || '-'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-blue-600"
                          onClick={() => { setOpenEdit(true); setSelect(card.id) }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Responder
                        </DropdownMenuItem>
                        {user?.rol?.nombre === 'admin' ? (<DropdownMenuItem
                          className="text-green-600"
                          onClick={() => { setOpenNew(true); setSelect(card.id) }}
                        >
                          <MailOpen className="mr-2 h-4 w-4" />
                          Editar carta
                        </DropdownMenuItem>): null}
                        {user?.rol?.nombre === 'admin' ? (<DropdownMenuItem
                          className="text-red-600"
                          onClick={() => { handleCloseCard(card.id) }}
                        >
                          <MessageSquareOff className="mr-2 h-4 w-4" />
                          Cerrar carta
                        </DropdownMenuItem>): null}
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
                    e.preventDefault();
                    setCurrentPage((page) => Math.max(1, page - 1));
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(pageNumber);
                    }}
                    isActive={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((page) => Math.min(totalPages, page + 1));
                  }}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <PendingForm
          open={openEdit}
          onOpenChange={setOpenEdit}
          id={select}
        />
        <AssignForm
         open={openNew}
         onOpenChange={setOpenNew}
         id={select}
        />
      </div>
    </div>
  )
}

