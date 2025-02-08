import {create} from 'zustand';
import axios from 'axios';
import { Tema } from '@/interfaces/temas.interfaces';

// Definir el estado del store
interface TemasState {
    temas: Tema[];
    loading: boolean;
    error: string | null;
    isUpdating: boolean; // Nuevo estado para manejar la carga durante la actualización
    fetchTemas: () => Promise<void>;
    createTema: (tema: CreateTemaDto) => Promise<void>;
    updateTema: (id: number, tema: CreateTemaDto) => Promise<void>;
    deleteTema: (id: number) => Promise<void>;
}

// Definir el DTO para crear un tema (debe coincidir con el DTO en NestJS)
interface CreateTemaDto {
    nombre: string;
}

// Crear el store de Zustand
const useTemasStore = create<TemasState>()((set, get) => ({
    temas: [],
    loading: false,
    error: null,
    isUpdating: false,
    // Acción para obtener todos los Temas
    fetchTemas: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get<Tema[]>('http://localhost:3003/api/v1/theme');
            set({ temas: response.data, loading: false });
        } catch (error) {
            set({ error: 'Error fetching Temas', loading: false });
        }
    },

    // Acción para crear un nuevo tema
    createTema: async (tema: CreateTemaDto) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post<Tema>('http://localhost:3003/api/v1/theme', tema);
            set((state) => ({ temas: [...state.temas, response.data], loading: false }));
        } catch (error) {
            set({ error: 'Error creating tema', loading: false });
        }
    },

    // Acción para actualizar un tema existente
    updateTema: async (id, tema) => {
        set({ isUpdating: true, error: null }); 
        try {
          const response = await axios.patch<Tema>(`http://localhost:3003/api/v1/theme/${id}`, tema);
          set((state) => {
            const updatedTemas = state.temas.map((r) =>
              r.id === id ? { ...r, ...response.data } : r
            );
            
            return { temas: updatedTemas, isUpdating: false }; 
          });
        } catch (error) {
          set({ error: 'Error updating tema', isUpdating: false });
          console.error('Error updating tema:', error);
        }
      },

    // Acción para eliminar un tema
    deleteTema: async (id: number) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`http://localhost:3003/api/v1/theme/${id}`);
            set((state) => ({
                temas: state.temas.filter((r) => r.id !== id),
                loading: false,
            }));
        } catch (error) {
            set({ error: 'Error deleting tema', loading: false });
        }
    },
}));

export default useTemasStore;