import {create} from 'zustand';
import axios from 'axios';
import { Empresa } from '@/app/interfaces/empresas.interfaces';

// Definir el estado del store
interface EmpresasState {
    empresas: Empresa[];
    loading: boolean;
    error: string | null;
    isUpdating: boolean; // Nuevo estado para manejar la carga durante la actualización
    fetchEmpresas: () => Promise<void>;
    createEmpresa: (rol: CreateEmpresaDto) => Promise<void>;
    updateEmpresa: (id: number, rol: CreateEmpresaDto) => Promise<void>;
    deleteEmpresa: (id: number) => Promise<void>;
}

// Definir el DTO para crear un rol (debe coincidir con el DTO en NestJS)
interface CreateEmpresaDto {
    nombre: string;
}

// Crear el store de Zustand
const useEmpresasStore = create<EmpresasState>()((set, get) => ({
    empresas: [],
    loading: false,
    error: null,
    isUpdating: false,
    // Acción para obtener todos los Empresas
    fetchEmpresas: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get<Empresa[]>('http://localhost:3003/api/v1/company');
            set({ empresas: response.data, loading: false });
        } catch (error) {
            set({ error: 'Error fetching empresas', loading: false });
        }
    },

    // Acción para crear un nuevo rol
    createEmpresa: async (rol: CreateEmpresaDto) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post<Empresa>('http://localhost:3003/api/v1/company', rol);
            set((state) => ({ empresas: [...state.empresas, response.data], loading: false }));
        } catch (error) {
            set({ error: 'Error creating role', loading: false });
        }
    },

    // Acción para actualizar un rol existente
    updateEmpresa: async (id, rol) => {
        set({ isUpdating: true, error: null }); // Activar el estado de actualización
        try {
          const response = await axios.patch<Empresa>(`http://localhost:3003/api/v1/company/${id}`, rol);
          set((state) => {
            const updatedEmpresas = state.empresas.map((r) =>
              r.id === id ? { ...r, ...response.data } : r
            );
            
            return { empresas: updatedEmpresas, isUpdating: false }; // Desactivar el estado de actualización
          });
        } catch (error) {
          set({ error: 'Error updating role', isUpdating: false });
          console.error('Error updating role:', error);
        }
      },

    // Acción para eliminar un rol
    deleteEmpresa: async (id: number) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`http://localhost:3003/api/v1/company/${id}`);
            set((state) => ({
                empresas: state.empresas.filter((r) => r.id !== id),
                loading: false,
            }));
        } catch (error) {
            set({ error: 'Error deleting role', loading: false });
        }
    },
}));

export default useEmpresasStore;