"use client";

import { AssignForm } from "@/components/Asignar-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetCards } from "@/lib/queries/cards.queries";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { FolderDown, MoreHorizontal, Pencil, PlusSquare, RefreshCcw, Trash2 } from "lucide-react";
import { useState } from "react";

const ITEMS_PER_PAGE = 8;

export default function Page() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debounceTerm, setDebounceTerm] = useState('')
    const [searchBy, setSearchBy] = useState<string[]>(['codigoRecibido', 'destinatario', 'asunto']); // Campos de búsqueda
    const [openEdit, setOpenEdit] = useState(false);
    const [select, setSelect] = useState('');
    // Usar useGetCards con paginación y búsqueda
    const { data: cardsResponse, isLoading, refetch, error } = useGetCards(
        currentPage,
        ITEMS_PER_PAGE,
        {"estado":"Ingresado"}, // Filtros (opcional)
        debounceTerm,
        searchBy
    );

    const cards = cardsResponse?.data || [];
    const totalPages = cardsResponse?.meta.last_page || 1; // Usar meta.last_page directamente

    // Manejar la búsqueda al presionar Enter
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

    const getStatusColor = (estado: string) => {
        switch (estado.toLowerCase()) {
            case "ingresado":
                return "bg-green-100 text-green-800 border-green-300";
            case "pendiente":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "cerrado":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    return (
        <div className="container mx-auto px-10">
            <div className="rounded-md border">
                <div className="p-4">
                    <h2 className="text-2xl font-semibold text-center">
                        Control de Cartas
                    </h2>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex">
                            <Button onClick={() => refetch()}>
                                <RefreshCcw />
                            </Button>
                            <Button onClick={() => { setSelect('');  setOpenEdit(true)}}>
                                <PlusSquare />
                                Crear Carta
                            </Button>
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
                            <TableHead className="font-semibold">Destinatario</TableHead>
                            <TableHead className="font-semibold">Asunto Recibido</TableHead>
                            <TableHead className="font-semibold">Fecha Ingreso</TableHead>
                            <TableHead className="font-semibold">Carta Recibida</TableHead>
                            <TableHead className="font-semibold">Devuelto</TableHead>
                            <TableHead className="font-semibold">Estado</TableHead>
                            <TableHead className="text-right font-semibold">Acciones</TableHead>
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
                                        <Badge variant={card.devuelto ? "default" : "secondary"}>
                                            {card.devuelto ? "SI" : "NO"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${getStatusColor(card.estado)} px-2 py-1 rounded-full text-xs font-semibold`}>
                                            {card.estado}
                                        </Badge>
                                    </TableCell>
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
                                                    Actualizar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600"
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
    );
}