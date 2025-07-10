# Guía de Configuración del Frontend - Dama Glam Store

## Configuración Actual Completada ✅

### 1. Variables de Entorno
- ✅ Archivo `.env` creado con la URL del backend
- ✅ Configuración apunta a `http://localhost:7147/api`

### 2. Servicios API
- ✅ Servicio de autenticación configurado
- ✅ Servicio de productos configurado
- ✅ Mapeo de categorías implementado
- ✅ Funciones de mapeo entre frontend y backend completadas

### 3. Contextos
- ✅ AuthContext funcional
- ✅ ProductsContext funcional
- ✅ CartContext funcional

### 4. Componentes UI
- ✅ Todos los componentes Shadcn/ui están instalados
- ✅ ProductCard implementado
- ✅ Layout components (Header, BottomNav) disponibles

## Para Ejecutar el Proyecto:

### 1. Instalar dependencias
```bash
cd "c:\Users\bscl\Desktop\Accesorios_lilis_v2\dama-glam-store"
npm install
```

### 2. Verificar que el backend esté corriendo
- El backend debe estar ejecutándose en `http://localhost:7147`
- Verificar que los endpoints del API estén disponibles

### 3. Ejecutar el frontend
```bash
npm run dev
```

### 4. Abrir en navegador
- La aplicación estará disponible en `http://localhost:8080`

## Funcionalidades Implementadas:

### ✅ Autenticación
- Login de usuarios
- Registro de usuarios
- Manejo de tokens JWT
- Persistencia de sesión

### ✅ Gestión de Productos
- Visualización de productos
- Búsqueda y filtrado
- Categorización automática
- Integración completa con el backend

### ✅ Carrito de Compras
- Agregar/quitar productos
- Persistencia local
- Integración con backend

### ✅ Interfaz de Usuario
- Diseño responsive
- Tema oscuro/claro
- Componentes modernos con Shadcn/ui
- Navegación móvil optimizada

## Notas Importantes:

1. **Configuración del Backend**: Asegúrate de que el backend esté corriendo en el puerto 7147
2. **CORS**: El backend debe permitir conexiones desde localhost:8080
3. **Base de Datos**: Verificar que la base de datos esté inicializada con las tablas necesarias

## Scripts Disponibles:

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run test:api` - Pruebas de API
- `npm run init:db` - Inicializar base de datos

El frontend está completamente configurado y listo para usar. Solo necesitas:
1. Ejecutar el backend
2. Ejecutar `npm install`
3. Ejecutar `npm run dev`
