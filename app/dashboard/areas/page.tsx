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
import { Area, CreateAreaDto } from '@/interfaces/areas.interfaces';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Label } from '@/components/ui/label';
import { useCreateArea, useDeleteArea, useGetAreas, useUpdateArea } from '@/lib/queries/areas.queries';

const ITEMS_PER_PAGE = 8;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newArea, setNewArea] = useState<CreateAreaDto>({
    nombre: '',
    procedencia: ''
  })
  const [editingArea, setEditingArea] = useState<Area | null>(null);

  const { data: areasResponse, isLoading, error } = useGetAreas()

  const areas = areasResponse || [];

  const filteredTemas = areas.filter((area) =>
    area.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredTemas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTemas = filteredTemas.slice(startIndex, endIndex);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const { mutation: createAreaMutation , AlertDialog: CreateAlertDialog} = useCreateArea()
  const { mutation: updateAreaMutation , AlertDialog: UpdateAlertDialog} = useUpdateArea()
  const { mutation: deleteAreaMutation , AlertDialog: DeleteAlertDialog} = useDeleteArea()


  const handleCreateOrUpdateArea = async () => {
    if (editingArea) {
      updateAreaMutation.mutate(
        { id: String(editingArea.id), Data: newArea},
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingArea(null);
          }
        }
      )
    }else{
      createAreaMutation.mutate(newArea,{
        onSuccess: () => {
          setIsModalOpen(false);
          setNewArea({
            nombre: '',
            procedencia: ''
          })
        }
      })

    }
  }

  const handleEditClick = (area: Area) => {
    setNewArea(area)
    setEditingArea(area)
    setIsModalOpen(true)
  };

  const handleDeleteArea = async (id: string) => {
    deleteAreaMutation.mutate(id)
  }

  return (
    <div className="container mx-auto px-10">
      <CreateAlertDialog />
      <UpdateAlertDialog />
      <DeleteAlertDialog />
      <div className="rounded-md border">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Administración de Areas
          </h2>
          <div className="flex justify-between items-center mb-4">
            {/* Botón para abrir el modal */}
            <Button onClick={() => { 
              setEditingArea(null); 
              setNewArea({
                nombre: '',
                procedencia: ''
              })
              setIsModalOpen(true); 
            }}>
              Agregar Area
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
              <TableHead className='font-semibold'>Procedencia</TableHead>
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
                  Error: No se pueden obtener las areas
                </TableCell>
              </TableRow>
            ) : (
              currentTemas.map((tema) => (
                <TableRow key={tema.id}>
                  <TableCell>{tema.nombre}</TableCell>
                  <TableCell>{tema.procedencia}</TableCell>
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
                          //disabled={isUpdating}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteArea(String(tema.id))}
                          disabled={deleteAreaMutation.isPending}
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
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingArea?"Editar Area":"Nueva Area"}</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                  <Label htmlFor='nombre'>Nombre</Label>
                  <Input
                    id='nombre'
                    value={newArea.nombre}
                    onChange={(e)=> setNewArea({...newArea, nombre: e.target.value})}
                  />
              </div>
              <div className='grid gap-2'>
                  <Label htmlFor='procedencia'>Procedencia</Label>
                  <Input
                    id='procedencia'
                    value={newArea.procedencia}
                    onChange={(e)=> setNewArea({...newArea, procedencia: e.target.value})}
                  />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateOrUpdateArea}
                disabled={createAreaMutation.isPending || updateAreaMutation.isPending}
              >
                {createAreaMutation.isPending || updateAreaMutation.isPending
                ? "Guardando"
                : editingArea
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