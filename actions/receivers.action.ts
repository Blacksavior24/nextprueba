import { CreateDestinatarioDto, Destinatario } from "@/interfaces/destinatarios.interfaces"
import { formsApi } from "@/lib/axios"
import { AxiosError } from "axios"

export const createReceiver = async(data : CreateDestinatarioDto) => {
    try {
        const response = await formsApi.post("receiver", data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
        } else {
            throw new Error((error as Error).message)
        }
    }    
}

export const updateReceiver = async(id: string, data: Partial<CreateDestinatarioDto>) => {
    try {
        const response = await formsApi.patch(`receiver/${id}`, data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
        } else {
            throw new Error((error as Error).message)
        }
    }
}

export const getReceivers = async () => {
    try {
        const response = await formsApi.get<Destinatario[]>("receiver")
        return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      } 
    }
}

export const getReceiverById = async (id: string) => {
    try {
        const response = await formsApi.get<Destinatario>(`receiver/${id}`)
        return response.data
    } catch (error) {
    if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      }     
    }
}

export const deleteReceiver = async (id: string) => {
    try {
        const response = await formsApi.delete(`receiver/${id}`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
          } else {
            throw new Error((error as Error).message)
        } 
    }
}