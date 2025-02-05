import {create} from 'zustand';
import axios from 'axios';
import { Area } from '@/app/interfaces/areas.interfaces';

// Definir el estado del store
interface AreasState {
    areas: Area[];
    loading: boolean;
    error: string | null;
    isUpdating: boolean; // Nuevo estado para manejar la carga durante la actualización
    fetchAreas: () => Promise<void>;
    createArea: (area: CreateAreaDto) => Promise<void>;
    updateArea: (id: number, area: CreateAreaDto) => Promise<void>;
    deleteArea: (id: number) => Promise<void>;
}

// Definir el DTO para crear un area (debe coincidir con el DTO en NestJS)
interface CreateAreaDto {
    nombre: string;
    procedencia: string;
}

// Crear el store de Zustand
const useAreasStore = create<AreasState>()((set, get) => ({
    areas: [],
    loading: false,
    error: null,
    isUpdating: false,
    // Acción para obtener todos los Areas
    fetchAreas: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get<Area[]>('http://localhost:3003/api/v1/responsible-area');
            set({ areas: response.data, loading: false });
        } catch (error) {
            set({ error: 'Error fetching Temas', loading: false });
        }
    },

    // Acción para crear un nuevo area
    createArea: async (area: CreateAreaDto) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post<Area>('http://localhost:3003/api/v1/responsible-area', area);
            set((state) => ({ areas: [...state.areas, response.data], loading: false }));
        } catch (error) {
            set({ error: 'Error creating area', loading: false });
        }
    },

    // Acción para actualizar un tema existente
    updateArea: async (id, area) => {
        set({ isUpdating: true, error: null }); 
        try {
          const response = await axios.patch<Area>(`http://localhost:3003/api/v1/responsible-area/${id}`, area);
          set((state) => {
            const updatedAreas = state.areas.map((r) =>
              r.id === id ? { ...r, ...response.data } : r
            );
            
            return { areas: updatedAreas, isUpdating: false }; 
          });
        } catch (error) {
          set({ error: 'Error updating area', isUpdating: false });
          console.error('Error updating area:', error);
        }
      },

    // Acción para eliminar un tema
    deleteArea: async (id: number) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`http://localhost:3003/api/v1/responsible-area/${id}`);
            set((state) => ({
                areas: state.areas.filter((r) => r.id !== id),
                loading: false,
            }));
        } catch (error) {
            set({ error: 'Error deleting area', loading: false });
        }
    },
}));

export default useAreasStore;