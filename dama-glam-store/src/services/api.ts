// API Service para conectar con el backend
import { User, Product, RegisterData } from '../types';
import config from '../config';

const API_BASE_URL = config.API_BASE_URL;

// Tipos para las respuestas del backend
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

interface CarritoBackend {
  id: number;
  usuarioId: number;
  estado: string;
  productos: CarritoProductoBackend[];
}

interface CarritoProductoBackend {
  id: number;
  carritoId: number;
  productoId: number;
  cantidad: number;
  producto?: ProductoBackend;
}
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
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
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

// Servicios de autenticación
export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await apiRequest('/Usuario/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Guardar token en localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  },

  register: async (userData: RegisterData): Promise<{ user: User; token: string }> => {
    const response = await apiRequest('/Usuario/register', {
      method: 'POST',
      body: JSON.stringify({
        nombre: userData.name,
        email: userData.email,
        passwordHash: userData.password,
        telefono: userData.phone,
        direccion: userData.address,
        activo: true,
        rolId: 2 // Rol de cliente por defecto
      }),
    });
    
    // Guardar token en localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<User> => {
    return await apiRequest('/Usuario/current');
  }
};

// Servicios de productos
export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
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
  },

  getProductById: async (id: string): Promise<Product> => {
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
  },

  createProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
    const response: ProductoBackend = await apiRequest('/Producto', {
      method: 'POST',
      body: JSON.stringify({
        name: productData.name,
        description: productData.description,
        precio: productData.price,
        stock: productData.inStock ? 10 : 0, // Stock por defecto
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
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const response: ProductoBackend = await apiRequest('/Producto', {
      method: 'PUT',
      body: JSON.stringify({
        id: parseInt(id),
        name: productData.name,
        description: productData.description,
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
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiRequest(`/Producto/${id}`, {
      method: 'DELETE',
    });
  }
};

// Servicios de carrito
export const cartService = {
  getCart: async (usuarioId: string): Promise<CarritoBackend> => {
    return await apiRequest(`/Carrito/usuario/${usuarioId}`);
  },

  addToCart: async (usuarioId: string, productoId: string, cantidad: number): Promise<CarritoProductoBackend> => {
    return await apiRequest('/CarritoProducto', {
      method: 'POST',
      body: JSON.stringify({
        carritoId: await getOrCreateCartId(usuarioId),
        productoId: parseInt(productoId),
        cantidad,
        activo: true
      }),
    });
  },

  updateCartItem: async (cartItemId: string, cantidad: number): Promise<CarritoProductoBackend> => {
    return await apiRequest('/CarritoProducto', {
      method: 'PUT',
      body: JSON.stringify({
        id: parseInt(cartItemId),
        cantidad,
        activo: true
      }),
    });
  },

  removeFromCart: async (cartItemId: string): Promise<void> => {
    await apiRequest(`/CarritoProducto/${cartItemId}`, {
      method: 'DELETE',
    });
  }
};

// Funciones auxiliares
const mapCategoryFromBackend = (seccionNombre: string): Product['category'] => {
  const mappings: Record<string, Product['category']> = {
    'Aretes': 'earrings',
    'Collares': 'necklaces',
    'Pulseras': 'bracelets',
    'Anillos': 'rings',
    'Bolsas': 'bags',
    'Relojes': 'watches',
    'Gafas': 'sunglasses'
  };
  
  return mappings[seccionNombre] || 'earrings';
};

const mapCategoryToBackend = (category: Product['category']): number => {
  const mappings: Record<Product['category'], number> = {
    'earrings': 1,
    'necklaces': 2,
    'bracelets': 3,
    'rings': 4,
    'bags': 5,
    'watches': 6,
    'sunglasses': 7
  };
  
  return mappings[category] || 1;
};

const getOrCreateCartId = async (usuarioId: string): Promise<number> => {
  try {
    const cart = await apiRequest(`/Carrito/usuario/${usuarioId}`);
    return cart.id;
  } catch (error) {
    // Si no existe carrito, crear uno nuevo
    const newCart = await apiRequest('/Carrito', {
      method: 'POST',
      body: JSON.stringify({
        usuarioId: parseInt(usuarioId),
        fechaCreacion: new Date(),
        activo: true
      }),
    });
    return newCart.id;
  }
};

export default {
  authService,
  productService,
  cartService
};
