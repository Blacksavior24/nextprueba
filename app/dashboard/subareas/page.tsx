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
import useSubAreasStore from '@/store/subareas.store';
import useAreasStore from '@/store/areas.store'; // Nuevo store para áreas
import Swal from 'sweetalert2';
import { SubArea } from '@/interfaces/subareas.interfaces';
import { Area } from '@/interfaces/areas.interfaces'; // Interfaz para áreas

const ITEMS_PER_PAGE = 8;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubAreaName, setNewSubAreaName] = useState('');
  const [newProcedencia, setProcedencia] = useState('');
  const [newAreaResponsableId, setAreaResponsableId] = useState<number | null>(null);
  const [newJefatura, setJefatura] = useState('');
  const [editingSubArea, setEditingSubArea] = useState<SubArea | null>(null);

  const { subareas, loading, isUpdating, error, fetchSubAreas, updateSubArea, deleteSubArea, createSubArea } = useSubAreasStore();
  const { areas, fetchAreas } = useAreasStore(); // Obtener áreas

  useEffect(() => {
    fetchAreas(); // Cargar áreas al montar el componente
    fetchSubAreas();
  }, [fetchSubAreas, fetchAreas]);

  const filteredSubAreas = subareas.filter((subArea) =>
    subArea.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredSubAreas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSubAreas = filteredSubAreas.slice(startIndex, endIndex);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleCreateOrUpdateSubArea = useCallback(async () => {
    if (!newSubAreaName || !newAreaResponsableId) {
      Swal.fire('Error', 'El nombre y el área responsable son requeridos', 'error');
      return;
    }

    try {
      if (editingSubArea) {
        await updateSubArea(editingSubArea.id, { 
          nombre: newSubAreaName, 
          procedencia: newProcedencia, 
          areaResponsableId: newAreaResponsableId, 
          jefatura: newJefatura 
        });
        Swal.fire('¡Éxito!', 'La subárea se actualizó correctamente.', 'success');
      } else {
        await createSubArea({ 
          nombre: newSubAreaName, 
          procedencia: newProcedencia, 
          areaResponsableId: newAreaResponsableId, 
          jefatura: newJefatura 
        });
        Swal.fire('¡Éxito!', 'La subárea se creó correctamente.', 'success');
      }

      setIsModalOpen(false); // Cerrar el modal
      setNewSubAreaName('');
      setProcedencia('');
      setAreaResponsableId(null);
      setJefatura('');
      setEditingSubArea(null);
      fetchSubAreas(); // Recargar la lista de subáreas
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al guardar la subárea.', 'error');
    }
  }, [newSubAreaName, newProcedencia, newAreaResponsableId, newJefatura, editingSubArea, updateSubArea, createSubArea, fetchSubAreas]);

  const handleEditClick = useCallback((subArea: SubArea) => {
    setEditingSubArea(subArea);
    setNewSubAreaName(subArea.nombre);
    setProcedencia(subArea.procedencia || '');
    setAreaResponsableId(subArea.areaResponsableId);
    setJefatura(subArea.jefatura || '');
    setIsModalOpen(true); // Abrir el modal
  }, []);

  const handleDeleteSubArea = useCallback(async (id: number) => {
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
        await deleteSubArea(id);
        Swal.fire('¡Eliminado!', 'La subárea ha sido eliminada.', 'success');
        fetchSubAreas();
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al eliminar la subárea.', 'error');
      }
    }
  }, [deleteSubArea, fetchSubAreas]);

  return (
    <div className="container mx-auto px-10">
      <div className="rounded-md border">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Administración de SubÁreas
          </h2>
          <div className="flex justify-between items-center mb-4">
            {/* Botón para abrir el modal */}
            <Button onClick={() => { setEditingSubArea(null); setNewSubAreaName(''); setProcedencia(''); setAreaResponsableId(null); setJefatura(''); setIsModalOpen(true); }}>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-red-600">
                  Error: {error}
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
                          disabled={isUpdating}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteSubArea(subArea.id)}
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
                  {editingSubArea ? 'Editar SubÁrea' : 'Agregar Nueva SubÁrea'}
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
                  placeholder="Nombre de la subárea"
                  value={newSubAreaName}
                  onChange={(e) => setNewSubAreaName(e.target.value)}
                />
                <Input
                  placeholder="Procedencia"
                  value={newProcedencia}
                  onChange={(e) => setProcedencia(e.target.value)}
                />
                <select
                  value={newAreaResponsableId || ''}
                  onChange={(e) => setAreaResponsableId(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Seleccione un área responsable</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.nombre}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Jefatura"
                  value={newJefatura}
                  onChange={(e) => setJefatura(e.target.value)}
                />
                <Button onClick={handleCreateOrUpdateSubArea} disabled={isUpdating}>
                  {isUpdating ? 'Guardando...' : editingSubArea ? 'Guardar Cambios' : 'Guardar'}
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