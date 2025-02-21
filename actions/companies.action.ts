import { Empresa, CreateEmpresaDto } from "@/interfaces/empresas.interfaces"
import { formsApi } from "@/lib/axios"
import { AxiosError } from "axios"

export const createEmpresa = async(data : CreateEmpresaDto) => {
    try {
        const response = await formsApi.post("company", data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
        } else {
            throw new Error((error as Error).message)
        }
    }    
}

export const updateEmpresa = async(id: string, data: Partial<CreateEmpresaDto>) => {
    try {
        const response = await formsApi.patch(`company/${id}`, data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
        } else {
            throw new Error((error as Error).message)
        }
    }
}

export const getEmpresas = async () => {
    try {
        const response = await formsApi.get<Empresa[]>("company")
        return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      } 
    }
}

export const getEmpresa = async (id: string) => {
    try {
        const response = await formsApi.get<Empresa>(`company/${id}`)
        return response.data
    } catch (error) {
    if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error((error as Error).message)
      }     
    }
}

export const deleteEmpresa = async (id: string) => {
    try {
        const response = await formsApi.delete(`company/${id}`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message)
          } else {
            throw new Error((error as Error).message)
        } 
    }
}