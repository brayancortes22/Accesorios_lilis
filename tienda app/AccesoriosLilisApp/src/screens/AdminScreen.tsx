import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useProducts } from '../contexts/ProductsContext';
import { useAuth } from '../contexts/AuthContext';
import { Product, User, RootStackParamList } from '../types';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../config';
import Button from '../components/Button';
import Input from '../components/Input';

type AdminScreenProps = NativeStackScreenProps<RootStackParamList, 'Admin'>;

interface ProductFormData {
  name: string;
  price: string;
  image: string;
  category: Product['category'];
  description: string;
  inStock: boolean;
  featured: boolean;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  role: 'admin' | 'user';
}

const categories = [
  { value: 'earrings', label: 'Aretes' },
  { value: 'necklaces', label: 'Collares' },
  { value: 'bracelets', label: 'Pulseras' },
  { value: 'rings', label: 'Anillos' },
  { value: 'bags', label: 'Bolsos' },
  { value: 'watches', label: 'Relojes' },
  { value: 'sunglasses', label: 'Gafas' },
] as const;

export default function AdminScreen({ navigation }: AdminScreenProps) {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { createUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Product form state
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    price: '',
    image: '',
    category: 'earrings',
    description: '',
    inStock: true,
    featured: false,
  });

  // User form state
  const [userForm, setUserForm] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    country: '',
    city: '',
    role: 'user',
  });

  // Category picker state
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: '',
      image: '',
      category: 'earrings',
      description: '',
      inStock: true,
      featured: false,
    });
    setEditingProduct(null);
  };

  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      country: '',
      city: '',
      role: 'user',
    });
  };

  const handleProductSubmit = async () => {
    if (!productForm.name || !productForm.price || !productForm.image || !productForm.description) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    const price = parseFloat(productForm.price);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Error', 'El precio debe ser un número válido mayor a 0');
      return;
    }

    setLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          ...productForm,
          price,
        });
        Alert.alert('Éxito', 'Producto actualizado correctamente');
      } else {
        const newProduct: Product = {
          id: Date.now().toString(),
          name: productForm.name,
          price,
          image: productForm.image,
          category: productForm.category,
          description: productForm.description,
          inStock: productForm.inStock,
          featured: productForm.featured,
        };
        await addProduct(newProduct);
        Alert.alert('Éxito', 'Producto agregado correctamente');
      }
      resetProductForm();
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al procesar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async () => {
    if (!userForm.name || !userForm.email || !userForm.password || !userForm.phone || !userForm.address || !userForm.country || !userForm.city) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (userForm.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const success = await createUser(userForm as Required<UserFormData>);
      if (success) {
        Alert.alert('Éxito', `${userForm.role === 'admin' ? 'Administrador' : 'Usuario'} creado correctamente`);
        resetUserForm();
      } else {
        Alert.alert('Error', 'No se pudo crear el usuario');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      description: product.description,
      inStock: product.inStock,
      featured: product.featured || false,
    });
  };

  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteProduct(productId);
            Alert.alert('Éxito', 'Producto eliminado correctamente');
          },
        },
      ]
    );
  };

  const handleGoToAddProduct = () => {
    // Asegurar que estamos en la tab de productos
    setActiveTab('products');
    // Limpiar el formulario si estamos editando
    if (editingProduct) {
      resetProductForm();
    }
    // Scroll al formulario después de un pequeño delay para permitir el cambio de tab
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  const renderCategoryPicker = () => (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerTitle}>Seleccionar Categoría</Text>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.value}
          style={[
            styles.pickerOption,
            productForm.category === category.value && styles.pickerOptionSelected,
          ]}
          onPress={() => {
            setProductForm({ ...productForm, category: category.value });
            setShowCategoryPicker(false);
          }}
        >
          <Text style={[
            styles.pickerOptionText,
            productForm.category === category.value && styles.pickerOptionTextSelected,
          ]}>
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.pickerCancel}
        onPress={() => setShowCategoryPicker(false)}
      >
        <Text style={styles.pickerCancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRolePicker = () => (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerTitle}>Seleccionar Rol</Text>
      <TouchableOpacity
        style={[
          styles.pickerOption,
          userForm.role === 'user' && styles.pickerOptionSelected,
        ]}
        onPress={() => {
          setUserForm({ ...userForm, role: 'user' });
          setShowRolePicker(false);
        }}
      >
        <Text style={[
          styles.pickerOptionText,
          userForm.role === 'user' && styles.pickerOptionTextSelected,
        ]}>
          Usuario Normal
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.pickerOption,
          userForm.role === 'admin' && styles.pickerOptionSelected,
        ]}
        onPress={() => {
          setUserForm({ ...userForm, role: 'admin' });
          setShowRolePicker(false);
        }}
      >
        <Text style={[
          styles.pickerOptionText,
          userForm.role === 'admin' && styles.pickerOptionTextSelected,
        ]}>
          Administrador
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.pickerCancel}
        onPress={() => setShowRolePicker(false)}
      >
        <Text style={styles.pickerCancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProductForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
      </Text>

      <Input
        label="Nombre del Producto"
        value={productForm.name}
        onChangeText={(text) => setProductForm({ ...productForm, name: text })}
        placeholder="Ingresa el nombre del producto"
      />

      <Input
        label="Precio"
        value={productForm.price}
        onChangeText={(text) => setProductForm({ ...productForm, price: text })}
        placeholder="0.00"
        keyboardType="numeric"
      />

      <Input
        label="URL de la Imagen"
        value={productForm.image}
        onChangeText={(text) => setProductForm({ ...productForm, image: text })}
        placeholder="https://ejemplo.com/imagen.jpg"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowCategoryPicker(true)}
      >
        <Text style={styles.pickerButtonLabel}>Categoría</Text>
        <Text style={styles.pickerButtonValue}>
          {categories.find(c => c.value === productForm.category)?.label}
        </Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.text} />
      </TouchableOpacity>

      <Input
        label="Descripción"
        value={productForm.description}
        onChangeText={(text) => setProductForm({ ...productForm, description: text })}
        placeholder="Describe el producto"
        multiline
        numberOfLines={3}
      />

      <View style={styles.switchContainer}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>En Stock</Text>
          <Switch
            value={productForm.inStock}
            onValueChange={(value) => setProductForm({ ...productForm, inStock: value })}
            trackColor={{ false: COLORS.background || '#f0f0f0', true: COLORS.primary }}
            thumbColor={productForm.inStock ? COLORS.primary : COLORS.text}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Producto Destacado</Text>
          <Switch
            value={productForm.featured}
            onValueChange={(value) => setProductForm({ ...productForm, featured: value })}
            trackColor={{ false: COLORS.surfaceVariant, true: COLORS.primary }}
            thumbColor={productForm.featured ? COLORS.text : COLORS.textSecondary}
          />
        </View>
      </View>

      <View style={styles.formButtons}>
        <Button
          title={editingProduct ? 'Actualizar' : 'Agregar'}
          onPress={handleProductSubmit}
          disabled={loading}
        />
        {editingProduct && (
          <Button
            title="Cancelar"
            onPress={resetProductForm}
            variant="outline"
          />
        )}
      </View>
    </View>
  );

  const renderUserForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Crear Nuevo Usuario</Text>

      <Input
        label="Nombre Completo"
        value={userForm.name}
        onChangeText={(text) => setUserForm({ ...userForm, name: text })}
        placeholder="Ingresa el nombre completo"
      />

      <Input
        label="Email"
        value={userForm.email}
        onChangeText={(text) => setUserForm({ ...userForm, email: text })}
        placeholder="email@ejemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        label="Contraseña"
        value={userForm.password}
        onChangeText={(text) => setUserForm({ ...userForm, password: text })}
        placeholder="Mínimo 6 caracteres"
        secureTextEntry
      />

      <Input
        label="Teléfono"
        value={userForm.phone}
        onChangeText={(text) => setUserForm({ ...userForm, phone: text })}
        placeholder="Número de teléfono"
        keyboardType="phone-pad"
      />

      <Input
        label="Dirección"
        value={userForm.address}
        onChangeText={(text) => setUserForm({ ...userForm, address: text })}
        placeholder="Dirección completa"
      />

      <View style={styles.rowInputs}>
        <Input
          label="País"
          value={userForm.country}
          onChangeText={(text) => setUserForm({ ...userForm, country: text })}
          placeholder="País"
          style={styles.halfInput}
        />
        <Input
          label="Ciudad"
          value={userForm.city}
          onChangeText={(text) => setUserForm({ ...userForm, city: text })}
          placeholder="Ciudad"
          style={styles.halfInput}
        />
      </View>

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowRolePicker(true)}
      >
        <Text style={styles.pickerButtonLabel}>Tipo de Usuario</Text>
        <Text style={styles.pickerButtonValue}>
          {userForm.role === 'admin' ? 'Administrador' : 'Usuario Normal'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.text} />
      </TouchableOpacity>

      <Button
        title="Crear Usuario"
        onPress={handleUserSubmit}
        disabled={loading}
      />
    </View>
  );

  const renderProductsList = () => (
    <View style={styles.productsContainer}>
      <Text style={styles.sectionTitle}>Productos Existentes</Text>
      {products.map((product) => (
        <View key={product.id} style={styles.productItem}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
            <Text style={styles.productCategory}>
              {categories.find(c => c.value === product.category)?.label}
            </Text>
          </View>
          <View style={styles.productActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditProduct(product)}
            >
              <Ionicons name="pencil" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteProduct(product.id)}
            >
              <Ionicons name="trash" size={20} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <LinearGradient colors={[COLORS.background, COLORS.surfaceVariant]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Panel de Administración</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'products' && styles.activeTab]}
          onPress={() => setActiveTab('products')}
        >
          <Ionicons 
            name="cube-outline" 
            size={20} 
            color={activeTab === 'products' ? COLORS.text : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
            Productos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Ionicons 
            name="people-outline" 
            size={20} 
            color={activeTab === 'users' ? COLORS.text : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            Usuarios
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'products' ? (
          <>
            {renderProductForm()}
            {renderProductsList()}
          </>
        ) : (
          renderUserForm()
        )}
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      {showCategoryPicker && renderCategoryPicker()}
      {showRolePicker && renderRolePicker()}

      {/* Botón Flotante para Agregar Producto */}
      <TouchableOpacity
        style={styles.floatingActionButton}
        onPress={handleGoToAddProduct}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={28} color={COLORS.text} />
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginHorizontal: 5,
    backgroundColor: COLORS.surface,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  activeTabText: {
    color: COLORS.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  pickerButtonLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    position: 'absolute',
    top: -8,
    left: 10,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 5,
  },
  pickerButtonValue: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    flex: 1,
  },
  switchContainer: {
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 10,
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 15,
  },
  productsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  productActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: COLORS.background,
  },
  deleteButton: {
    backgroundColor: COLORS.error + '20',
  },
  pickerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  pickerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 20,
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 10,
    textAlign: 'center',
    minWidth: 250,
  },
  pickerOption: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    minWidth: 250,
  },
  pickerOptionSelected: {
    backgroundColor: COLORS.primary,
  },
  pickerOptionText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    textAlign: 'center',
  },
  pickerOptionTextSelected: {
    color: COLORS.text,
  },
  pickerCancel: {
    backgroundColor: COLORS.surfaceVariant,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    minWidth: 250,
  },
  pickerCancelText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  floatingActionButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 1000,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
