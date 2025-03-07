import { createReceivedCard, getCardById, getCardByIdTraza, getCards, getCardsEmitidos } from "@/actions/cards.action" // Asumiendo que el archivo es servicios/cartas
import { useMutation, useQuery } from "@tanstack/react-query"
import { Card, CardsResponse, CreateCardDto } from "@/interfaces/cartas.interfaces"
import { useAlertDialog } from "@/components/AlertDialog"

export const useGetCards = (
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, string>,
    search?: string,
    searchBy?: string[]
) => {
    return useQuery<CardsResponse>({
        queryKey: ["cards", page, limit, filters, search, searchBy],
        queryFn: ()=>getCards(page, limit, filters, search,searchBy),
        staleTime: 1000*10*10,
    })
}

export const useGetCardById = (id: string, open: boolean) => {
    return useQuery<{fechaIngreso: Date} & Omit<Card, 'fechaIngreso'>>({
        queryKey: ['card', id],
        queryFn: () => getCardById(id),
        staleTime: 1000*10*10,
        enabled: !!id && open
    })
}

export const useGetCardByIdTraza = (id: string, open: boolean) => {
    return useQuery<Card>({
        queryKey: ['cardtraza', id],
        queryFn: () => getCardByIdTraza(id),
        staleTime: 1000*10*10,
        enabled: !!id && open
    })
}

export const useGetCardsEmitidos = () => {
  return useQuery<Card[], Error>({
      queryKey: ["cardsEmitidos"],
      queryFn: getCardsEmitidos,
      staleTime: 1000*10*10
  })
}   


export const useCreateReceivedCardMutation = (
  resetForm: () => void,
  onOpenChange: (open: boolean) => void
) => {
  const { fire, AlertDialog } = useAlertDialog();

  return {
      AlertDialog, // Exportar el componente para renderizarlo en tu aplicación
      mutation: useMutation({
          mutationFn: (data: { pdfInfo: File } & Omit<CreateCardDto, "pdfInfo">) =>
              createReceivedCard(data),
          onSuccess: () => {
              fire({
                  title: "¡Éxito!",
                  text: "Carta recibida creada exitosamente",
                  icon: "success",
                  confirmButtonText: "Aceptar",
                  onConfirm: () => {
                      resetForm();
                      onOpenChange(false);
                  },
              });
          },
          onError: (error: string) => {
              fire({
                  title: "Error",
                  text: `Ocurrió un error al crear la carta: ${error}`,
                  icon: "error",
                  confirmButtonText: "Aceptar",
              });
          },
      }),
  };
};
