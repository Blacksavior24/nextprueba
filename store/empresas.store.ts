import { create } from 'zustand';
import { AxiosError } from 'axios';
import { Empresa } from '@/interfaces/empresas.interfaces';
import { formsApi } from '@/lib/axios';

// Definir el estado del store
interface EmpresasState {
    empresas: Empresa[];
    loading: boolean;
    error: string | null;
    isUpdating: boolean;
    fetchEmpresas: () => Promise<void>;
    createEmpresa: (empresa: CreateEmpresaDto) => Promise<void>;
    updateEmpresa: (id: number, empresa: CreateEmpresaDto) => Promise<void>;
    deleteEmpresa: (id: number) => Promise<void>;
}

// Definir el DTO para crear una empresa
interface CreateEmpresaDto {
    nombre: string;
}

// Crear el store de Zustand
const useEmpresasStore = create<EmpresasState>()((set, get) => ({
    empresas: [],
    loading: false,
    error: null,
    isUpdating: false,

    // Acción para obtener todas las empresas
    fetchEmpresas: async () => {
        set({ loading: true, error: null });
        try {
            const response = await formsApi.get<Empresa[]>('company');
            set({ empresas: response.data, loading: false });
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                set({ error: error.response.data.message, loading: false });
            } else {
                set({ error: (error as Error).message, loading: false });
            }
        }
    },

    // Acción para crear una nueva empresa
    createEmpresa: async (empresa: CreateEmpresaDto) => {
        set({ loading: true, error: null });
        try {
            const response = await formsApi.post<Empresa>('company', empresa);
            set((state) => ({ empresas: [...state.empresas, response.data], loading: false }));
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                set({ error: error.response.data.message, loading: false });
            } else {
                set({ error: (error as Error).message, loading: false });
            }
        }
    },

    // Acción para actualizar una empresa existente
    updateEmpresa: async (id, empresa) => {
        set({ isUpdating: true, error: null });
        try {
            const response = await formsApi.patch<Empresa>(`company/${id}`, empresa);
            set((state) => {
                const updatedEmpresas = state.empresas.map((e) =>
                    e.id === id ? { ...e, ...response.data } : e
                );
                return { empresas: updatedEmpresas, isUpdating: false };
            });
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                set({ error: error.response.data.message, isUpdating: false });
            } else {
                set({ error: (error as Error).message, isUpdating: false });
            }
        }
    },

    // Acción para eliminar una empresa
    deleteEmpresa: async (id: number) => {
        set({ loading: true, error: null });
        try {
            await formsApi.delete(`company/${id}`);
            set((state) => ({
                empresas: state.empresas.filter((e) => e.id !== id),
                loading: false,
            }));
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                set({ error: error.response.data.message, loading: false });
            } else {
                set({ error: (error as Error).message, loading: false });
            }
        }
    },
}));

export default useEmpresasStore;
