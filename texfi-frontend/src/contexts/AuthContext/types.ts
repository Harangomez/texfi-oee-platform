import type { Usuario, Taller, Cliente, RegisterData } from '../../types';

export interface AuthContextType {
  user: Usuario | null;
  taller: Taller | null;
  cliente: Cliente | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>; // CAMBIAR any por RegisterData
  logout: () => void;
  isLoading: boolean;
}