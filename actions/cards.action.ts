import { AssignedCardDto, AssignmentCardDto, Card, CardsResponse, PendingCardDto, ReceivedCardDto } from "@/interfaces/cartas.interfaces"
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

        const { pdfInfo,correosCopia,referencia, ...rest } = receivedCardDto

        const fileData = await uploadFile(pdfInfo)

        const payload: ReceivedCardDto = {
            ...rest,
            pdfInfo: fileData.fileName,
        }
        const payloadFinal = {
          ...payload,
          correosCopia: [correosCopia],
          referencia: Number(referencia),
          tipo: payload.tipo?'Respondido':'Recibido'
        }

        const response = await formsApi.post('cards/received', payloadFinal)
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

export const answerCardPending = async (id: string, pendingCardDto: {cartaborrador?: File} & Omit<PendingCardDto, 'cartaborrador'>) => {
  try {
    const {cartaborrador, ...rest} = pendingCardDto

    let fileData;
    let payload: PendingCardDto;

    if (cartaborrador) {
      fileData = await uploadFile(cartaborrador);
      payload = {
        ...rest,
        cartaborrador: fileData.fileName
      }
    } else {
      payload = {
        ...rest
      }
    }
    const response = await formsApi.patch(`cards/pending/${id}`, payload)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error((error as Error).message)
    } 
  }
}

export const closeCardPending = async (id: string) => {
  try {
    
    const payload = {
      estado: "Cerrado"
    }
    const response = await formsApi.patch(`cards/${id}`, payload)
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

export const getCards = async (
  page: number = 1, 
  limit: number = 10, 
  filters?: Record<string, string>, 
  search?: string, 
  searchBy?: string[] 
):  Promise<CardsResponse> => {
    try {

        
        const params = new URLSearchParams();

        if (filters) {
          params.append('filters', JSON.stringify(filters))
        }

        if (search) {
          params.append('search', search)
        }
        if (searchBy) {
          searchBy.forEach(field=> params.append('searchBy', field))
        }

        params.append('page', page.toString())
        params.append('limit', limit.toString())


        const response = await formsApi.get<CardsResponse>('cards', {params})

        const modifiedData = response.data.data.map(card=>({
          ...card,
          pdfInfo: `${process.env.NEXT_PUBLIC_API_URL}fileupload/files/${card.pdfInfo}`
        }))

        console.log("data que llega", modifiedData)

        return {
          ...response.data,
          data: modifiedData
        }
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
      const {pdfInfo, fechaIngreso, correosCopia, cartaborrador , ...rest} = response.data

      let link = pdfInfo ? `${process.env.NEXT_PUBLIC_API_URL}fileupload/files/${pdfInfo}` : ''
      let link2 = cartaborrador ? `${process.env.NEXT_PUBLIC_API_URL}fileupload/files/${cartaborrador}`: ''

      let formatFechaIngreso = parseISO(fechaIngreso)


      const payload = {
        ...rest,
        fechaIngreso: formatFechaIngreso,
        pdfInfo: link,
        correosCopia,
        cartaborrador: link2
        //correosCopia: correosCopia.join(',')
      }

      return payload
  } catch (error) {
      if (error instanceof AxiosError && error.response) {
          throw new Error(error.response.data.message)
        } else {
          throw new Error((error as Error).message)
        } 
  }
}

export const getCardByIdTraza = async (id:string) => {
  try {
      const response = await formsApi.get<Card>(`cards/report/${id}`)
      const {pdfInfo, fechaIngreso, correosCopia , ...rest} = response.data

      let link = pdfInfo ? `${process.env.NEXT_PUBLIC_API_URL}fileupload/files/${pdfInfo}` : ''

      const payload = {
        ...rest,
        fechaIngreso,
        pdfInfo: link,
        correosCopia
        //correosCopia: correosCopia.join(',')
      }

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

export const getCardsPending = async (
  subAreaId: number,
  page: number = 1, 
  limit: number = 10, 
  filters?: Record<string, string>, 
  search?: string, 
  searchBy?: string[] 
):  Promise<CardsResponse> => {
    try {

        
        const params = new URLSearchParams();

        if (filters) {
          params.append('filters', JSON.stringify(filters))
        }

        if (search) {
          params.append('search', search)
        }
        if (searchBy) {
          searchBy.forEach(field=> params.append('searchBy', field))
        }

        params.append('page', page.toString())
        params.append('limit', limit.toString())


        const response = await formsApi.get<CardsResponse>(`cards/pending/${subAreaId}`, {params})

        const modifiedData = response.data.data.map(card=>({
          ...card,
          pdfInfo: `${process.env.NEXT_PUBLIC_API_URL}fileupload/files/${card.pdfInfo}`
        }))

        console.log("data que llega", modifiedData)

        return {
          ...response.data,
          data: modifiedData
        }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      } 
    }
}