
import Swal from "sweetalert2"

import { useMutation, useQuery } from "@tanstack/react-query"
import { Destinatario, CreateDestinatarioDto } from "@/interfaces/destinatarios.interfaces"
import { createReceiver, deleteReceiver, getReceiverById, getReceivers, updateReceiver } from "@/actions/receivers.action"

export const useGetReceiver = () => {
    return useQuery<Destinatario[]>({
        queryKey: ["receivers"],
        queryFn: getReceivers,
        staleTime: 1000*10*10
    })
}

export const useGetReceiverById = (id: string) => {
    return useQuery<Destinatario>({
        queryKey: ['receivers', id],
        queryFn: () => getReceiverById(id),
        staleTime: 1000*10*10,
        enabled: !!id
    })
}


export const useCreateReceiverMutation = (resetForm: () => void) => {
  return useMutation({
    mutationFn: (data: CreateDestinatarioDto) => createReceiver(data),
    onSuccess: () => {
      Swal.fire({
        title: "¡Éxito!",
        text: "Destinatario creada exitosamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      })
      resetForm()
    },
    onError: (error: string) => {
      Swal.fire({
        title: "Error",
        text: `Ocurrió un error al crear el destinatario: ${error}`,
        icon: "error",
        confirmButtonText: "Aceptar",
      })
    },
  })
}

export const useUpdateReceiverMutation = (id: string) => {
  return useMutation({
    mutationFn: (data: Partial<CreateDestinatarioDto>) => updateReceiver(id,data),
    onSuccess: () => {
      Swal.fire({
        title: "¡Éxito!",
        text: "Destinatario actualizado exitosamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      })
    },
    onError: (error: string) => {
      Swal.fire({
        title: "Error",
        text: `Ocurrió un error al actualizar el destinatario: ${error}`,
        icon: "error",
        confirmButtonText: "Aceptar",
      })
    },
  })
}

export const useDeleteReceiverMutation = () => {
  return useMutation({
    mutationFn: (id: string) => deleteReceiver(id),
    onSuccess: () => {
      Swal.fire({
        title: "¡Éxito!",
        text: "Destinatario eliminado exitosamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      })
    },
    onError: (error: string) => {
      Swal.fire({
        title: "Error",
        text: `Ocurrió un error al eliminar el destinatario: ${error}`,
        icon: "error",
        confirmButtonText: "Aceptar",
      })
    },
  })
}