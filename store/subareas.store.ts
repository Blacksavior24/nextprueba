import {create} from 'zustand';
import axios from 'axios';
import { SubArea } from '@/app/interfaces/subareas.interfaces';

// Definir el estado del store
interface SubAreasState {
    subareas: SubArea[];
    loading: boolean;
    error: string | null;
    isUpdating: boolean; // Nuevo estado para manejar la carga durante la actualización
    fetchSubAreas: () => Promise<void>;
    createSubArea: (subarea: CreateSubAreaDto) => Promise<void>;
    updateSubArea: (id: number, subarea: CreateSubAreaDto) => Promise<void>;
    deleteSubArea: (id: number) => Promise<void>;
}

// Definir el DTO para crear un area (debe coincidir con el DTO en NestJS)
interface CreateSubAreaDto {
    nombre: string;
    procedencia?: string;
    areaResponsableId: number;
    jefatura?: string;
}

// Crear el store de Zustand
const useSubAreasStore = create<SubAreasState>()((set, get) => ({
    subareas: [],
    loading: false,
    error: null,
    isUpdating: false,
    // Acción para obtener todos los Areas
    fetchSubAreas: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get<SubArea[]>('http://localhost:3003/api/v1/sub-areas');
            set({ subareas: response.data, loading: false });
        } catch (error) {
            set({ error: 'Error fetching SubArea', loading: false });
        }
    },

    // Acción para crear un nuevo area
    createSubArea: async (area: CreateSubAreaDto) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post<SubArea>('http://localhost:3003/api/v1/sub-areas', area);
            set((state) => ({ subareas: [...state.subareas, response.data], loading: false }));
        } catch (error) {
            set({ error: 'Error creating SubArea', loading: false });
        }
    },

    // Acción para actualizar un tema existente
    updateSubArea: async (id, area) => {
        set({ isUpdating: true, error: null }); 
        try {
          const response = await axios.patch<SubArea>(`http://localhost:3003/api/v1/sub-areas/${id}`, area);
          set((state) => {
            const updatedAreas = state.subareas.map((r) =>
              r.id === id ? { ...r, ...response.data } : r
            );
            
            return { subareas: updatedAreas, isUpdating: false }; 
          });
        } catch (error) {
          set({ error: 'Error updating SubArea', isUpdating: false });
          console.error('Error updating SubArea:', error);
        }
      },

    // Acción para eliminar un tema
    deleteSubArea: async (id: number) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`http://localhost:3003/api/v1/sub-areas/${id}`);
            set((state) => ({
                areas: state.subareas.filter((r) => r.id !== id),
                loading: false,
            }));
        } catch (error) {
            set({ error: 'Error deleting SubArea', loading: false });
        }
    },
}));

export default useSubAreasStore;