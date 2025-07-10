import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../config';
import Button from './Button';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  showAddToCart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  showAddToCart = true,
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        {/* Badge de featured */}
        {product.featured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={12} color={COLORS.text} />
            <Text style={styles.featuredText}>Destacado</Text>
          </View>
        )}

        {/* Imagen del producto */}
        <Image source={{ uri: product.image }} style={styles.image} />

        {/* Información del producto */}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              {!product.inStock && (
                <Text style={styles.outOfStock}>Agotado</Text>
              )}
            </View>

            {showAddToCart && product.inStock && (
              <Button
                title="Agregar"
                onPress={handleAddToCart}
                size="small"
                icon={<Ionicons name="add" size={16} color={COLORS.text} />}
              />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  featuredBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  featuredText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginLeft: 2,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.surfaceVariant,
  },
  content: {
    padding: SPACING.md,
  },
  name: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  outOfStock: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    marginTop: 2,
  },
});

export default ProductCard;
