import { createArea, deleteArea, getAreaById, getAreas, updateArea } from "@/actions/areas.action";
import { useAlertDialog } from "@/components/AlertDialog";
import { Area, CreateAreaDto } from "@/interfaces/areas.interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetAreas = () =>{
    return useQuery<Area[]>({
        queryKey: ['areas'],
        queryFn: getAreas,
        staleTime: 1000* 60 * 5
    })
}

// Obtener un ítem por ID
export const useGetArea = (id: string) => {
    return useQuery({
      queryKey: ["area", id],
      queryFn: () => getAreaById(id),
      enabled: !!id, // Solo se ejecuta si hay un ID
    });
  };
  
  // Crear un nuevo ítem
  export const useCreateArea = () => {
    const queryClient = useQueryClient();

    const {fire, AlertDialog } = useAlertDialog()

    return {
      AlertDialog,
      mutation: useMutation({
      mutationFn: createArea,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["areas"] }); // Refresca la lista
        fire({
          title: "¡Éxito!",
          text: "Area creada exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",          
        })
      },
      onError(error: string) {
        fire({
          title: "Error",
          text: `Ocurrió un error al crear el área: ${error}`,
          icon: "error",
          confirmButtonText: "Aceptar",
      });
      },
    })
  }
  };
  
  // Actualizar un ítem
  export const useUpdateArea = () => {
    const queryClient = useQueryClient();
    const { fire, AlertDialog } = useAlertDialog();
  
    return {
      AlertDialog,
      mutation: useMutation({
        mutationFn: ({ id, Data }: { id: string; Data: Partial<CreateAreaDto> }) =>
          updateArea(id, Data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["areas"] });
          fire({
            title: "¡Éxito!",
            text: "Area actualizado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        },
        onError: (error: string) => {
          fire({
            title: "Error",
            text: `Ocurrió un error al actualizar la área: ${error}`,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        },
      }),
    };
  };
  // Eliminar un ítem
  export const useDeleteArea = () => {
    const queryClient = useQueryClient();
    const { fire, AlertDialog } = useAlertDialog();
  
    return {
      AlertDialog,
      mutation: useMutation({
        mutationFn: (id: string) => deleteArea(id),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["areas"] });
          fire({
            title: "¡Éxito!",
            text: "Area eliminado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        },
        onError: (error: string) => {
          fire({
            title: "Error",
            text: `Ocurrió un error al eliminar el área: ${error}`,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        },
      }),
    };
  };