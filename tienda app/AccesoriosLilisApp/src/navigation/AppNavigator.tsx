import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { RootStackParamList, MainTabParamList } from '../types';
import { COLORS } from '../config';

// Importar pantallas
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminScreen from '../screens/AdminScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Configuración de iconos para las tabs
const getTabBarIcon = (routeName: string, focused: boolean, color: string, size: number) => {
  let iconName: keyof typeof Ionicons.glyphMap;

  switch (routeName) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'Catalog':
      iconName = focused ? 'grid' : 'grid-outline';
      break;
    case 'Cart':
      iconName = focused ? 'bag' : 'bag-outline';
      break;
    case 'Profile':
      iconName = focused ? 'person' : 'person-outline';
      break;
    default:
      iconName = 'help-outline';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

// Tabs principales
const MainTabs = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route.name, focused, color, size),
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Inicio',
        }}
      />
      <Tab.Screen 
        name="Catalog" 
        component={CatalogScreen} 
        options={{
          tabBarLabel: 'Catálogo',
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{
          tabBarLabel: 'Carrito',
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.primary,
            color: COLORS.text,
          },
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};

// Navegación principal
const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Aquí puedes mostrar un splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: COLORS.surface,
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {user ? (
          // Usuario autenticado
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen 
              name="ProductDetail" 
              component={ProductDetailScreen}
              options={{
                headerShown: true,
                title: 'Detalle del Producto',
                headerBackTitle: 'Volver',
              }}
            />
            <Stack.Screen 
              name="Admin" 
              component={AdminScreen}
              options={{
                headerShown: true,
                title: 'Administración',
                headerBackTitle: 'Volver',
              }}
            />
          </>
        ) : (
          // Usuario no autenticado
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{
                headerShown: true,
                title: 'Iniciar Sesión',
                headerBackTitle: 'Volver',
              }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{
                headerShown: true,
                title: 'Registrarse',
                headerBackTitle: 'Volver',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
