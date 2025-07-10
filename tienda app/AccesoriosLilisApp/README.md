# Accesorios Lilis - Aplicación Móvil

Una aplicación móvil React Native/Expo que replica todas las funcionalidades de la tienda web Dama Glam Store.

## 📱 Características Principales

- **Autenticación completa**: Login, registro y gestión de roles (admin/usuario)
- **Catálogo de productos**: Navegación por categorías, búsqueda y filtros
- **Carrito de compras**: Agregar, eliminar y modificar cantidades
- **Perfil de usuario**: Información personal y configuraciones
- **Panel de administración**: Gestión de productos y usuarios (solo admins)
- **Navegación intuitiva**: Navegación por pestañas con indicadores visuales
- **UI moderna**: Diseño oscuro con gradientes y animaciones

## 🛠 Tecnologías Utilizadas

- **React Native** con **Expo**
- **TypeScript** para tipado fuerte
- **React Navigation** para navegación
- **Context API** para gestión de estado
- **Expo SecureStore** para almacenamiento seguro
- **AsyncStorage** para persistencia de datos
- **Linear Gradient** para efectos visuales
- **Vector Icons** para iconografía

## 📂 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Button.tsx      # Botón personalizado
│   ├── Input.tsx       # Campo de entrada personalizado
│   └── ProductCard.tsx # Tarjeta de producto
├── contexts/           # Proveedores de estado global
│   ├── AuthContext.tsx # Autenticación y usuarios
│   ├── CartContext.tsx # Carrito de compras
│   └── ProductsContext.tsx # Productos
├── navigation/         # Configuración de navegación
│   └── AppNavigator.tsx # Navegador principal
├── screens/           # Pantallas de la aplicación
│   ├── AdminScreen.tsx # Panel de administración
│   ├── CartScreen.tsx  # Carrito de compras
│   ├── CatalogScreen.tsx # Catálogo de productos
│   ├── HomeScreen.tsx  # Pantalla de inicio
│   ├── LoginScreen.tsx # Inicio de sesión
│   ├── ProfileScreen.tsx # Perfil de usuario
│   ├── ProductDetailScreen.tsx # Detalle de producto
│   ├── RegisterScreen.tsx # Registro de usuario
│   └── WelcomeScreen.tsx # Pantalla de bienvenida
├── services/          # Servicios de API
│   └── api.ts         # Cliente de API REST
├── types/             # Definiciones de TypeScript
│   └── index.ts       # Tipos principales
└── config/            # Configuración
    └── index.ts       # Configuración global
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn
- Expo CLI: `npm install -g @expo/cli`
- Backend de Accesorios Lilis ejecutándose

### Pasos de Instalación

1. **Clonar e instalar dependencias**:
```bash
cd "tienda app/AccesoriosLilisApp"
npm install
```

2. **Configurar la URL del backend**:
Edita `src/config/index.ts` y cambia la IP por la de tu máquina:
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://TU_IP:7147/api', // Cambia TU_IP
  // ...
};
```

3. **Ejecutar la aplicación**:
```bash
npm start
```

4. **Probar en dispositivo**:
- Instala **Expo Go** en tu dispositivo móvil
- Escanea el código QR que aparece en la terminal
- ¡Listo! La app se cargará en tu dispositivo

## 📋 Funcionalidades Detalladas

### 🔐 Autenticación
- Login con email y contraseña
- Registro de nuevos usuarios
- Validación de campos
- Almacenamiento seguro de tokens
- Gestión de roles (admin/usuario)

### 🛍 Catálogo de Productos
- Lista de productos con imágenes
- Búsqueda por nombre
- Filtros por categoría
- Productos destacados
- Vista de detalles completa

### 🛒 Carrito de Compras
- Agregar productos desde cualquier pantalla
- Modificar cantidades
- Eliminar productos
- Cálculo automático de totales
- Persistencia entre sesiones

### 👤 Perfil de Usuario
- Información personal
- Historial de actividad
- Configuraciones de la app
- Acceso al panel de admin (solo admins)

### ⚙️ Panel de Administración
- **Gestión de Productos**:
  - Crear, editar y eliminar productos
  - Vista previa en tiempo real
  - Gestión de categorías
  - Control de stock y estado
- **Gestión de Usuarios**:
  - Crear nuevos usuarios
  - Asignar roles (admin/usuario)
  - Validación de datos

## 🎨 Diseño y UI

- **Tema oscuro**: Fondo negro con elementos en gris oscuro
- **Gradientes**: Transiciones suaves de negro a rosa
- **Tipografía**: Fuentes del sistema optimizadas
- **Iconografía**: Ionicons para consistencia visual
- **Responsive**: Adaptado para diferentes tamaños de pantalla

## 🔧 API y Backend

La aplicación se conecta al backend ASP.NET Core mediante:

- **Endpoints REST** para todas las operaciones
- **Autenticación JWT** para seguridad
- **Manejo de errores** robusto
- **Reintentos automáticos** en caso de fallas
- **Timeouts configurables**

### Endpoints Principales:
- `POST /api/usuario/login` - Iniciar sesión
- `POST /api/usuario/register` - Registrar usuario
- `GET /api/producto` - Obtener productos
- `POST /api/producto` - Crear producto (admin)
- `PUT /api/producto/{id}` - Actualizar producto (admin)
- `DELETE /api/producto/{id}` - Eliminar producto (admin)

## 🧪 Testing y Depuración

### Logging
- Logs detallados en modo desarrollo
- Seguimiento de llamadas API
- Estados de autenticación
- Errores de red

### Herramientas de Desarrollo
- React DevTools para componentes
- Flipper para depuración de red
- Expo DevTools para métricas

## 🚀 Deployment

### Desarrollo
```bash
npm start # Modo desarrollo con Expo
```

### Producción
```bash
expo build:android # APK para Android
expo build:ios     # IPA para iOS
```

## 🤝 Migración desde Web

Esta aplicación móvil replica fielmente las funcionalidades de la versión web:

- ✅ **Autenticación**: Mismos endpoints y flujos
- ✅ **Productos**: Gestión completa de catálogo
- ✅ **Carrito**: Funcionalidad idéntica
- ✅ **Admin**: Panel completo para administradores
- ✅ **Contextos**: Misma lógica de estado
- ✅ **API**: Mismos servicios y endpoints

## 📱 Compatibilidad

- **Android**: 5.0+ (API level 21+)
- **iOS**: 10.0+
- **Expo SDK**: 53.0.0

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de conexión de red**:
   - Verifica que el backend esté ejecutándose
   - Confirma la IP correcta en `config/index.ts`
   - Asegúrate de estar en la misma red

2. **La app no carga**:
   - Reinicia el servidor de Expo: `npm start --clear`
   - Limpia caché: `expo start -c`

3. **Problemas de autenticación**:
   - Verifica que el backend tenga CORS configurado
   - Confirma que los endpoints de auth funcionen

## 🎯 Próximas Mejoras

- 📞 Notificaciones push
- 🔗 Deep linking
- 📶 Modo offline
- 🎨 Temas personalizables
- 📊 Analytics de uso
- 🔄 Sincronización en tiempo real

---

**¡La aplicación móvil Accesorios Lilis está lista para usar! 🎉**

Para cualquier problema o sugerencia, revisa los logs de la aplicación y el estado del backend.
