"use client";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, Pencil, Trash2, X } from 'lucide-react'; // Importamos el ícono X
import React, { useEffect, useState, useCallback } from 'react';
import useTemasStore from '@/store/temas.store';
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 8;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTemaName, setNewTemaName] = useState('');
  const [editingTema, setEditingTema] = useState<{ id: number; nombre: string } | null>(null);

  const { temas, loading, isUpdating, error, fetchTemas, updateTema, deleteTema, createTema } = useTemasStore();

  useEffect(() => {
    fetchTemas();
  }, [fetchTemas]);

  const filteredTemas = temas.filter((tema) =>
    tema.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredTemas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTemas = filteredTemas.slice(startIndex, endIndex);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleCreateOrUpdateTema = useCallback(async () => {
    if (!newTemaName) {
      Swal.fire('Error', 'El nombre del tema es requerido', 'error');
      return;
    }

    try {
      if (editingTema) {
        await updateTema(editingTema.id, { nombre: newTemaName });
        Swal.fire('¡Éxito!', 'El tema se actualizó correctamente.', 'success');
      } else {
        await createTema({ nombre: newTemaName });
        Swal.fire('¡Éxito!', 'El tema se creó correctamente.', 'success');
      }

      setIsModalOpen(false); // Cerrar el modal
      setNewTemaName('');
      setEditingTema(null);
      fetchTemas(); // Recargar la lista de temas
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al guardar el tema.', 'error');
    }
  }, [newTemaName, editingTema, updateTema, createTema, fetchTemas]);

  const handleEditClick = useCallback((tema: { id: number; nombre: string }) => {
    setEditingTema(tema);
    setNewTemaName(tema.nombre);
    setIsModalOpen(true); // Abrir el modal
  }, []);

  const handleDeleteTema = useCallback(async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    });

    if (result.isConfirmed) {
      try {
        await deleteTema(id);
        Swal.fire('¡Eliminado!', 'El tema ha sido eliminado.', 'success');
        fetchTemas();
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al eliminar el tema.', 'error');
      }
    }
  }, [deleteTema, fetchTemas]);

  return (
    <div className="container mx-auto px-10">
      <div className="rounded-md border">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Administración de Temas
          </h2>
          <div className="flex justify-between items-center mb-4">
            {/* Botón para abrir el modal */}
            <Button onClick={() => { setEditingTema(null); setNewTemaName(''); setIsModalOpen(true); }}>
              Agregar Tema
            </Button>

            <div className="flex items-center gap-2">
              <span>Buscar:</span>
              <Input
                type="search"
                placeholder="Buscar..."
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Table>
          <TableHeader className='bg-zinc-500/30'>
            <TableRow>
              <TableHead className='font-semibold'>Nombre</TableHead>
              <TableHead className="text-right font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-red-600">
                  Error: {error}
                </TableCell>
              </TableRow>
            ) : (
              currentTemas.map((tema) => (
                <TableRow key={tema.id}>
                  <TableCell>{tema.nombre}</TableCell>
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
                          onClick={() => handleEditClick(tema)}
                          disabled={isUpdating}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteTema(tema.id)}
                          disabled={isUpdating}
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

        {/* Modal personalizado con Tailwind CSS */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingTema ? 'Editar Tema' : 'Agregar Nuevo Tema'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)} // Cerrar el modal
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <Input
                  placeholder="Nombre del tema"
                  value={newTemaName}
                  onChange={(e) => setNewTemaName(e.target.value)}
                />
                <Button onClick={handleCreateOrUpdateTema} disabled={isUpdating}>
                  {isUpdating ? 'Guardando...' : editingTema ? 'Guardar Cambios' : 'Guardar'}
                </Button>
              </div>
            </div>
          </div>
        )}



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
      </div>
    </div>
  );
}