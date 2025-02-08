import {create} from 'zustand';
import axios from 'axios';
import { Rol } from '@/interfaces/roles.interfaces';

// Definir el estado del store
interface RolesState {
    roles: Rol[];
    loading: boolean;
    error: string | null;
    isUpdating: boolean; // Nuevo estado para manejar la carga durante la actualización
    fetchRoles: () => Promise<void>;
    createRol: (rol: CreateRolDto) => Promise<void>;
    updateRol: (id: number, rol: CreateRolDto) => Promise<void>;
    deleteRol: (id: number) => Promise<void>;
}

// Definir el DTO para crear un rol (debe coincidir con el DTO en NestJS)
interface CreateRolDto {
    nombre: string;
}

// Crear el store de Zustand
const useRolesStore = create<RolesState>()((set, get) => ({
    roles: [],
    loading: false,
    error: null,
    isUpdating: false,
    // Acción para obtener todos los roles
    fetchRoles: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get<Rol[]>('http://localhost:3003/api/v1/roles');
            set({ roles: response.data, loading: false });
        } catch (error) {
            set({ error: 'Error fetching roles', loading: false });
        }
    },

    // Acción para crear un nuevo rol
    createRol: async (rol: CreateRolDto) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post<Rol>('http://localhost:3003/api/v1/roles', rol);
            set((state) => ({ roles: [...state.roles, response.data], loading: false }));
        } catch (error) {
            set({ error: 'Error creating role', loading: false });
        }
    },

    // Acción para actualizar un rol existente
    updateRol: async (id, rol) => {
        set({ isUpdating: true, error: null }); // Activar el estado de actualización
        try {
          const response = await axios.patch<Rol>(`http://localhost:3003/api/v1/roles/${id}`, rol);
          set((state) => {
            const updatedRoles = state.roles.map((r) =>
              r.id === id ? { ...r, ...response.data } : r
            );
            
            return { roles: updatedRoles, isUpdating: false }; // Desactivar el estado de actualización
          });
        } catch (error) {
          set({ error: 'Error updating role', isUpdating: false });
          console.error('Error updating role:', error);
        }
      },

    // Acción para eliminar un rol
    deleteRol: async (id: number) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`http://localhost:3003/api/v1/roles/${id}`);
            set((state) => ({
                roles: state.roles.filter((r) => r.id !== id),
                loading: false,
            }));
        } catch (error) {
            set({ error: 'Error deleting role', loading: false });
        }
    },
}));

export default useRolesStore;