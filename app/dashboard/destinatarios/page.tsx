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
import Swal from 'sweetalert2';
import useDestinatariosStore from '@/store/destinatarios.store';

const ITEMS_PER_PAGE = 8;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDestinatarioName, setNewDestinatarioName] = useState('');
  const [newDestinatarioTipodoc, setNewDestinatarioTipodoc] = useState('');
  const [newDestinatarioNumdoc, setNewDestinatarioNumdoc] = useState('');

  const [editingDestinatario, setEditingDestinatario] = useState<{ id: number; nombre: string } | null>(null);

  const { destinatarios, isLoading, isUpdating, error, fetchDestinatarios, updateDestinatario, deleteDestinatario, createDestinatario } = useDestinatariosStore();

  useEffect(() => {
    fetchDestinatarios();
  }, [fetchDestinatarios, currentPage]);

  const filteredDestinatarios = destinatarios?.filter((dest) =>
    dest.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredDestinatarios?.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDestinatarios = filteredDestinatarios?.slice(startIndex, endIndex);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleCreateOrUpdateDestinatario = useCallback(async () => {
    if (!newDestinatarioName) {
      Swal.fire('Error', 'El nombre del Destinatario es requerido', 'error');
      return;
    }
      if (editingDestinatario) {
        await updateDestinatario(editingDestinatario.id, { nombre: newDestinatarioName, tipodoc: newDestinatarioTipodoc, numdoc: newDestinatarioNumdoc });
        
      } else {
        await createDestinatario({ nombre: newDestinatarioName, tipodoc: newDestinatarioTipodoc, numdoc: newDestinatarioNumdoc });
      }
      if (error) {
        Swal.fire('Error', error, 'error');
        return;
      }      

      Swal.fire('¡Éxito!', editingDestinatario ? 'El destinatario se actualizó correctamente.' : 'El destinatario se creó correctamente.', 'success');

      setIsModalOpen(false); // Cerrar el modal
      setNewDestinatarioName('');
      setNewDestinatarioTipodoc('');
      setNewDestinatarioNumdoc('');
      setEditingDestinatario(null);
      fetchDestinatarios(); // Recargar la lista de Destinatarios
    
  }, [newDestinatarioName, editingDestinatario, updateDestinatario, createDestinatario, fetchDestinatarios]);

  const handleEditClick = useCallback((Destinatario: { id: number; nombre: string }) => {
    setEditingDestinatario(Destinatario);
    setNewDestinatarioName(Destinatario.nombre);
    setIsModalOpen(true); // Abrir el modal
  }, []);

  const handleDeleteDestinatario = useCallback(async (id: number) => {
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
        await deleteDestinatario(id);
        Swal.fire('¡Eliminado!', 'El Destinatario ha sido eliminado.', 'success');
        fetchDestinatarios();
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al eliminar el Destinatario.', 'error');
      }
    }
  }, [deleteDestinatario, fetchDestinatarios]);

  return (
    <div className="container mx-auto px-10">
      <div className="rounded-md border">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Administración de Destinatarios
          </h2>
          <div className="flex justify-between items-center mb-4">
            {/* Botón para abrir el modal */}
            <Button onClick={() => { setEditingDestinatario(null); setNewDestinatarioName(''); setIsModalOpen(true); }}>
              Agregar Destinatario
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
              <TableHead className='font-semibold'>Tipo de Documento</TableHead>
              <TableHead className='font-semibold'>Número de Documento</TableHead>
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
                  Error: {error}
                </TableCell>
              </TableRow>
            ) : (
              currentDestinatarios?.map((Destinatario) => (
                <TableRow key={Destinatario.id}>
                  <TableCell>{Destinatario.nombre}</TableCell>
                  <TableCell>{Destinatario.tipodoc}</TableCell>
                  <TableCell>{Destinatario.numdoc}</TableCell>
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
                          onClick={() => handleEditClick(Destinatario)}
                          disabled={isUpdating}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteDestinatario(Destinatario.id)}
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
                  {editingDestinatario ? 'Editar Destinatario' : 'Agregar Nuevo Destinatario'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)} // Cerrar el modal
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
              <select
                  value={newDestinatarioTipodoc || ''}
                  onChange={(e) => setNewDestinatarioTipodoc(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Seleccione un área responsable</option>
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                  <option value="SIN DOCUMENTO">SIN DOCUMENTO</option>
                </select>
                <Input
                  placeholder="Número de Documento"
                  value={newDestinatarioNumdoc}
                  onChange={(e) => setNewDestinatarioNumdoc(e.target.value)}
                />
                <Input
                  placeholder="Nombre del Destinatario"
                  value={newDestinatarioName}
                  onChange={(e) => setNewDestinatarioName(e.target.value)}
                />
                <Button onClick={handleCreateOrUpdateDestinatario} disabled={isUpdating}>
                  {isUpdating ? 'Guardando...' : editingDestinatario ? 'Guardar Cambios' : 'Guardar'}
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