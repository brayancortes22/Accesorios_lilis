import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, RegisterData } from '../types';
import { authService } from '../services/api';

// Tipo para la respuesta del backend que incluye rolId
interface BackendUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
  city?: string;
  role?: string;
  rolId?: number; // Campo del backend
  createdAt: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Computed property para verificar si es admin
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    // Verificar si hay un usuario almacenado
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const isAuthenticated = await authService.isAuthenticated();
      if (isAuthenticated) {
        const storedUser = await authService.getStoredUserData();
        if (storedUser) {
          setUser(storedUser);
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      // Mapear el rolId a rol de texto - verificar tanto rolId como role
      let userRole: 'admin' | 'user' = 'user';
      
      // Log para debugging
      console.log('Login response:', response);
      console.log('User data:', response.user);
      
      const backendUser = response.user as unknown as BackendUser;
      
      // Verificar rolId (desde la base de datos)
      if (backendUser && backendUser.rolId === 1) {
        userRole = 'admin';
      } else if (backendUser && backendUser.rolId === 2) {
        userRole = 'user';
      }
      // Fallback: verificar role como string
      else if (backendUser && backendUser.role === 'admin') {
        userRole = 'admin';
      }
      // Fallback adicional: usar email para determinar admin (temporal)
      else if (backendUser && (
        backendUser.email === 'elmundodelanime92@gmail.com' || 
        backendUser.email === 'admin@glamstore.com' ||
        backendUser.name === 'admin'
      )) {
        userRole = 'admin';
        console.log('🔧 Usando fallback de email para determinar admin');
      }
      
      console.log('Mapped role:', userRole);
      
      const userData: User = {
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        phone: backendUser.phone || '',
        address: backendUser.address || '',
        country: backendUser.country || '',
        city: backendUser.city || '',
        role: userRole, // Usar el rol mapeado
        createdAt: new Date(backendUser.createdAt),
      };

      setUser(userData);
      await authService.storeUserData(userData);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      // Mapear el rolId a rol de texto
      let userRole: 'admin' | 'user' = 'user';
      
      const backendUser = response.user as unknown as BackendUser;
      
      if (backendUser && backendUser.rolId === 1) {
        userRole = 'admin';
      } else if (backendUser && backendUser.rolId === 2) {
        userRole = 'user';
      }
      
      const newUser: User = {
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        phone: backendUser.phone || userData.phone,
        address: backendUser.address || userData.address,
        country: backendUser.country || userData.country,
        city: backendUser.city || userData.city,
        role: userRole, // Usar el rol mapeado
        createdAt: new Date(backendUser.createdAt || Date.now()),
      };

      setUser(newUser);
      await authService.storeUserData(newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: RegisterData & { role: 'admin' | 'user' }): Promise<boolean> => {
    try {
      const response = await authService.register({
        ...userData,
        role: userData.role
      });
      return !!response;
    } catch (error) {
      console.error('Create user error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, createUser, logout, isLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
