// Configuración de la aplicación
export const config = {
  // URL del backend
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:7147/api',
  
  // Configuración de desarrollo
  isDevelopment: import.meta.env.DEV,
  
  // Configuración de la aplicación
  APP_NAME: 'Dama Glam Store',
  APP_VERSION: '1.0.0',
  
  // Configuración del carrito
  CART_STORAGE_KEY: 'dama_glam_cart',
  USER_STORAGE_KEY: 'dama_glam_user',
  TOKEN_STORAGE_KEY: 'dama_glam_token',
  
  // Configuración de productos
  DEFAULT_PRODUCT_IMAGE: '/placeholder.svg',
  PRODUCTS_PER_PAGE: 12,
  
  // Mapeo de categorías
  CATEGORY_MAPPING: {
    'earrings': { id: 1, name: 'Aretes' },
    'necklaces': { id: 2, name: 'Collares' },
    'bracelets': { id: 3, name: 'Pulseras' },
    'rings': { id: 4, name: 'Anillos' },
    'bags': { id: 5, name: 'Bolsas' },
    'watches': { id: 6, name: 'Relojes' },
    'sunglasses': { id: 7, name: 'Gafas' }
  } as const
};

export default config;
