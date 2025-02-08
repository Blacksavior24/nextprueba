import { create } from 'zustand';
import { AxiosError } from 'axios';
import { CreateDestinatarioDto, Destinatario } from '@/interfaces/destinatarios.interfaces';
import { formsApi } from '@/lib/axios';

// Definir el estado del store
interface DestinatarioState {
    destinatarios: Destinatario[];
    isLoading: boolean;
    error: string | null;
    isUpdating: boolean;
    fetchDestinatarios: (page?: number, limit?: number) => Promise<void>;
    createDestinatario: (dest: CreateDestinatarioDto) => Promise<void>;
    updateDestinatario: (id: number, dest: CreateDestinatarioDto) => Promise<void>;
    deleteDestinatario: (id: number) => Promise<void>;
}

// Crear el store de Zustand
const useDestinatariosStore = create<DestinatarioState>()((set, get) => ({
    destinatarios: [],
    isLoading: false,
    error: null,
    isUpdating: false,

    // Acción para obtener todos los dest
    fetchDestinatarios: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await formsApi.get('receiver');
            
            set({ destinatarios: response.data, isLoading: false });
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                set({ error: error.response.data.message, isLoading: false });  
            }else{
                set({ error: (error as Error).message, isLoading: false });
            } 
        }
    },

    // Acción para crear un nuevo dest
    createDestinatario: async (dest: CreateDestinatarioDto) => {
        set({ isLoading: true, error: null });
        try {
            const response = await formsApi.post<Destinatario>('receiver', dest);
            
            set((state) => ({ destinatarios: [...state.destinatarios, response.data], isLoading: false }));
        } catch (error) {

           
            
            if (error instanceof AxiosError && error.response) {
                set({ error: error.response.data.message, isLoading: false });  
            }else{
                set({ error: (error as Error).message, isLoading: false });
            }            
        }
    },

    // Acción para actualizar un dest existente
    updateDestinatario: async (id, dest) => {
        set({ isUpdating: true, error: null });
        try {
            const response = await formsApi.patch<Destinatario>(`receiver/${id}`, dest);
            set((state) => {
                const updatedDestinatarios = state.destinatarios.map((u) =>
                    u.id === id ? { ...u, ...response.data } : u
                );
                return { destinatarios: updatedDestinatarios, isUpdating: false };
            });
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                set({ error: error.response.data.message, isLoading: false });  
            }else{
                set({ error: (error as Error).message, isLoading: false });
            } 
        }
    },

    // Acción para eliminar un dest
    deleteDestinatario: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await formsApi.delete(`receiver/${id}`);
            set((state) => ({
                destinatarios: state.destinatarios.filter((u) => u.id !== id),
                isLoading: false,
            }));
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                set({ error: error.response.data.message, isLoading: false });  
            }else{
                set({ error: (error as Error).message, isLoading: false });
            } 
        }
    },
}));

export default useDestinatariosStore;