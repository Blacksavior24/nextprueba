"use client"
import { AssignForm } from "@/components/Asignar-form";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetCards } from "@/lib/queries/cards.queries";
import { FolderDown, MoreHorizontal, Pencil, RefreshCcw } from "lucide-react";
import { useState } from "react";

const ITEMS_PER_PAGE = 8;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceTerm, setDebounceTerm] = useState('')
  const [searchBy, setSearchBy] = useState<string[]>(['codigoRecibido', 'destinatario', 'asunto']); // Campos de búsqueda
  const [openEdit, setOpenEdit] = useState(false);
  const [select, setSelect] = useState('');
  const { data: cardsResponse, isLoading, refetch, error } = useGetCards(
    currentPage,
    ITEMS_PER_PAGE,
    undefined, // Filtros (opcional)
    debounceTerm,
    searchBy
  );

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

  return (
    <div className="container mx-auto px-10">
      <div className="rounded-md border">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-center">
            Pendientes
          </h2>
          <div className="flex justify-between items-center mb-4">
            <Button onClick={() => { refetch(); console.log("actualiza modo sync"); }}>
              <RefreshCcw />
            </Button>
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
              <TableHead className="font-semibold">Destinatario</TableHead>
              <TableHead className="font-semibold">Asunto Recibido</TableHead>
              <TableHead className="font-semibold">Carta Recibida</TableHead>
              <TableHead className="font-semibold">Empresa</TableHead>
              <TableHead className="font-semibold">Area</TableHead>
              <TableHead className="font-semibold">Sub Area</TableHead>
              <TableHead className="font-semibold">Informativo</TableHead>
              <TableHead className="font-semibold">Plazo</TableHead>
              <TableHead className="font-semibold">Vencimiento</TableHead>
              <TableHead className="font-semibold">Devuelto</TableHead>
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
                  <TableCell>{card.destinatario}</TableCell>
                  <TableCell>{card.asunto}</TableCell>
                  <TableCell>
                    <Button asChild >
                      <a href={card.pdfInfo} target="_blank" rel="noopener noreferrer">
                        <FolderDown />
                      </a>
                    </Button>
                  </TableCell>
                  <TableCell>{card.empresa?.nombre || '-'}</TableCell>
                  <TableCell>{card.areaResponsable?.nombre || '-'}</TableCell>
                  <TableCell>{card.subArea?.nombre || '-'}</TableCell>
                  <TableCell>{card.informativo ? 'SI' : 'NO'}</TableCell>
                  <TableCell>{card.fechaIngreso ? 'En plazo' : 'Fuera de plazo'}</TableCell>
                  <TableCell>{card.fechadevencimiento?.toString() || '-'}</TableCell>
                  <TableCell>{card.devuelto}</TableCell>
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
                        //disabled={isUpdating}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem
                          className="text-red-600"
                          //onClick={() => handleDeleteEmpresa(empresa.id)}
                          //disabled={isUpdating}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem> */}
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

        <AssignForm
          open={openEdit}
          onOpenChange={setOpenEdit}
          id={select}
        />
      </div>
    </div>
  )
}

