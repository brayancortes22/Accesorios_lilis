import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  TouchableOpacity,
  Dimensions,
  RefreshControl 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProducts } from '../contexts/ProductsContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Product, RootStackParamList, CATEGORIES } from '../types';
import { COLORS, FONTS, SPACING, APP_CONFIG } from '../config';
import ProductCard from '../components/ProductCard';
import Input from '../components/Input';
import Button from '../components/Button';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { products, isLoading } = useProducts();
  const { user, isAdmin } = useAuth();
  const { getTotalItems } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const featuredProducts = products.filter(p => p.featured);
  const filteredProducts = getFilteredProducts();

  function getFilteredProducts(): Product[] {
    let filtered = products;

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleAdminPress = () => {
    navigation.navigate('Admin');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Aquí podrías recargar los productos
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderCategoryItem = ({ item }: { item: typeof CATEGORIES[0] | { value: 'all'; label: 'Todos'; icon: '🏠' } }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.value && styles.categoryItemActive
      ]}
      onPress={() => setSelectedCategory(item.value)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[
        styles.categoryLabel,
        selectedCategory === item.value && styles.categoryLabelActive
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <ProductCard
        product={item}
        onPress={() => handleProductPress(item)}
      />
    </View>
  );

  return (
    <LinearGradient colors={COLORS.backgroundGradient} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>
                ¡Hola, {user?.name?.split(' ')[0] || 'Usuario'}! 👋
              </Text>
              <Text style={styles.welcome}>Bienvenido a {APP_CONFIG.NAME}</Text>
            </View>
            
            <View style={styles.headerActions}>
              {isAdmin && (
                <TouchableOpacity
                  style={styles.adminButton}
                  onPress={handleAdminPress}
                >
                  <Ionicons name="settings" size={24} color={COLORS.text} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Input
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar productos..."
              leftIcon={
                <Ionicons name="search-outline" size={20} color={COLORS.textMuted} />
              }
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <FlatList
            data={[{ value: 'all', label: 'Todos', icon: '🏠' }, ...CATEGORIES]}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.value}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Productos Destacados</Text>
            <FlatList
              data={featuredProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
          </View>
        )}

        {/* All Products */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'Todos los Productos' : 
             CATEGORIES.find(c => c.value === selectedCategory)?.label || 'Productos'}
          </Text>
          
          {filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.productsList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyStateTitle}>No se encontraron productos</Text>
              <Text style={styles.emptyStateSubtitle}>
                {searchQuery ? 
                  'Intenta con otros términos de búsqueda' : 
                  'No hay productos en esta categoría'
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  welcome: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    marginTop: SPACING.md,
  },
  categoriesSection: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  categoriesList: {
    paddingHorizontal: SPACING.lg,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: SPACING.lg,
    backgroundColor: COLORS.surface,
    minWidth: 80,
  },
  categoryItemActive: {
    backgroundColor: COLORS.primary,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: COLORS.text,
  },
  featuredSection: {
    marginTop: SPACING.xl,
  },
  featuredList: {
    paddingHorizontal: SPACING.lg,
  },
  productsSection: {
    marginTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  productsList: {
    paddingHorizontal: SPACING.md,
  },
  productItem: {
    width: (width - (SPACING.lg * 2) - SPACING.sm) / 2,
    marginHorizontal: SPACING.xs,
    marginBottom: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING['2xl'],
    paddingHorizontal: SPACING.lg,
  },
  emptyStateTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HomeScreen;
