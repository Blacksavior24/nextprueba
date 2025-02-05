import { formsApi } from '@/lib/axios';
import { AxiosError } from 'axios';
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  user: {
    id: number | null;
    nombre: string | null;
    email: string | null;
    rol: string | null;
  } | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  token: null,
  isLoading: false,
  error: null,
  user: null,
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      
      const response = await formsApi.post('auth/login', {
         email, contraseña: password ,
      });

      if (!response) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.data;
      set({ token: data.access_token, isLoading: false });
      localStorage.setItem("token", data.access_token)
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        set({ error: error.response.data.message, isLoading: false });  
      }else{
        set({ error: (error as Error).message, isLoading: false });
      }
      
    }
  },
  logout: () => {
    set({ token: null });
    localStorage.removeItem("token")
  },
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await formsApi(`auth/profile`);

      if (!response) {
        throw new Error('Error al obtener el perfil');
      }

      const profileData = await response;
      set({ user: profileData.data, isLoading: false }); // Almacena los datos del perfil
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));