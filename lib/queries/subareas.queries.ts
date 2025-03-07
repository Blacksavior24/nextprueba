import { createSubArea, deleteSubArea, getSubAreaById, getSubAreas, updateSubArea } from "@/actions/subareas.action";
import { useAlertDialog } from "@/components/AlertDialog";
import { CreateSubAreaDto, SubArea } from "@/interfaces/subareas.interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetSubAreas = () =>{
    return useQuery<SubArea[]>({
        queryKey: ['subareas'],
        queryFn: getSubAreas,
        staleTime: 1000* 60 * 5
    })
}

// Obtener un ítem por ID
export const useGetSubArea = (id: string) => {
    return useQuery({
      queryKey: ["subarea", id],
      queryFn: () => getSubAreaById(id),
      enabled: !!id, // Solo se ejecuta si hay un ID
    });
  };
  
  // Crear un nuevo ítem
  export const useCreateSubArea = () => {
    const queryClient = useQueryClient();

    const {fire, AlertDialog } = useAlertDialog()

    return {
      AlertDialog,
      mutation: useMutation({
      mutationFn: createSubArea,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subareas"] }); // Refresca la lista
        fire({
          title: "¡Éxito!",
          text: "SubArea creada exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",          
        })
      },
      onError(error: string) {
        fire({
          title: "Error",
          text: `Ocurrió un error al crear la subarea: ${error}`,
          icon: "error",
          confirmButtonText: "Aceptar",
      });
      },
    })
  }
  };
  
  // Actualizar un ítem
  export const useUpdateSubArea = () => {
    const queryClient = useQueryClient();
    const { fire, AlertDialog } = useAlertDialog();
  
    return {
      AlertDialog,
      mutation: useMutation({
        mutationFn: ({ id, Data }: { id: string; Data: Partial<CreateSubAreaDto> }) =>
          updateSubArea(id, Data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["subareas"] });
          fire({
            title: "¡Éxito!",
            text: "SubArea actualizado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        },
        onError: (error: string) => {
          fire({
            title: "Error",
            text: `Ocurrió un error al actualizar el subarea: ${error}`,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        },
      }),
    };
  };
  // Eliminar un ítem
  export const useDeleteSubArea = () => {
    const queryClient = useQueryClient();
    const { fire, AlertDialog } = useAlertDialog();
  
    return {
      AlertDialog,
      mutation: useMutation({
        mutationFn: (id: string) => deleteSubArea(id),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["subareas"] });
          fire({
            title: "¡Éxito!",
            text: "SubArea eliminado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        },
        onError: (error: string) => {
          fire({
            title: "Error",
            text: `Ocurrió un error al eliminar la subarea: ${error}`,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        },
      }),
    };
  };