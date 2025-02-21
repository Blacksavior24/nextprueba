import { SubArea, CreateSubAreaDto } from "@/interfaces/subareas.interfaces"
import { formsApi } from "@/lib/axios"
import { AxiosError } from "axios"

export const createSubArea = async(data : CreateSubAreaDto) => {
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

export const updateSubArea = async(id: string, data: Partial<CreateSubAreaDto>) => {
    try {
        const response = await formsApi.patch(`responsible-area/${id}`, data)
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
        const response = await formsApi.get<SubArea[]>("responsible-area")
        return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      } 
    }
}

export const getSubArea= async (id: string) => {
    try {
        const response = await formsApi.get<SubArea>(`responsible-area/${id}`)
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