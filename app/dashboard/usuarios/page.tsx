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
import { MoreHorizontal, Pencil, Trash2, X } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import useUsuariosStore from '@/store/usuarios.store'; // Store para usuarios
import Swal from 'sweetalert2';
import { CreateUsuarioDto, Usuario } from '@/app/interfaces/usuarios.interfaces'; // Importar interfaces
import useAreasStore from '@/store/areas.store';
import useSubAreasStore from '@/store/subareas.store';
import useRolesStore from '@/store/roles.store';

const ITEMS_PER_PAGE = 8;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUsuario, setNewUsuario] = useState<CreateUsuarioDto>({
    nombre: '',
    email: '',
    apellidos: null,
    contraseña: '',
    areaId: null,
    subAreaId: null,
    rolId: '',
    procedencia: null,
    tipoUsuario: 'user',
    jefe: 'no',
    creadoPorId: null,
  });
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);

  const { usuarios, loading, isUpdating, error, fetchUsuarios, updateUsuario, deleteUsuario, createUsuario } = useUsuariosStore();
  const { areas, fetchAreas } = useAreasStore()
  const { roles, fetchRoles } = useRolesStore()

  useEffect(() => {
    fetchUsuarios(currentPage, ITEMS_PER_PAGE);
    fetchRoles();
    fetchAreas();
  }, [fetchUsuarios, currentPage]);

  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsuarios.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsuarios = filteredUsuarios.slice(startIndex, endIndex);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleCreateOrUpdateUsuario = useCallback(async () => {
    if (!newUsuario.nombre || !newUsuario.email || !newUsuario.contraseña || !newUsuario.rolId) {
      Swal.fire('Error', 'Nombre, email, contraseña y rol son requeridos', 'error');
      return;
    }

    try {
      if (editingUsuario) {
        await updateUsuario(editingUsuario.id, newUsuario);
        Swal.fire('¡Éxito!', 'El usuario se actualizó correctamente.', 'success');
      } else {
        await createUsuario(newUsuario);
        Swal.fire('¡Éxito!', 'El usuario se creó correctamente.', 'success');
      }

      setIsModalOpen(false);
      setNewUsuario({
        nombre: '',
        email: '',
        apellidos: null,
        contraseña: '',
        areaId: null,
        subAreaId: null,
        rolId: '',
        procedencia: null,
        tipoUsuario: 'user',
        jefe: 'no',
        creadoPorId: null,
      });
      setEditingUsuario(null);
      fetchUsuarios(currentPage, ITEMS_PER_PAGE);
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al guardar el usuario.', 'error');
    }
  }, [newUsuario, editingUsuario, updateUsuario, createUsuario, fetchUsuarios, currentPage]);

  const handleEditClick = useCallback((usuario: Usuario) => {
    setEditingUsuario(usuario);
    setNewUsuario({
      nombre: usuario.nombre,
      email: usuario.email,
      apellidos: usuario.apellidos,
      contraseña: usuario.contraseña,
      areaId: usuario.areaId,
      subAreaId: usuario.subAreaId,
      rolId: usuario.rolId,
      procedencia: usuario.procedencia,
      tipoUsuario: usuario.tipoUsuario,
      jefe: usuario.jefe,
      creadoPorId: usuario.creadoPorId,
    });
    setIsModalOpen(true);
  }, []);

  const handleDeleteUsuario = useCallback(async (id: string) => {
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
        await deleteUsuario(id);
        Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
        fetchUsuarios(currentPage, ITEMS_PER_PAGE);
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al eliminar el usuario.', 'error');
      }
    }
  }, [deleteUsuario, fetchUsuarios, currentPage]);

  return (
    <div className="container mx-auto px-10">
      <div className="rounded-md border">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Administración de Usuarios
          </h2>
          <div className="flex justify-between items-center mb-4">
            <Button onClick={() => {
              setEditingUsuario(null); setNewUsuario({
                nombre: '',
                email: '',
                apellidos: null,
                contraseña: '',
                areaId: null,
                subAreaId: null,
                rolId: '',
                procedencia: null,
                tipoUsuario: 'user',
                jefe: 'no',
                creadoPorId: null,
              }); setIsModalOpen(true);
            }}>
              Agregar Usuario
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
              <TableHead className='font-semibold'>Email</TableHead>
              <TableHead className='font-semibold'>Rol</TableHead>
              <TableHead className='font-semibold'>Tipo de Usuario</TableHead>
              <TableHead className='font-semibold'>Jefatura</TableHead>
              <TableHead className="text-right font-semibolds">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-red-600">
                  Error: {error}
                </TableCell>
              </TableRow>
            ) : (
              currentUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.rol.nombre}</TableCell>
                  <TableCell>{usuario.tipoUsuario}</TableCell>
                  <TableCell>{usuario.jefe}</TableCell>
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
                          onClick={() => handleEditClick(usuario)}
                          disabled={isUpdating}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteUsuario(usuario.id)}
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

        {/* Modal para crear/editar usuario */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingUsuario ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <Input
                    value={newUsuario.nombre}
                    onChange={(e) => setNewUsuario({ ...newUsuario, nombre: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <Input
                    type='email'
                    value={newUsuario.email}
                    onChange={(e) => setNewUsuario({ ...newUsuario, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                  <Input
                    type="password"
                    value={newUsuario.contraseña}
                    onChange={(e) => setNewUsuario({ ...newUsuario, contraseña: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rol</label>
                  <select
                    value={newUsuario.rolId || ''}
                    onChange={(e) => setNewUsuario({ ...newUsuario, rolId: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Seleccione un rol</option>
                    {roles.map((rol) => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo de Usuario</label>
                  <select
                    value={newUsuario.tipoUsuario}
                    onChange={(e) => setNewUsuario({ ...newUsuario, tipoUsuario: e.target.value as "admin" | "user" })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">¿Es jefe?</label>
                  <select
                    value={newUsuario.jefe}
                    onChange={(e) => setNewUsuario({ ...newUsuario, jefe: e.target.value as "si" | "no" })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="no">No</option>
                    <option value="si">Sí</option>
                  </select>
                </div>
                <Button onClick={handleCreateOrUpdateUsuario} disabled={isUpdating}>
                  {isUpdating ? 'Guardando...' : editingUsuario ? 'Guardar Cambios' : 'Guardar'}
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

              {pageNumbers.map((pageNumber) => (
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
      </div>
    </div>
  );
}