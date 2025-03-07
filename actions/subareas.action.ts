import { SubArea, CreateSubAreaDto } from "@/interfaces/subareas.interfaces"
import { formsApi } from "@/lib/axios"
import { AxiosError } from "axios"

export const createSubArea = async(data : CreateSubAreaDto) => {
    try {
        const response = await formsApi.post("sub-areas", data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
        } else {
            throw new Error((error as Error).message)
        }
    }    
}

export const updateSubArea = async(id: string, data: Partial<CreateSubAreaDto>) => {
    try {
        const response = await formsApi.patch(`sub-areas/${id}`, data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
        } else {
            throw new Error((error as Error).message)
        }
    }
}

export const getSubAreas = async () => {
    try {
        const response = await formsApi.get<SubArea[]>("sub-areas")
        return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      } 
    }
}

export const getSubAreaById = async (id: string) => {
    try {
        const response = await formsApi.get<SubArea>(`sub-areas/${id}`)
        return response.data
    } catch (error) {
    if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      }     
    }
}

export const deleteSubArea = async (id: string) => {
    try {
        const response = await formsApi.delete(`sub-areas/${id}`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
          } else {
            throw new Error((error as Error).message)
        } 
    }
}