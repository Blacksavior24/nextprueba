import { CreateUsuarioDto, Usuario, UsuarioResponse } from "@/interfaces/usuarios.interfaces";
import { formsApi } from "@/lib/axios"
import { AxiosError } from "axios";

export const getUsers = async(
    page: number = 1, 
    limit: number = 10, 
    filters?: Record<string, string>, 
    search?: string, 
    searchBy?: string[] 
) => {
    try {
 
        const params = new URLSearchParams();

        if (filters) {
            params.append('filters', JSON.stringify(filters))
        }

        if (search) {
            params.append('search', search)
        }
        if (searchBy) {
            searchBy.forEach(field => params.append('searchBy', field))
        }

        params.append('page', page.toString())
        params.append('limit', limit.toString())

        const users = await formsApi.get<UsuarioResponse>('users', {params})

        return users.data
        
    } catch (error) {
        if (error instanceof AxiosError && error.response) {     
            throw new Error( error.response.data.message);
        } else {
            throw new Error((error as Error).message);
        }
    }
}

export const getUserById = async (id : string) => {
    try {
        const user = await formsApi.get(`users/${id}`);
        return user.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {     
            throw new Error( error.response.data.message);
        } else {
            throw new Error((error as Error).message);
        }
    }
};

export const createUser = async (userData : CreateUsuarioDto) => {
    try {
        const newUser = await formsApi.post<Usuario>("users", userData);
        return newUser.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {     
            throw new Error( error.response.data.message);
        } else {
            throw new Error((error as Error).message);
        }
    }
};

export const updateUser = async (id: string, userData : Partial<CreateUsuarioDto> ) => {
    try {
        
        const updatedUser = await formsApi.patch<Usuario>(`users/${id}`, userData);
        return updatedUser.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {     
            throw new Error( error.response.data.message);
        } else {
            throw new Error((error as Error).message);
        }
    }
};

export const deleteUser = async (id:string) => {
    try {
        const response = await formsApi.delete(`users/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {     
            throw new Error( error.response.data.message);
        } else {
            throw new Error((error as Error).message);
        }
    }
};