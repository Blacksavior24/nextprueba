import { create } from 'zustand';
import axios from 'axios';
import { Usuario, Meta, UsuarioResponse } from '@/app/interfaces/usuarios.interfaces';

// Definir el estado del store
interface UsuariosState {
    usuarios: Usuario[];
    meta: Meta | null;
    loading: boolean;
    error: string | null;
    isUpdating: boolean;
    fetchUsuarios: (page?: number, limit?: number) => Promise<void>;
    createUsuario: (usuario: CreateUsuarioDto) => Promise<void>;
    updateUsuario: (id: string, usuario: CreateUsuarioDto) => Promise<void>;
    deleteUsuario: (id: string) => Promise<void>;
}

// Definir el DTO para crear un usuario (debe coincidir con el DTO en NestJS)
export interface CreateUsuarioDto {
    nombre: string;
    email: string;
    apellidos?: string | null;
    contraseña: string;
    areaId?: string | null;
    subAreaId?: string | null;
    rolId: string;
    procedencia?: string | null;
    tipoUsuario: "admin" | "user";
    jefe: "si" | "no";
    creadoPorId?: string | null;
}

// Crear el store de Zustand
const useUsuariosStore = create<UsuariosState>()((set, get) => ({
    usuarios: [],
    meta: null,
    loading: false,
    error: null,
    isUpdating: false,

    // Acción para obtener todos los usuarios con paginación
    fetchUsuarios: async (page = 1, limit = 10) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get<UsuarioResponse>(
                `http://localhost:3003/api/v1/users?page=${page}&limit=${limit}`
            );
            set({ usuarios: response.data.data, meta: response.data.meta, loading: false });
        } catch (error) {
            set({ error: 'Error fetching usuarios', loading: false });
        }
    },

    // Acción para crear un nuevo usuario
    createUsuario: async (usuario: CreateUsuarioDto) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post<Usuario>('http://localhost:3003/api/v1/users', usuario);
            set((state) => ({ usuarios: [...state.usuarios, response.data], loading: false }));
        } catch (error) {
            set({ error: 'Error creating usuario', loading: false });
        }
    },

    // Acción para actualizar un usuario existente
    updateUsuario: async (id: string, usuario: CreateUsuarioDto) => {
        set({ isUpdating: true, error: null });
        try {
            const response = await axios.patch<Usuario>(`http://localhost:3003/api/v1/users/${id}`, usuario);
            set((state) => {
                const updatedUsuarios = state.usuarios.map((u) =>
                    u.id === id ? { ...u, ...response.data } : u
                );
                return { usuarios: updatedUsuarios, isUpdating: false };
            });
        } catch (error) {
            set({ error: 'Error updating usuario', isUpdating: false });
            console.error('Error updating usuario:', error);
        }
    },

    // Acción para eliminar un usuario
    deleteUsuario: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`http://localhost:3003/api/v1/users/${id}`);
            set((state) => ({
                usuarios: state.usuarios.filter((u) => u.id !== id),
                loading: false,
            }));
        } catch (error) {
            set({ error: 'Error deleting usuario', loading: false });
        }
    },
}));

export default useUsuariosStore;