import { createUser, deleteUser, getUserById, getUsers, updateUser } from "@/actions/users.action"
import { CreateUsuarioDto } from "@/interfaces/usuarios.interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useUsers = () =>{
    return useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
        staleTime: 1000* 60 * 5
    })
}

// Obtener un ítem por ID
export const useUser = (id: string) => {
    return useQuery({
      queryKey: ["user", id],
      queryFn: () => getUserById(id),
      enabled: !!id, // Solo se ejecuta si hay un ID
    });
  };
  
  // Crear un nuevo ítem
  export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: createUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] }); // Refresca la lista
      },
      onError(error: Error) {
                  
      },
    });
  };
  
  // Actualizar un ítem
  export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, Data }: { id: string; Data: Partial<CreateUsuarioDto> }) =>
        updateUser(id, Data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
      onError: () => {

      }
    });
  };
  
  // Eliminar un ítem
  export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: deleteUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  };