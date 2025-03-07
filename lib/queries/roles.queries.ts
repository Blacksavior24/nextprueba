
import { createRol, deleteRol, getRolById, getRols, updateRol } from "@/actions/roles.action";
import { useAlertDialog } from "@/components/AlertDialog";
import { CreateRolDto, Rol } from "@/interfaces/roles.interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetRoles = () =>{
    return useQuery<Rol[]>({
        queryKey: ['roles'],
        queryFn: getRols,
        staleTime: 1000* 60 * 5
    })
}

// Obtener un ítem por ID
export const useGetRol = (id: string) => {
    return useQuery({
      queryKey: ["rol", id],
      queryFn: () => getRolById(id),
      enabled: !!id, // Solo se ejecuta si hay un ID
    });
  };
  
  // Crear un nuevo ítem
  export const useCreateRol = () => {
    const queryClient = useQueryClient();

    const {fire, AlertDialog } = useAlertDialog()

    return {
      AlertDialog,
      mutation: useMutation({
      mutationFn: createRol,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["roles"] }); // Refresca la lista
        fire({
          title: "¡Éxito!",
          text: "Rol creada exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",          
        })
      },
      onError(error: string) {
        fire({
          title: "Error",
          text: `Ocurrió un error al crear el rol: ${error}`,
          icon: "error",
          confirmButtonText: "Aceptar",
      });
      },
    })
  }
  };
  
  // Actualizar un ítem
  export const useUpdateRol = () => {
    const queryClient = useQueryClient();
    const { fire, AlertDialog } = useAlertDialog();
  
    return {
      AlertDialog,
      mutation: useMutation({
        mutationFn: ({ id, Data }: { id: string; Data: Partial<CreateRolDto> }) =>
          updateRol(id, Data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["roles"] });
          fire({
            title: "¡Éxito!",
            text: "Rol actualizado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        },
        onError: (error: string) => {
          fire({
            title: "Error",
            text: `Ocurrió un error al actualizar el rol: ${error}`,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        },
      }),
    };
  };
  // Eliminar un ítem
  export const useDeleteRol = () => {
    const queryClient = useQueryClient();
    const { fire, AlertDialog } = useAlertDialog();
  
    return {
      AlertDialog,
      mutation: useMutation({
        mutationFn: (id: string) => deleteRol(id),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["roles"] });
          fire({
            title: "¡Éxito!",
            text: "Rol eliminado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        },
        onError: (error: string) => {
          fire({
            title: "Error",
            text: `Ocurrió un error al eliminar el rol: ${error}`,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        },
      }),
    };
  };