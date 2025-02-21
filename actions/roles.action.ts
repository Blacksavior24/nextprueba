import { Rol, CreateRolDto } from "@/interfaces/roles.interfaces"
import { formsApi } from "@/lib/axios"
import { AxiosError } from "axios"

export const createRol = async(data : CreateRolDto) => {
    try {
        const response = await formsApi.post("roles", data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
        } else {
            throw new Error((error as Error).message)
        }
    }    
}

export const updateRol = async(id: string, data: Partial<CreateRolDto>) => {
    try {
        const response = await formsApi.patch(`roles/${id}`, data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
        } else {
            throw new Error((error as Error).message)
        }
    }
}

export const getRols = async () => {
    try {
        const response = await formsApi.get<Rol[]>("roles")
        return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      } 
    }
}

export const getRol = async (id: string) => {
    try {
        const response = await formsApi.get<Rol>(`roles/${id}`)
        return response.data
    } catch (error) {
    if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      }     
    }
}

export const deleteRol = async (id: string) => {
    try {
        const response = await formsApi.delete(`roles/${id}`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
          } else {
            throw new Error((error as Error).message)
        } 
    }
}