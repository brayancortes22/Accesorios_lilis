import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { CartItem } from '../types';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../config';
import Button from '../components/Button';

const CartScreen: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    Alert.alert(
      'Eliminar producto',
      '¿Estás seguro de que quieres eliminar este producto del carrito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => removeFromCart(productId) },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Vaciar carrito',
      '¿Estás seguro de que quieres vaciar todo el carrito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Vaciar', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      'Proceder al pago',
      `Total a pagar: $${getTotalPrice().toFixed(2)}\n\nEsta función estará disponible próximamente.`,
      [{ text: 'OK' }]
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.image }} style={styles.productImage} />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.productPrice}>
          ${item.product.price.toFixed(2)}
        </Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.product.id, item.quantity - 1)}
          >
            <Ionicons name="remove" size={16} color={COLORS.text} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.product.id, item.quantity + 1)}
          >
            <Ionicons name="add" size={16} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.itemActions}>
        <Text style={styles.itemTotal}>
          ${(item.product.price * item.quantity).toFixed(2)}
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.product.id)}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyCart}>
      <Ionicons name="bag-outline" size={80} color={COLORS.textMuted} />
      <Text style={styles.emptyCartTitle}>Tu carrito está vacío</Text>
      <Text style={styles.emptyCartSubtitle}>
        Agrega algunos productos para continuar con la compra
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={COLORS.backgroundGradient} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Carrito</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearButton}>Vaciar</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.product.id}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          {/* Cart Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Total de artículos:
              </Text>
              <Text style={styles.summaryValue}>
                {getTotalItems()}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Subtotal:
              </Text>
              <Text style={styles.summaryValue}>
                ${getTotalPrice().toFixed(2)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>
                Total:
              </Text>
              <Text style={styles.totalValue}>
                ${getTotalPrice().toFixed(2)}
              </Text>
            </View>

            <Button
              title="Proceder al Pago"
              onPress={handleCheckout}
              variant="primary"
              size="large"
              fullWidth
              icon={<Ionicons name="card-outline" size={20} color={COLORS.text} />}
            />
          </View>
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes['3xl'],
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  clearButton: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.medium,
    color: COLORS.error,
  },
  cartList: {
    paddingHorizontal: SPACING.lg,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceVariant,
  },
  productInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  productPrice: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginHorizontal: SPACING.md,
    minWidth: 24,
    textAlign: 'center',
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemTotal: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  removeButton: {
    padding: SPACING.sm,
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyCartTitle: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  emptyCartSubtitle: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  summary: {
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  totalLabel: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  totalValue: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
});

export default CartScreen;
