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
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { CreateUsuarioDto, Usuario } from '@/interfaces/usuarios.interfaces'; // Importar interfaces
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateUser, useDeleteUser, useGetUsers, useUpdateUser } from '@/lib/queries/users.queries';
import { useGetAreas } from '@/lib/queries/areas.queries';
import { useGetSubAreas } from '@/lib/queries/subareas.queries';
import { useGetRoles } from '@/lib/queries/roles.queries';

const ITEMS_PER_PAGE = 8;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceTerm, setDebounceTerm] = useState('')
  const [searchBy, setSearchBy] = useState<string[]>(['nombre', 'email']); // Campos de búsqueda
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUsuario, setNewUsuario] = useState<CreateUsuarioDto>({
    nombre: '',
    email: '',
    apellidos: '',
    contraseña: '',
    areaId: '',
    subAreaId: '',
    rolId: '',
    procedencia: '',
    tipoUsuario: 'user',
    jefe: 'no',
    creadoPorId: null,
  });
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);

  const { data: usersResponse, isLoading, refetch, error } = useGetUsers(
    currentPage,
    ITEMS_PER_PAGE,
    undefined,
    debounceTerm,
    searchBy
  )

  const users = usersResponse?.data || [];
  const totalPages = usersResponse?.meta.last_page || 1; // Usar meta.last_page directamente


  const { mutation: createUserMutation, AlertDialog: CreateAlertDialog } = useCreateUser();
  const { mutation: updateUserMutation, AlertDialog: UpdateAlertDialog, } = useUpdateUser();
  const { mutation: deleteUserMutation, AlertDialog: DeleteAlertDialog, } = useDeleteUser();

  const { data: areasResponse } = useGetAreas()
  const { data: subareasResponse } = useGetSubAreas()
  const { data: rolesResponse } = useGetRoles()

  const areas = areasResponse || []
  const subareas = subareasResponse || []
  const roles = rolesResponse || []

  const handleCreateOrUpdateUsuario = async () => {
    if (editingUsuario) {
      // Actualizar usuario existente
      updateUserMutation.mutate(
        { id: editingUsuario.id, Data: newUsuario },
        {
          onSuccess: () => {
            setIsModalOpen(false); // Cerrar el modal después de actualizar el usuario
            setEditingUsuario(null); // Limpiar el estado de edición
          },
        }
      );
    } else {
      // Crear un nuevo usuario (lógica anterior)
      createUserMutation.mutate(newUsuario, {
        onSuccess: () => {
          setIsModalOpen(false);
          setNewUsuario({
            nombre: '',
            email: '',
            apellidos: '',
            contraseña: '',
            areaId: '',
            subAreaId: '',
            rolId: '',
            procedencia: '',
            tipoUsuario: 'user',
            jefe: 'no',
            creadoPorId: null,
          });
        },
      });
    }
  };

  const handleEditClick = (usuario: Usuario) => {
    setNewUsuario(usuario)
    setEditingUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleDeleteUsuario = (id: string) => {
    deleteUserMutation.mutate(id);
  };

  const handleSearchByChange = (field: string) => {
    setSearchBy((prev) =>
      prev.includes(field)
        ? prev.filter((f) => f !== field) // Remover si ya está seleccionado
        : [...prev, field] // Agregar si no está seleccionado
    );
  };
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setDebounceTerm(searchTerm)
      setCurrentPage(1); // Reiniciar a la primera página al buscar
      refetch(); // Volver a cargar los datos
    }
  };


  return (
    <div className="container mx-auto px-10">
      <CreateAlertDialog />
      <UpdateAlertDialog />
      <DeleteAlertDialog />
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
                apellidos: '',
                contraseña: '',
                areaId: '',
                subAreaId: '',
                rolId: '',
                procedencia: '',
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
                onKeyDown={handleSearch}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Buscar por
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {['nombre', 'email'].map((field) => (
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
          <TableHeader className='bg-zinc-500/30'>
            <TableRow>
              <TableHead className='font-semibold'>Nombre</TableHead>
              <TableHead className='font-semibold'>Email</TableHead>
              <TableHead className='font-semibold'>Rol</TableHead>
              <TableHead className='font-semibold'>Area</TableHead>
              <TableHead className='font-semibold'>Sub-Area</TableHead>
              <TableHead className='font-semibold'>Tipo de Usuario</TableHead>
              <TableHead className='font-semibold'>Jefatura</TableHead>
              <TableHead className="text-right font-semibolds">Acciones</TableHead>
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
                <TableCell colSpan={6} className="text-center text-red-600">
                  Error: No se pueden obtener los usuarios
                </TableCell>
              </TableRow>
            ) : (
              users.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.rol?.nombre}</TableCell>
                  <TableCell>{usuario.area?.nombre}</TableCell>
                  <TableCell>{usuario.subArea?.nombre}</TableCell>
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
                          onClick={() =>
                            handleEditClick(usuario)
                          }
                        //disabled={isUpdating}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteUsuario(usuario.id)}
                          disabled={deleteUserMutation.isPending}
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

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUsuario ? "Editar Usuario" : "Agregar Nuevo Usuario"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={newUsuario.nombre}
                  onChange={(e) => setNewUsuario({ ...newUsuario, nombre: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUsuario.email}
                  onChange={(e) => setNewUsuario({ ...newUsuario, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUsuario.contraseña}
                  onChange={(e) => setNewUsuario({ ...newUsuario, contraseña: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="area">Area</Label>
                <Select
                  value={newUsuario.areaId}
                  onValueChange={(value) => setNewUsuario({ ...newUsuario, areaId: value, subAreaId: "" })}
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
              <div className="grid gap-2">
                <Label htmlFor="subarea">Sub Areas</Label>
                <Select
                  value={newUsuario.subAreaId}
                  onValueChange={(value) => setNewUsuario({ ...newUsuario, subAreaId: value })}
                  disabled={!newUsuario.areaId}
                >
                  <SelectTrigger id="subarea">
                    <SelectValue placeholder="Seleccione una Sub Area" />
                  </SelectTrigger>
                  <SelectContent>
                    {subareas
                      .filter((subarea) => String(subarea.areaResponsableId) === newUsuario.areaId)
                      .map((subarea) => (
                        <SelectItem key={subarea.id} value={String(subarea.id)}>
                          {subarea.nombre}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rol">Rol</Label>
                <Select value={newUsuario.rolId} onValueChange={(value) => setNewUsuario({ ...newUsuario, rolId: value })}>
                  <SelectTrigger id="rol">
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((rol) => (
                      <SelectItem key={rol.id} value={String(rol.id)}>
                        {rol.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tipoUsuario">Tipo de Usuario</Label>
                <Select
                  value={newUsuario.tipoUsuario}
                  onValueChange={(value) =>
                    setNewUsuario({
                      ...newUsuario,
                      tipoUsuario: value as "admin" | "user",
                    })
                  }
                >
                  <SelectTrigger id="tipoUsuario">
                    <SelectValue placeholder="Seleccione tipo de usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuario</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="jefe">¿Es jefe?</Label>
                <Select
                  value={newUsuario.jefe}
                  onValueChange={(value) =>
                    setNewUsuario({
                      ...newUsuario,
                      jefe: value as "si" | "no",
                    })
                  }
                >
                  <SelectTrigger id="jefe">
                    <SelectValue placeholder="Seleccione si es jefe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateOrUpdateUsuario}
                disabled={createUserMutation.isPending || updateUserMutation.isPending}
              >
                {createUserMutation.isPending || updateUserMutation.isPending
                  ? "Guardando..."
                  : editingUsuario
                    ? "Guardar Cambios"
                    : "Guardar"}
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
      </div>
    </div>
  );
}