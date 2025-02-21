import { Tema, CreateTemaDto } from "@/interfaces/temas.interfaces"
import { formsApi } from "@/lib/axios"
import { AxiosError } from "axios"

export const createTema = async(data : CreateTemaDto) => {
    try {
        const response = await formsApi.post("theme", data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
        } else {
            throw new Error((error as Error).message)
        }
    }    
}

export const updateTema = async(id: string, data: Partial<CreateTemaDto>) => {
    try {
        const response = await formsApi.patch(`theme/${id}`, data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
        } else {
            throw new Error((error as Error).message)
        }
    }
}

export const getTemas = async () => {
    try {
        const response = await formsApi.get<Tema[]>("theme")
        return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      } 
    }
}

export const getTema = async (id: string) => {
    try {
        const response = await formsApi.get<Tema>(`theme/${id}`)
        return response.data
    } catch (error) {
    if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      }     
    }
}

export const deleteTema = async (id: string) => {
    try {
        const response = await formsApi.delete(`theme/${id}`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
          } else {
            throw new Error((error as Error).message)
        } 
    }
}