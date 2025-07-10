import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProducts } from '../contexts/ProductsContext';
import { Product, RootStackParamList, CATEGORIES } from '../types';
import { COLORS, FONTS, SPACING } from '../config';
import ProductCard from '../components/ProductCard';
import Input from '../components/Input';

type CatalogScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const CatalogScreen: React.FC = () => {
  const navigation = useNavigation<CatalogScreenNavigationProp>();
  const { products } = useProducts();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');

  const filteredAndSortedProducts = getFilteredAndSortedProducts();

  function getFilteredAndSortedProducts(): Product[] {
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

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return filtered;
  }

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderCategoryItem = ({ item }: { item: typeof CATEGORIES[0] | { value: 'all'; label: 'Todos'; icon: '🏠' } }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.value && styles.categoryChipActive
      ]}
      onPress={() => setSelectedCategory(item.value)}
    >
      <Text style={styles.categoryChipIcon}>{item.icon}</Text>
      <Text style={[
        styles.categoryChipLabel,
        selectedCategory === item.value && styles.categoryChipLabelActive
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderSortOption = (value: typeof sortBy, label: string) => (
    <TouchableOpacity
      style={[
        styles.sortOption,
        sortBy === value && styles.sortOptionActive
      ]}
      onPress={() => setSortBy(value)}
    >
      <Text style={[
        styles.sortOptionText,
        sortBy === value && styles.sortOptionTextActive
      ]}>
        {label}
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
      <View style={styles.header}>
        <Text style={styles.title}>Catálogo</Text>
        <Text style={styles.subtitle}>Explora nuestra colección completa</Text>
      </View>

      {/* Búsqueda */}
      <View style={styles.searchSection}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar productos..."
          leftIcon={
            <Ionicons name="search-outline" size={20} color={COLORS.textMuted} />
          }
        />
      </View>

      {/* Filtros */}
      <View style={styles.filtersSection}>
        <Text style={styles.filterTitle}>Categorías</Text>
        <FlatList
          data={[{ value: 'all', label: 'Todos', icon: '🏠' }, ...CATEGORIES]}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.value}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />
      </View>

      {/* Ordenamiento */}
      <View style={styles.sortSection}>
        <Text style={styles.filterTitle}>Ordenar por</Text>
        <View style={styles.sortOptions}>
          {renderSortOption('name', 'Nombre')}
          {renderSortOption('price-low', 'Precio: Menor')}
          {renderSortOption('price-high', 'Precio: Mayor')}
        </View>
      </View>

      {/* Resultados */}
      <View style={styles.resultsSection}>
        <Text style={styles.resultsText}>
          {filteredAndSortedProducts.length} producto{filteredAndSortedProducts.length !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` en ${CATEGORIES.find(c => c.value === selectedCategory)?.label}`}
        </Text>
      </View>

      {/* Lista de productos */}
      {filteredAndSortedProducts.length > 0 ? (
        <FlatList
          data={filteredAndSortedProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.emptyStateTitle}>No se encontraron productos</Text>
          <Text style={styles.emptyStateSubtitle}>
            {searchQuery ? 
              'Intenta con otros términos de búsqueda' : 
              'No hay productos en esta categoría'
            }
          </Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.sizes['3xl'],
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  searchSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  filtersSection: {
    marginBottom: SPACING.lg,
  },
  filterTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  categoriesContainer: {
    paddingHorizontal: SPACING.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
  },
  categoryChipIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  categoryChipLabel: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  categoryChipLabelActive: {
    color: COLORS.text,
  },
  sortSection: {
    marginBottom: SPACING.lg,
  },
  sortOptions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
  },
  sortOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  sortOptionActive: {
    backgroundColor: COLORS.secondary,
  },
  sortOptionText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  sortOptionTextActive: {
    color: COLORS.text,
  },
  resultsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  resultsText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
  },
  productsList: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  productItem: {
    width: (width - (SPACING.lg * 2) - SPACING.sm) / 2,
    marginHorizontal: SPACING.xs,
    marginBottom: SPACING.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyStateTitle: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginTop: SPACING.lg,
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

export default CatalogScreen;
