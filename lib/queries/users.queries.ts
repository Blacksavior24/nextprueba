import { createUser, deleteUser, getUserById, getUsers, updateUser } from "@/actions/users.action"
import { useAlertDialog } from "@/components/AlertDialog";
import { CreateUsuarioDto, UsuarioResponse } from "@/interfaces/usuarios.interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetUsers = (
  page: number = 1,
  limit: number = 10,
  filters?: Record<string, string>,
  search?: string,
  searchBy?: string[]
) =>{
    return useQuery<UsuarioResponse>({
        queryKey: ['users', page, limit, filters, search, searchBy],
        queryFn: () => getUsers(page, limit, filters, search, searchBy),
        staleTime: 1000* 60 * 5
    })
}

// Obtener un ítem por ID
export const useGetUser = (id: string) => {
    return useQuery({
      queryKey: ["user", id],
      queryFn: () => getUserById(id),
      enabled: !!id, // Solo se ejecuta si hay un ID
    });
  };
  
  // Crear un nuevo ítem
  export const useCreateUser = () => {
    const queryClient = useQueryClient();

    const {fire, AlertDialog } = useAlertDialog()

    return {
      AlertDialog,
      mutation: useMutation({
      mutationFn: createUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] }); // Refresca la lista
        fire({
          title: "¡Éxito!",
          text: "Carta recibida creada exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",          
        })
      },
      onError(error: string) {
        fire({
          title: "Error",
          text: `Ocurrió un error al crear la carta: ${error}`,
          icon: "error",
          confirmButtonText: "Aceptar",
      });
      },
    })
  }
  };
  
  // Actualizar un ítem
  export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    const { fire, AlertDialog } = useAlertDialog();
  
    return {
      AlertDialog,
      mutation: useMutation({
        mutationFn: ({ id, Data }: { id: string; Data: Partial<CreateUsuarioDto> }) =>
          updateUser(id, Data),
        onSuccess: (updateUser, {id}) => {
          queryClient.setQueryData(['user',id], updateUser);

          queryClient.setQueryData(["users"], (oldData: UsuarioResponse | undefined) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              data: oldData.data.map((user)=>
                user.id === id ? {...user, ...updateUser}: user
              )
            }

          })
          //queryClient.invalidateQueries({ queryKey: ["users"] });
          fire({
            title: "¡Éxito!",
            text: "Usuario actualizado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        },
        onError: (error: string) => {
          fire({
            title: "Error",
            text: `Ocurrió un error al actualizar el usuario: ${error}`,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        },
      }),
    };
  };
  // Eliminar un ítem
  export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    const { fire, AlertDialog } = useAlertDialog();
  
    return {
      AlertDialog,
      mutation: useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: (_, id) => {
          //queryClient.invalidateQueries({ queryKey: ["users"] });
          
          queryClient.setQueryData(["users"], (oldData: UsuarioResponse | undefined) => {
            if (!oldData) return oldData;
            
            return {
              ...oldData,
              data: oldData.data.filter((user) => user.id !== id),
            };
          });
          
          fire({
            title: "¡Éxito!",
            text: "Usuario eliminado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        },
        onError: (error: string) => {
          fire({
            title: "Error",
            text: `Ocurrió un error al eliminar el usuario: ${error}`,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        },
      }),
    };
  };