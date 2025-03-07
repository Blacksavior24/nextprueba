
import { createTema, deleteTema, getTemaById, getTemas, updateTema } from "@/actions/temas.action";
import { useAlertDialog } from "@/components/AlertDialog";
import { CreateTemaDto, Tema } from "@/interfaces/temas.interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetTemas = () =>{
    return useQuery<Tema[]>({
        queryKey: ['temas'],
        queryFn: getTemas,
        staleTime: 1000* 60 * 5
    })
}

// Obtener un ítem por ID
export const useGetTema = (id: string) => {
    return useQuery({
      queryKey: ["tema", id],
      queryFn: () => getTemaById(id),
      enabled: !!id, // Solo se ejecuta si hay un ID
    });
  };
  
  // Crear un nuevo ítem
  export const useCreateTema = () => {
    const queryClient = useQueryClient();

    const {fire, AlertDialog } = useAlertDialog()

    return {
      AlertDialog,
      mutation: useMutation({
      mutationFn: createTema,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["temas"] }); // Refresca la lista
        fire({
          title: "¡Éxito!",
          text: "Tema creada exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",          
        })
      },
      onError(error: string) {
        fire({
          title: "Error",
          text: `Ocurrió un error al crear el tema: ${error}`,
          icon: "error",
          confirmButtonText: "Aceptar",
      });
      },
    })
  }
  };
  
  // Actualizar un ítem
  export const useUpdateTema = () => {
    const queryClient = useQueryClient();
    const { fire, AlertDialog } = useAlertDialog();
  
    return {
      AlertDialog,
      mutation: useMutation({
        mutationFn: ({ id, Data }: { id: string; Data: Partial<CreateTemaDto> }) =>
          updateTema(id, Data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["temas"] });
          fire({
            title: "¡Éxito!",
            text: "Tema actualizado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        },
        onError: (error: string) => {
          fire({
            title: "Error",
            text: `Ocurrió un error al actualizar el tema: ${error}`,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        },
      }),
    };
  };
  // Eliminar un ítem
  export const useDeleteTema = () => {
    const queryClient = useQueryClient();
    const { fire, AlertDialog } = useAlertDialog();
  
    return {
      AlertDialog,
      mutation: useMutation({
        mutationFn: (id: string) => deleteTema(id),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["temas"] });
          fire({
            title: "¡Éxito!",
            text: "Tema eliminado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        },
        onError: (error: string) => {
          fire({
            title: "Error",
            text: `Ocurrió un error al eliminar el tema: ${error}`,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        },
      }),
    };
  };