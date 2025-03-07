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
import { CreateSubAreaDto, SubArea } from '@/interfaces/subareas.interfaces';
import { useCreateSubArea, useDeleteSubArea, useGetSubAreas, useUpdateSubArea } from '@/lib/queries/subareas.queries';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAreas } from '@/lib/queries/areas.queries';

const ITEMS_PER_PAGE = 8;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubArea, setNewSubArea] = useState<CreateSubAreaDto>({
    nombre: '',
    procedencia: '',
    areaResponsableId: '',
    jefatura: ''
  })

  const [editingSubArea, setEditingSubArea] = useState<SubArea | null>(null);


  const { data: subAreasResponse, isLoading, error } = useGetSubAreas()
  const { data: areasResponse } = useGetAreas()


  const subareas = subAreasResponse || [];
  const areas = areasResponse || [];

  const filteredSubAreas = subareas.filter((subArea) =>
    subArea.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredSubAreas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSubAreas = filteredSubAreas.slice(startIndex, endIndex);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const { mutation: createSubAreaMutation, AlertDialog: CreateAlertDialog } = useCreateSubArea()
  const { mutation: updateSubAreaMutation, AlertDialog: UpdateAlertDialog } = useUpdateSubArea()
  const { mutation: deleteSubAreaMutation, AlertDialog: DeleteAlertDialog } = useDeleteSubArea()

  const handleCreateOrUpdateSubArea = async () => {
    if (editingSubArea) {
      updateSubAreaMutation.mutate(
        { id: String(editingSubArea.id), Data: newSubArea },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingSubArea(null);
          }
        }
      )
    } else {
      createSubAreaMutation.mutate(newSubArea, {
        onSuccess: () => {
          setIsModalOpen(false);
          setNewSubArea({
            nombre: '',
            procedencia: '',
            areaResponsableId: '',
            jefatura: ''
          })
        }
      })
    }
  }

  const handleEditClick = (subArea: SubArea) => {
    setNewSubArea(subArea)
    setEditingSubArea(subArea)
    setIsModalOpen(true)
  }

  const handleDeleteSubArea = async (id: string) => {
    deleteSubAreaMutation.mutate(id)
  }

  return (
    <div className="container mx-auto px-10">
      <CreateAlertDialog />
      <UpdateAlertDialog />
      <DeleteAlertDialog />
      <div className="rounded-md border">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Administración de SubÁreas
          </h2>
          <div className="flex justify-between items-center mb-4">
            {/* Botón para abrir el modal */}
            <Button onClick={() => {
              setEditingSubArea(null);
              setNewSubArea({
                nombre: '',
                procedencia: '',
                areaResponsableId: '',
                jefatura: ''
              })
              setIsModalOpen(true);
            }}>
              Agregar SubÁrea
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
              <TableHead className='font-semibold'>Área Responsable</TableHead>
              <TableHead className='font-semibold'>Jefatura</TableHead>
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
                <TableCell colSpan={5} className="text-center text-red-600">
                  Error: No se pueden obtener las Sub Areas
                </TableCell>
              </TableRow>
            ) : (
              currentSubAreas.map((subArea) => (
                <TableRow key={subArea.id}>
                  <TableCell>{subArea.nombre}</TableCell>
                  <TableCell>{subArea.procedencia}</TableCell>
                  <TableCell>{subArea.areaResponsable?.nombre}</TableCell>
                  <TableCell>{subArea.jefatura}</TableCell>
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
                          onClick={() => handleEditClick(subArea)}
                        //disabled={isUpdating}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteSubArea(String(subArea.id))}
                          disabled={deleteSubAreaMutation.isPending}
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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>{editingSubArea ? 'Editar Sub Area' : 'Nuevo Sub Area'}</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='nombre'>Nombre</Label>
                <Input
                  id='nombre'
                  value={newSubArea.nombre}
                  onChange={(e) => setNewSubArea({ ...newSubArea, nombre: e.target.value })}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='procedencia'>Procedencia</Label>
                <Input
                  id='procedencia'
                  value={newSubArea.procedencia}
                  onChange={(e) => setNewSubArea({ ...newSubArea, procedencia: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="area">Area</Label>
                <Select
                  value={newSubArea.areaResponsableId}
                  onValueChange={(value) => setNewSubArea({ ...newSubArea, areaResponsableId: value })}
                >
                  <SelectTrigger id="area">
                    <SelectValue placeholder="Seleccione un Area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area.id} value={String(area.id)}>
                        {area.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='jefatura'>Jefatura</Label>
                <Select
                  value={newSubArea.jefatura}
                  onValueChange={(value) => setNewSubArea({ ...newSubArea, jefatura: value })}
                >
                  <SelectTrigger id='jefatura'>
                    <SelectValue placeholder="Jefatura?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="subarea-1" value='Si'>
                      Si
                    </SelectItem>
                    <SelectItem key="subarea-0" value='No'>
                      No
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateOrUpdateSubArea}
                disabled={createSubAreaMutation.isPending || updateSubAreaMutation.isPending}
              >
                {createSubAreaMutation.isPending || updateSubAreaMutation.isPending
                  ? "Guardando"
                  : editingSubArea
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