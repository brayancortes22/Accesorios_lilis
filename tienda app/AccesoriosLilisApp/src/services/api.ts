import { API_CONFIG } from '../config';
import { User, Product, RegisterData } from '../types';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = API_CONFIG.BASE_URL;

// Tipos para las respuestas del backend
interface BackendUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
  city?: string;
  role?: string;
  rolId?: number;
  createdAt: string;
}

interface ProductoBackend {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  seccionId: number;
  seccionNombre: string;
  esEncargo: boolean;
  material?: string;
}

// Función para realizar peticiones HTTP
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Agregar token de autenticación si existe
  try {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
  } catch (error) {
    console.log('Error getting token:', error);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Mapear categorías del backend al frontend
const mapCategoryFromBackend = (seccionNombre: string): Product['category'] => {
  const categoryMap: { [key: string]: Product['category'] } = {
    'Aretes': 'earrings',
    'Collares': 'necklaces',
    'Pulseras': 'bracelets',
    'Anillos': 'rings',
    'Bolsos': 'bags',
    'Relojes': 'watches',
    'Gafas': 'sunglasses',
  };
  return categoryMap[seccionNombre] || 'earrings';
};

// Mapear categorías del frontend al backend
const mapCategoryToBackend = (category: Product['category']): number => {
  const categoryMap: { [key in Product['category']]: number } = {
    'earrings': 1,
    'necklaces': 2,
    'bracelets': 3,
    'rings': 4,
    'bags': 5,
    'watches': 6,
    'sunglasses': 7,
  };
  return categoryMap[category] || 1;
};

// Servicios de autenticación
export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const response = await apiRequest('/Usuario/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      // Guardar token en SecureStore
      if (response.token) {
        await SecureStore.setItemAsync('userToken', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: RegisterData): Promise<{ user: User; token: string }> => {
    try {
      const response = await apiRequest('/Usuario/register', {
        method: 'POST',
        body: JSON.stringify({
          nombre: userData.name,
          email: userData.email,
          passwordHash: userData.password,
          telefono: userData.phone,
          direccion: userData.address,
          activo: true,
          rolId: userData.role === 'admin' ? 1 : 2 // 1 para admin, 2 para cliente
        }),
      });
      
      // Guardar token en SecureStore
      if (response.token) {
        await SecureStore.setItemAsync('userToken', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      return await apiRequest('/Usuario/current');
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  // Función para verificar si el usuario está autenticado
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      return !!token;
    } catch (error) {
      return false;
    }
  },

  // Función para obtener datos del usuario almacenados
  getStoredUserData: async (): Promise<User | null> => {
    try {
      const userData = await SecureStore.getItemAsync('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  },

  // Función para guardar datos del usuario
  storeUserData: async (user: User): Promise<void> => {
    try {
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  },
};

// Servicios de productos
export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response: ProductoBackend[] = await apiRequest('/Producto');
      
      // Transformar datos del backend al formato del frontend
      return response.map((producto: ProductoBackend) => ({
        id: producto.id.toString(),
        name: producto.nombre,
        price: producto.precio,
        image: producto.imagenUrl,
        category: mapCategoryFromBackend(producto.seccionNombre),
        description: producto.descripcion || '',
        inStock: producto.stock > 0,
        featured: false // Se puede agregar esta lógica después
      }));
    } catch (error) {
      console.error('Get all products error:', error);
      throw error;
    }
  },

  getProductById: async (id: string): Promise<Product> => {
    try {
      const response: ProductoBackend = await apiRequest(`/Producto/${id}`);
      
      return {
        id: response.id.toString(),
        name: response.nombre,
        price: response.precio,
        image: response.imagenUrl,
        category: mapCategoryFromBackend(response.seccionNombre),
        description: response.descripcion || '',
        inStock: response.stock > 0,
        featured: false
      };
    } catch (error) {
      console.error('Get product by id error:', error);
      throw error;
    }
  },

  createProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const response: ProductoBackend = await apiRequest('/Producto', {
        method: 'POST',
        body: JSON.stringify({
          nombre: productData.name,
          descripcion: productData.description,
          precio: productData.price,
          stock: productData.inStock ? 10 : 0,
          imagenUrl: productData.image,
          seccionId: mapCategoryToBackend(productData.category),
          esEncargo: false,
          material: ''
        }),
      });
      
      return {
        id: response.id.toString(),
        name: response.nombre,
        price: response.precio,
        image: response.imagenUrl,
        category: productData.category,
        description: response.descripcion || '',
        inStock: response.stock > 0,
        featured: false
      };
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    try {
      const response: ProductoBackend = await apiRequest('/Producto', {
        method: 'PUT',
        body: JSON.stringify({
          id: parseInt(id),
          nombre: productData.name,
          descripcion: productData.description,
          precio: productData.price,
          stock: productData.inStock ? 10 : 0,
          imagenUrl: productData.image,
          seccionId: productData.category ? mapCategoryToBackend(productData.category) : undefined
        }),
      });
      
      return {
        id: response.id.toString(),
        name: response.nombre,
        price: response.precio,
        image: response.imagenUrl,
        category: productData.category || 'earrings',
        description: response.descripcion || '',
        inStock: response.stock > 0,
        featured: false
      };
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    try {
      await apiRequest(`/Producto/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  },
};

// Función para verificar conectividad con el backend
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Backend connection check failed:', error);
    return false;
  }
};

export default {
  authService,
  productService,
  checkBackendConnection,
};
