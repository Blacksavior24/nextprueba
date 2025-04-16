import { answerCardPending, closeCardPending, createReceivedCard, getCardById, getCardByIdTraza, getCards, getCardsEmitidos, getCardsPending, getStats, updateReceivedCard } from "@/actions/cards.action" // Asumiendo que el archivo es servicios/cartas
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, CardsResponse, CreateCardDto, PendingCardDto } from "@/interfaces/cartas.interfaces"
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

export const useGetStats = (
    userId: string
) => {
    return useQuery({
        queryKey: ['stats', userId],
        queryFn: ()=> getStats(userId),
        enabled: !!userId
    })
}

export const useGetCardsPending = (
    subAreaId: number,
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, string>,
    search?: string,
    searchBy?: string[]
) => {
    return useQuery<CardsResponse>({
        queryKey: ["cardspending", page, limit, filters, search, searchBy],
        queryFn: () => getCardsPending(subAreaId, page, limit, filters, search, searchBy),
        staleTime: 1000*10*10,
        enabled: !!subAreaId
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
  const queryClient = useQueryClient();
  return {
      AlertDialog, // Exportar el componente para renderizarlo en tu aplicación
      mutation: useMutation({
          mutationFn: (data: { pdfInfo?: File } & Omit<CreateCardDto, "pdfInfo">) =>
              createReceivedCard(data),
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cards"] });
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
            console.log('se crea')
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

export const useUpdateReceivedCardMutation = (
    resetForm: () => void,
  onOpenChange: (open: boolean) => void
) => {
    const { fire, AlertDialog } = useAlertDialog();
  const queryClient = useQueryClient();
  return {
      AlertDialog, // Exportar el componente para renderizarlo en tu aplicación
      mutation: useMutation({
          mutationFn: (data: { pdfInfo?: File } & {id : string} & Omit<CreateCardDto, "pdfInfo">) =>
              updateReceivedCard(data),
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cards"] });
              fire({
                  title: "¡Éxito!",
                  text: "Carta recibida actualizada exitosamente",
                  icon: "success",
                  confirmButtonText: "Aceptar",
                  onConfirm: () => {
                      resetForm();
                      onOpenChange(false);
                  },
              });
          },
          onError: (error: string) => {
            console.log('se crea')
              fire({
                  title: "Error",
                  text: `Ocurrió un error al crear la carta: ${error}`,
                  icon: "error",
                  confirmButtonText: "Aceptar",
              });
          },
      }),
  };
}

export const useAnswerPendingCardMutation = (
    id: string,
    resetForm: () => void,
    onOpenChange: (open: boolean) => void
)=> {
    const { fire, AlertDialog } = useAlertDialog()
    const queryClient = useQueryClient();
    return {
        AlertDialog,
        mutation: useMutation({
            mutationFn: (data: {cartaborrador?: File} & Omit<PendingCardDto, "cartaborrador">) =>
                answerCardPending(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["cardspending"] });
                fire({
                    title: "¡Éxito!",
                    text: "Actualización de carta exitosamente",
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
                    text: `Ocurrió un error al actualizar la carta: ${error}`,
                    icon: "error",
                    confirmButtonText: "Aceptar",
                });
            },
        })
    }
}


export const useClosePendingCardMutation = ()=> {
    const { fire, AlertDialog } = useAlertDialog()
    const queryClient = useQueryClient();
    return {
        AlertDialog,
        mutation: useMutation({
            mutationFn: ( id: string,) =>
                closeCardPending(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["cardspending"] });
                fire({
                    title: "¡Éxito!",
                    text: "Carta Cerrada exitosamente",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    onConfirm: () => {
                    },
                });
            },
            onError: (error: string) => {
                fire({
                    title: "Error",
                    text: `Ocurrió un error al actualizar la carta: ${error}`,
                    icon: "error",
                    confirmButtonText: "Aceptar",
                });
            },
        })
    }
}
