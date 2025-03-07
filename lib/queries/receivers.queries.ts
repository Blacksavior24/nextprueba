import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Destinatario, CreateDestinatarioDto } from "@/interfaces/destinatarios.interfaces"
import { createReceiver, deleteReceiver, getReceiverById, getReceivers, updateReceiver } from "@/actions/receivers.action"
import { useAlertDialog } from "@/components/AlertDialog"

export const useGetReceiver = () => {
    return useQuery<Destinatario[]>({
        queryKey: ["receivers"],
        queryFn: getReceivers,
        staleTime: 1000*10*10
    })
}

export const useGetReceiverById = (id: string) => {
    return useQuery<Destinatario>({
        queryKey: ['receiver', id],
        queryFn: () => getReceiverById(id),
        staleTime: 1000*10*10,
        enabled: !!id
    })
}


export const useCreateReceiver = () => {
  const queryClient = useQueryClient();
  const {fire, AlertDialog} = useAlertDialog()
return {
      AlertDialog,
      mutation: useMutation({
      mutationFn: createReceiver,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["receivers"] }); // Refresca la lista
        fire({
          title: "¡Éxito!",
          text: "Destinatario creado exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",          
        })
      },
      onError(error: string) {
        fire({
          title: "Error",
          text: `Ocurrió un error al crear el destinatario: ${error}`,
          icon: "error",
          confirmButtonText: "Aceptar",
      });
      },
    })
  }
}

export const useUpdateReceiver = () => {
  const queryClient = useQueryClient();
  const { fire, AlertDialog } = useAlertDialog();

return {
      AlertDialog,
      mutation: useMutation({
        mutationFn: ({ id, Data }: { id: string; Data: Partial<CreateDestinatarioDto> }) =>
          updateReceiver(id, Data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["receivers"] });
          fire({
            title: "¡Éxito!",
            text: "Destinatario actualizado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        },
        onError: (error: string) => {
          fire({
            title: "Error",
            text: `Ocurrió un error al actualizar el destinatario: ${error}`,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        },
      }),
    };
}

export const useDeleteReceiver = () => {
  const queryClient = useQueryClient();
  const { fire, AlertDialog } = useAlertDialog();

return {
      AlertDialog,
      mutation: useMutation({
        mutationFn: (id: string) => deleteReceiver(id),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["receivers"] });
          fire({
            title: "¡Éxito!",
            text: "Destinatario eliminado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        },
        onError: (error: string) => {
          fire({
            title: "Error",
            text: `Ocurrió un error al eliminar el destinatario: ${error}`,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        },
      }),
    };
}