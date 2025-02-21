
import Swal from "sweetalert2"
import { createReceivedCard, getCardById, getCards, getCardsEmitidos } from "@/actions/cards.action" // Asumiendo que el archivo es servicios/cartas
import { useMutation, useQuery } from "@tanstack/react-query"
import { Card, CreateCardDto } from "@/interfaces/cartas.interfaces"

export const useGetCards = () => {
    return useQuery<Card[]>({
        queryKey: ["cards"],
        queryFn: getCards,
        staleTime: 1000*10*10
    })
}

export const useGetCardById = (id: string) => {
    return useQuery<{fechaIngreso: Date} & Omit<Card, 'fechaIngreso'>>({
        queryKey: ['card', id],
        queryFn: () => getCardById(id),
        staleTime: 1000*10*10,
        enabled: !!id
    })
}

export const useGetCardsEmitidos = () => {
  return useQuery<Card[], Error>({
      queryKey: ["cardsEmitidos"],
      queryFn: getCardsEmitidos,
      staleTime: 1000*10*10
  })
}


export const useCreateReceivedCardMutation = (resetForm: () => void) => {
  return useMutation({
    mutationFn: (data: { pdfInfo: File } & Omit<CreateCardDto, 'pdfInfo'>) => createReceivedCard(data),
    onSuccess: () => {
      Swal.fire({
        title: "¡Éxito!",
        text: "Carta recibida creada exitosamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      })
      resetForm()
    },
    onError: (error: string) => {
      Swal.fire({
        title: "Error",
        text: `Ocurrió un error al crear la carta: ${error}`,
        icon: "error",
        confirmButtonText: "Aceptar",
      })
    },
  })
}
