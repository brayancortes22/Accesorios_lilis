import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, CATEGORIES } from '../types';
import { useCart } from '../contexts/CartContext';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../config';
import Button from '../components/Button';

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;

interface Props {
  route: ProductDetailScreenRouteProp;
  navigation: ProductDetailScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart, items } = useCart();
  const [quantity, setQuantity] = useState(1);

  const categoryInfo = CATEGORIES.find(c => c.value === product.category);
  const isInCart = items.some(item => item.product.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Alert.alert(
      '¡Agregado al carrito!',
      `${product.name} se agregó a tu carrito.`,
      [
        { text: 'Continuar comprando', style: 'cancel' },
        { text: 'Ver carrito', onPress: () => navigation.navigate('MainTabs', { screen: 'Cart' }) },
      ]
    );
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <LinearGradient colors={COLORS.backgroundGradient} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          {product.featured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={16} color={COLORS.text} />
              <Text style={styles.featuredText}>Destacado</Text>
            </View>
          )}
          {!product.inStock && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Agotado</Text>
            </View>
          )}
        </View>

        {/* Product Information */}
        <View style={styles.contentContainer}>
          {/* Category */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryIcon}>{categoryInfo?.icon}</Text>
            <Text style={styles.categoryText}>{categoryInfo?.label}</Text>
          </View>

          {/* Name and Price */}
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>

          {/* Stock Status */}
          <View style={styles.stockContainer}>
            <Ionicons 
              name={product.inStock ? "checkmark-circle" : "close-circle"} 
              size={20} 
              color={product.inStock ? COLORS.success : COLORS.error} 
            />
            <Text style={[
              styles.stockText, 
              { color: product.inStock ? COLORS.success : COLORS.error }
            ]}>
              {product.inStock ? 'En stock' : 'Agotado'}
            </Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>Características</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
                <Text style={styles.featureText}>Garantía de calidad</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="car-outline" size={20} color={COLORS.primary} />
                <Text style={styles.featureText}>Envío gratis</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="refresh-outline" size={20} color={COLORS.primary} />
                <Text style={styles.featureText}>30 días de devolución</Text>
              </View>
            </View>
          </View>

          {/* Quantity Selector */}
          {product.inStock && (
            <View style={styles.quantityContainer}>
              <Text style={styles.sectionTitle}>Cantidad</Text>
              <View style={styles.quantitySelector}>
                <Button
                  title=""
                  onPress={() => handleQuantityChange(-1)}
                  variant="outline"
                  size="small"
                  disabled={quantity <= 1}
                  icon={<Ionicons name="remove" size={16} color={COLORS.primary} />}
                />
                <Text style={styles.quantityText}>{quantity}</Text>
                <Button
                  title=""
                  onPress={() => handleQuantityChange(1)}
                  variant="outline"
                  size="small"
                  disabled={quantity >= 10}
                  icon={<Ionicons name="add" size={16} color={COLORS.primary} />}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      {product.inStock && (
        <View style={styles.bottomContainer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalPrice}>
              ${(product.price * quantity).toFixed(2)}
            </Text>
          </View>
          
          <Button
            title={isInCart ? "Agregar más" : "Agregar al carrito"}
            onPress={handleAddToCart}
            variant="primary"
            size="large"
            fullWidth
            icon={<Ionicons name="bag-add-outline" size={20} color={COLORS.text} />}
          />
        </View>
      )}
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
  imageContainer: {
    position: 'relative',
    backgroundColor: COLORS.surface,
  },
  productImage: {
    width: width,
    height: width,
    backgroundColor: COLORS.surfaceVariant,
  },
  featuredBadge: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: SPACING.lg,
    left: SPACING.lg,
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  outOfStockText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  categoryText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  productName: {
    fontSize: FONTS.sizes['2xl'],
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    lineHeight: 32,
  },
  productPrice: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  stockText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.medium,
    marginLeft: SPACING.sm,
  },
  descriptionContainer: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  featuresContainer: {
    marginBottom: SPACING.lg,
  },
  featuresList: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  featureText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  quantityContainer: {
    marginBottom: SPACING.lg,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  quantityText: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginHorizontal: SPACING.lg,
    minWidth: 40,
    textAlign: 'center',
  },
  bottomContainer: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  totalLabel: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  totalPrice: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
});

export default ProductDetailScreen;
