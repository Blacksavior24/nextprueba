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
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'; // Importamos el ícono X
import React, { useState } from 'react';
import { CreateEmpresaDto, Empresa } from '@/interfaces/empresas.interfaces';
import { useCreateEmpresa, useDeleteEmpresa, useGetEmpresas, useUpdateEmpresa } from '@/lib/queries/companies.queries';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const ITEMS_PER_PAGE = 8;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmpresa, setNewEmpresa] = useState<CreateEmpresaDto>({
    nombre: ''
  })
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);

  const { data: empresasResponse, isLoading, error } = useGetEmpresas()

  const empresas = empresasResponse || [];
  const filteredEmpresas = empresas.filter((empresa) =>
    empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredEmpresas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEmpresas = filteredEmpresas.slice(startIndex, endIndex);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const { mutation: createEmpresaMutation, AlertDialog: CreateAlertDialog } = useCreateEmpresa()
  const { mutation: updateEmpresaMutation, AlertDialog: UpdateAlertDialog } = useUpdateEmpresa()
  const { mutation: deleteEmpresaMutation, AlertDialog: DeleteAlertDialog } = useDeleteEmpresa()

  const handleCreateOrUpdateEmpresa = async () => {
    if (editingEmpresa) {
      updateEmpresaMutation.mutate(
        { id: String(editingEmpresa.id), Data: newEmpresa },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingEmpresa(null);
          }
        }
      )
    } else {
      createEmpresaMutation.mutate(newEmpresa, {
        onSuccess: () => {
          setIsModalOpen(false);
          setNewEmpresa({
            nombre: ''
          })
        }
      })

    }
  }

  const handleEditClick = (empresa: Empresa) => {
    setEditingEmpresa(empresa);
    setNewEmpresa(empresa);
    setIsModalOpen(true); // Abrir el modal
  }

  const handleDeleteEmpresa = async (id: string) => {
    deleteEmpresaMutation.mutate(id)
  }

  return (
    <div className="container mx-auto px-10">
      <CreateAlertDialog />
      <UpdateAlertDialog />
      <DeleteAlertDialog />
      <div className="rounded-md border">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Administración de Empresas
          </h2>
          <div className="flex justify-between items-center mb-4">
            {/* Botón para abrir el modal */}
            <Button onClick={() => {
              setEditingEmpresa(null);
              setNewEmpresa({
                nombre: ''
              });
              setIsModalOpen(true);
            }}>
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
                <TableCell colSpan={2} className="text-center text-red-600">
                  Error: No se puede obtener Empresas
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
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteEmpresa(String(empresa.id))}
                          disabled={updateEmpresaMutation.isPending}
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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>{editingEmpresa ? 'Editar Empresa' : 'Nueva Empresa'}</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='nombre'>Nombre</Label>
                <Input
                  id='nombre'
                  value={newEmpresa.nombre}
                  onChange={(e) => setNewEmpresa({ ...newEmpresa, nombre: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateOrUpdateEmpresa}
                disabled={createEmpresaMutation.isPending || updateEmpresaMutation.isPending}
              >
                {createEmpresaMutation.isPending || updateEmpresaMutation.isPending
                  ? "Guardando"
                  : editingEmpresa
                    ? "Guardar Cambios"
                    : "Guardar"
                }

              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>



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