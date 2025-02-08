import { CreateUsuarioDto, Usuario, UsuarioResponse } from "@/interfaces/usuarios.interfaces";
import { formsApi } from "@/lib/axios"
import { AxiosError } from "axios";

export const getUsers = async() => {
    try {
        const users = await formsApi.get<UsuarioResponse>('users')

        return users.data
        
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            return error.response.data.message;  
        }else{
            return error
        }
    }
}

export const getUserById = async (id : string) => {
    try {
        const user = await formsApi.get(`users/${id}`);
        return user.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            return error.response.data.message;
        } else {
            return error;
        }
    }
};

export const createUser = async (userData : CreateUsuarioDto) => {
    try {
        const newUser = await formsApi.post<Usuario>("users", userData);
        return newUser.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            return error.response.data.message;
        } else {
            return error;
        }
    }
};

export const updateUser = async (id: string, userData : Partial<CreateUsuarioDto> ) => {
    try {
        const updatedUser = await formsApi.patch<Usuario>(`users/${id}`, userData);
        return updatedUser.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            return error.response.data.message;
        } else {
            return error;
        }
    }
};

export const deleteUser = async (id:string) => {
    try {
        const response = await formsApi.delete(`users/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            return error.response.data.message;
        } else {
            return error;
        }
    }
};