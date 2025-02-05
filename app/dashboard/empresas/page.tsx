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
import useEmpresasStore from '@/store/empresas.store';
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 8;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmpresaName, setNewEmpresaName] = useState('');
  const [editingEmpresa, setEditingEmpresa] = useState<{ id: number; nombre: string } | null>(null);

  const { empresas, loading, isUpdating, error, fetchEmpresas, updateEmpresa, deleteEmpresa, createEmpresa } = useEmpresasStore();

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  const filteredEmpresas = empresas.filter((empresa) =>
    empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredEmpresas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEmpresas = filteredEmpresas.slice(startIndex, endIndex);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleCreateOrUpdateEmpresa = useCallback(async () => {
    if (!newEmpresaName) {
      Swal.fire('Error', 'El nombre del empresa es requerido', 'error');
      return;
    }

    try {
      if (editingEmpresa) {
        await updateEmpresa(editingEmpresa.id, { nombre: newEmpresaName });
        Swal.fire('¡Éxito!', 'El empresa se actualizó correctamente.', 'success');
      } else {
        await createEmpresa({ nombre: newEmpresaName });
        Swal.fire('¡Éxito!', 'El empresa se creó correctamente.', 'success');
      }

      setIsModalOpen(false); // Cerrar el modal
      setNewEmpresaName('');
      setEditingEmpresa(null);
      fetchEmpresas(); // Recargar la lista de Empresas
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al guardar el empresa.', 'error');
    }
  }, [newEmpresaName, editingEmpresa, updateEmpresa, createEmpresa, fetchEmpresas]);

  const handleEditClick = useCallback((empresa: { id: number; nombre: string }) => {
    setEditingEmpresa(empresa);
    setNewEmpresaName(empresa.nombre);
    setIsModalOpen(true); // Abrir el modal
  }, []);

  const handleDeleteEmpresa = useCallback(async (id: number) => {
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
        await deleteEmpresa(id);
        Swal.fire('¡Eliminado!', 'El empresa ha sido eliminado.', 'success');
        fetchEmpresas();
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al eliminar el empresa.', 'error');
      }
    }
  }, [deleteEmpresa, fetchEmpresas]);

  return (
    <div className="container mx-auto px-10">
      <div className="rounded-md border">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Administración de Empresas
          </h2>
          <div className="flex justify-between items-center mb-4">
            {/* Botón para abrir el modal */}
            <Button onClick={() => { setEditingEmpresa(null); setNewEmpresaName(''); setIsModalOpen(true); }}>
              Agregar Empresa
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
              currentEmpresas.map((empresa) => (
                <TableRow key={empresa.id}>
                  <TableCell>{empresa.nombre}</TableCell>
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
                          onClick={() => handleEditClick(empresa)}
                          disabled={isUpdating}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteEmpresa(empresa.id)}
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
                  {editingEmpresa ? 'Editar Empresa' : 'Agregar Nuevo Empresa'}
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
                  placeholder="Nombre del empresa"
                  value={newEmpresaName}
                  onChange={(e) => setNewEmpresaName(e.target.value)}
                />
                <Button onClick={handleCreateOrUpdateEmpresa} disabled={isUpdating}>
                  {isUpdating ? 'Guardando...' : editingEmpresa ? 'Guardar Cambios' : 'Guardar'}
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