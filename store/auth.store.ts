import { formsApi } from '@/lib/axios';
import { AxiosError } from 'axios';
import { create } from 'zustand';

interface RolAuth {
  nombre: string
}
interface AuthState {
  token: string | null;
  isLoading: boolean;
  user: {
    id: number | null;
    nombre: string | null;
    email: string | null;
    subAreaId: number;
    rol: RolAuth | null;
  } | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  initializeAuth: () => void; // Nueva función para inicializar el estado
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  token: null,
  isLoading: false,
  error: null,
  user: null,

  // Inicializar el estado desde localStorage
  initializeAuth: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      set({ token, user: JSON.parse(user) });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await formsApi.post('auth/login', {
        email, contraseña: password,
      });

      if (!response) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.data;
      set({ token: data.access_token, isLoading: false });

      // Almacenar el token en localStorage
      localStorage.setItem('token', data.access_token);

      // Obtener y almacenar el perfil del usuario
      await get().fetchProfile();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        set({ error: error.response.data.message, isLoading: false });
      } else {
        set({ error: (error as Error).message, isLoading: false });
      }
    }
  },

  logout: () => {
    set({ token: null, user: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await formsApi('auth/profile');

      if (!response) {
        throw new Error('Error al obtener el perfil');
      }

      const profileData = await response.data;
      set({ user: profileData, isLoading: false });

      // Almacenar los datos del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(profileData));
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        set({ error: error.response.data.message, isLoading: false });
      } else {
        set({ error: (error as Error).message, isLoading: false });
      }
    }
  },
}));