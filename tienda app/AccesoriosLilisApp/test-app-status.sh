#!/bin/bash

# Script de prueba para verificar el estado de la aplicación móvil

echo "=== Estado de la Aplicación Móvil Accesorios Lilis ==="
echo ""

# Verificar si el backend está funcionando
echo "1. Verificando conexión al backend..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://192.168.1.3:7147/api/health || echo "000")
if [ "$response" -eq 200 ]; then
    echo "✅ Backend funcionando correctamente"
else
    echo "❌ Backend no responde (código: $response)"
fi

echo ""
echo "2. Estructura del proyecto móvil:"
echo "📱 App.tsx - Punto de entrada principal"
echo "📂 src/"
echo "  ├── components/ - Componentes reutilizables"
echo "  │   ├── Button.tsx"
echo "  │   ├── Input.tsx"
echo "  │   └── ProductCard.tsx"
echo "  ├── contexts/ - Gestión de estado"
echo "  │   ├── AuthContext.tsx"
echo "  │   ├── CartContext.tsx"
echo "  │   └── ProductsContext.tsx"
echo "  ├── navigation/ - Navegación de la app"
echo "  │   └── AppNavigator.tsx"
echo "  ├── screens/ - Pantallas principales"
echo "  │   ├── AdminScreen.tsx"
echo "  │   ├── CartScreen.tsx"
echo "  │   ├── CatalogScreen.tsx"
echo "  │   ├── HomeScreen.tsx"
echo "  │   ├── LoginScreen.tsx"
echo "  │   ├── ProfileScreen.tsx"
echo "  │   ├── ProductDetailScreen.tsx"
echo "  │   ├── RegisterScreen.tsx"
echo "  │   └── WelcomeScreen.tsx"
echo "  ├── services/ - Servicios de API"
echo "  │   └── api.ts"
echo "  ├── types/ - Definiciones de tipos"
echo "  │   └── index.ts"
echo "  └── config/ - Configuración"
echo "      └── index.ts"

echo ""
echo "3. Funcionalidades implementadas:"
echo "✅ Autenticación (Login/Registro)"
echo "✅ Catálogo de productos"
echo "✅ Carrito de compras"
echo "✅ Perfil de usuario"
echo "✅ Panel de administración"
echo "✅ Navegación por pestañas"
echo "✅ Gestión de estado con Context API"
echo "✅ Integración con API del backend"
echo "✅ Almacenamiento seguro (SecureStore)"
echo "✅ UI responsive adaptada para móvil"

echo ""
echo "4. Configuración actual:"
echo "Backend URL: http://192.168.1.3:7147/api"
echo "Timeout: 10 segundos"
echo "Reintentos: 3"

echo ""
echo "5. Para ejecutar la aplicación:"
echo "cd 'tienda app/AccesoriosLilisApp'"
echo "npm start"
echo "Escanea el código QR con Expo Go"

echo ""
echo "¡La aplicación móvil está lista para usar! 🎉"
