import { AssignedCardDto, AssignmentCardDto, Card, PendingCardDto, ReceivedCardDto } from "@/interfaces/cartas.interfaces"
import { formsApi } from "@/lib/axios"
import { AxiosError } from "axios"
import { parseISO } from "date-fns"

const uploadFile = async (file: any) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
  
      const response = await formsApi.post("/fileupload/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
  
      return response.data // { secureUrl, fileName }
    } catch (error) {
      console.error("Error al subir archivo:", error)
      throw new Error("No se pudo subir el archivo.")
    }
  }

export const createReceivedCard = async(receivedCardDto: { pdfInfo: File } & Omit<ReceivedCardDto, 'pdfInfo'>) => {
    try {
        console.log("que esta llegando tmre", receivedCardDto)

        const { pdfInfo, ...rest } = receivedCardDto

        const fileData = await uploadFile(pdfInfo)

        const payload: ReceivedCardDto = {
            ...rest,
            pdfInfo: fileData.fileName
        }
        

        const response = await formsApi.post('cards/received', payload)
        return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      } 
    }
}

export const assignCard = async (id: string, assignedCardDto: AssignedCardDto)=>{
    try {
        const response = await formsApi.patch(`cards/assigned/${id}`, assignedCardDto)
        return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      } 
    }
}

export const markCardAsPending = async (id: string, pendingCardDto: PendingCardDto) => {
  try {
    const response = await formsApi.patch(`cards/pending/${id}`, pendingCardDto)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error((error as Error).message)
    } 
  }
}

export const changeCardAssignment = async (id: string, assignmentCardDto: AssignmentCardDto) => {
    try {
      const response = await formsApi.patch(`cards/assignment/${id}`, assignmentCardDto)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      } 
    }
}

export const getCards = async () => {
    try {
        const response = await formsApi.get<Card[]>("cards")
        console.log("cartas", response.data)
        const links = response.data.map(card => ({
            ...card,
            pdfInfo: `${process.env.NEXT_PUBLIC_API_URL}fileupload/files/${card.pdfInfo}`
        }))
        return links
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      } 
    }
}

export const getCardById = async (id:string) => {
  try {
      const response = await formsApi.get<Card>(`cards/${id}`)
      console.log("cartas", response.data)
      const {pdfInfo, fechaIngreso,...rest} = response.data

      let link = pdfInfo ? `${process.env.NEXT_PUBLIC_API_URL}fileupload/files/${pdfInfo}` : ''

      let formatFechaIngreso = parseISO(fechaIngreso)

      const payload = {
        ...rest,
        fechaIngreso: formatFechaIngreso,
        pdfInfo: link
      }
      console.log('payload', payload)

      return payload
  } catch (error) {
      if (error instanceof AxiosError && error.response) {
          throw new Error(error.response.data.message)
        } else {
          throw new Error((error as Error).message)
        } 
  }
}

export const getCardsEmitidos = async () => {
  try {
      const response = await formsApi.get<Card[]>("cards/emitidos")
      const links = response.data.map(card => ({
          ...card,
          pdfInfo: `${process.env.NEXT_PUBLIC_API_URL}fileupload/files/${card.pdfInfo}`
      }))
      return links
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error((error as Error).message)
    } 
  }
}