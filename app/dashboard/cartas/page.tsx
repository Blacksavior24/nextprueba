"use client"

import { AssignForm } from "@/components/Asignar-form"
import { Button } from "@/components/ui/button"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetCards } from "@/lib/queries/cards.queries"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { FolderDown, MoreHorizontal, Pencil, PlusSquare, RefreshCcw, Trash2 } from "lucide-react"
import { useState } from "react"

const ITEMS_PER_PAGE = 8

export default function Page() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [openEdit, setOpenEdit] = useState(false);
    const [select, setSelect] = useState('');
    const { data: cards, isLoading, refetch, error } = useGetCards()

    const filteredCards = cards?.filter((card) =>
        card.codigoRecibido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.destinatario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.asunto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCardsSafe = filteredCards || [];

    const totalPages = Math.ceil(filteredCardsSafe.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentCards = filteredCardsSafe.slice(startIndex, endIndex);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);


    return (
        <div className="container mx-auto px-10">
            <div className="rounded-md border">
                <div className="p-4">
                    <h2 className="text 2xl font-semibold text-center">
                        Control de Cartas
                    </h2>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex">
                        <Button>
                            <RefreshCcw />
                        </Button>
                        <Button>
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

                            />
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
                            currentCards.map((card) => (
                                <TableRow key={card.id}>
                                    <TableCell>{card.codigoRecibido}</TableCell>
                                    <TableCell>{card.destinatario}</TableCell>
                                    <TableCell>{card.asunto}</TableCell>
                                    <TableCell>{card.fechaIngreso.toString()}</TableCell>
                                    <TableCell>
                                        <Button asChild >
                                            <a href={card.pdfInfo} target="_blank" rel="noopener noreferrer">
                                                <FolderDown />
                                            </a>
                                        </Button>
                                    </TableCell>
                                    <TableCell>{card.devuelto ? 'SI' : 'NO'}</TableCell>
                                    <TableCell>{card.estado}</TableCell>
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
                                                    onClick={() => { }}
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Actualizar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                //onClick={() => handleDeleteEmpresa(empresa.id)}
                                                //disabled={isUpdating}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                        }
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
                                                    e.preventDefault();
                                                    setCurrentPage(pageNumber);
                                                }}
                                                isActive={currentPage === pageNumber}
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                } else if (
                                    pageNumber === currentPage - 2 ||
                                    pageNumber === currentPage + 2
                                ) {
                                    return (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    );
                                }
                                return null;
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage((page) => Math.min(totalPages, page + 1));
                                    }}
                                    className={
                                        currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                                    }
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