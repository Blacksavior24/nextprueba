import { Area, CreateAreaDto } from "@/interfaces/areas.interfaces"
import { formsApi } from "@/lib/axios"
import { AxiosError } from "axios"

export const createArea = async(data : CreateAreaDto) => {
    try {
        const response = await formsApi.post("responsible-area", data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
        } else {
            throw new Error((error as Error).message)
        }
    }    
}

export const updateArea = async(id: string, data: Partial<CreateAreaDto>) => {
    const {subAreas, ...rest} = data
    try {
        const response = await formsApi.patch(`responsible-area/${id}`, rest)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
        } else {
            throw new Error((error as Error).message)
        }
    }
}

export const getAreas = async () => {
    try {
        const response = await formsApi.get<Area[]>("responsible-area")
        return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      } 
    }
}

export const getAreaById = async (id: string) => {
    try {
        const response = await formsApi.get<Area>(`responsible-area/${id}`)
        return response.data
    } catch (error) {
    if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      }     
    }
}

export const deleteArea = async (id: string) => {
    try {
        const response = await formsApi.delete(`responsible-area/${id}`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
          } else {
            throw new Error((error as Error).message)
        } 
    }
}