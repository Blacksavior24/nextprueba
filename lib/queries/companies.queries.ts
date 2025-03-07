
import { createEmpresa, deleteEmpresa, getEmpresaById, getEmpresas, updateEmpresa } from "@/actions/companies.action";
import { useAlertDialog } from "@/components/AlertDialog";
import { CreateEmpresaDto, Empresa } from "@/interfaces/empresas.interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetEmpresas = () =>{
    return useQuery<Empresa[]>({
        queryKey: ['empresas'],
        queryFn: getEmpresas,
        staleTime: 1000* 60 * 5
    })
}

// Obtener un ítem por ID
export const useGetEmpresa = (id: string) => {
    return useQuery({
      queryKey: ["empresa", id],
      queryFn: () => getEmpresaById(id),
      enabled: !!id, // Solo se ejecuta si hay un ID
    });
  };
  
  // Crear un nuevo ítem
  export const useCreateEmpresa = () => {
    const queryClient = useQueryClient();

    const {fire, AlertDialog } = useAlertDialog()

    return {
      AlertDialog,
      mutation: useMutation({
      mutationFn: createEmpresa,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["empresas"] }); // Refresca la lista
        fire({
          title: "¡Éxito!",
          text: "Empresa creada exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",          
        })
      },
      onError(error: string) {
        fire({
          title: "Error",
          text: `Ocurrió un error al crear la empresa: ${error}`,
          icon: "error",
          confirmButtonText: "Aceptar",
      });
      },
    })
  }
  };
  
  // Actualizar un ítem
  export const useUpdateEmpresa = () => {
    const queryClient = useQueryClient();
    const { fire, AlertDialog } = useAlertDialog();
  
    return {
      AlertDialog,
      mutation: useMutation({
        mutationFn: ({ id, Data }: { id: string; Data: Partial<CreateEmpresaDto> }) =>
          updateEmpresa(id, Data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["empresas"] });
          fire({
            title: "¡Éxito!",
            text: "Empresa actualizado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        },
        onError: (error: string) => {
          fire({
            title: "Error",
            text: `Ocurrió un error al actualizar la empresa: ${error}`,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        },
      }),
    };
  };
  // Eliminar un ítem
  export const useDeleteEmpresa = () => {
    const queryClient = useQueryClient();
    const { fire, AlertDialog } = useAlertDialog();
  
    return {
      AlertDialog,
      mutation: useMutation({
        mutationFn: (id: string) => deleteEmpresa(id),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["empresas"] });
          fire({
            title: "¡Éxito!",
            text: "Empresa eliminado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        },
        onError: (error: string) => {
          fire({
            title: "Error",
            text: `Ocurrió un error al eliminar la empresa: ${error}`,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        },
      }),
    };
  };