// Configuración de la aplicación
export const API_CONFIG = {
  // Usar la IP de tu máquina local para desarrollo
  // Cambia esta IP por la IP de tu computadora donde corre el backend
  BASE_URL: 'http://192.168.1.3:7147/api', // Cambia la IP según tu red, puerto correcto 7147
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
};

export const APP_CONFIG = {
  NAME: 'Accesorios Lilis',
  VERSION: '1.0.0',
  DESCRIPTION: 'Tienda de accesorios y joyas',
  COMPANY: 'Lilis Store',
};

export const COLORS = {
  // Colores principales basados en el diseño web
  primary: '#ec4899', // Pink-500
  primaryDark: '#be185d', // Pink-700
  secondary: '#8b5cf6', // Purple-500
  background: '#0f0f0f', // Negro casi puro
  backgroundGradient: ['#000000', '#1a1a1a', '#ec4899'] as const, // Negro a rosa
  surface: '#1a1a1a', // Gris muy oscuro
  surfaceVariant: '#2d2d2d', // Gris oscuro
  text: '#ffffff', // Blanco
  textSecondary: '#a3a3a3', // Gris claro
  textMuted: '#6b7280', // Gris medio
  border: '#374151', // Gris para bordes
  success: '#10b981', // Verde
  error: '#ef4444', // Rojo
  warning: '#f59e0b', // Amarillo
  info: '#3b82f6', // Azul
};

export const FONTS = {
  regular: 'System', // Fuente del sistema
  medium: 'System', // Fuente del sistema medium
  bold: 'System', // Fuente del sistema bold
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export default {
  API_CONFIG,
  APP_CONFIG,
  COLORS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
};
