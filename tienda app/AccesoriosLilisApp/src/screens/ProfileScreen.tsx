import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, APP_CONFIG } from '../config';
import { MainTabParamList } from '../types';
import Button from '../components/Button';

type ProfileScreenProps = NativeStackScreenProps<MainTabParamList, 'Profile'>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout, isAdmin } = useAuth();
  const { items, getTotalItems, getTotalPrice } = useCart();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert(
      'Editar Perfil',
      'Esta función estará disponible próximamente.',
      [{ text: 'OK' }]
    );
  };

  const handleNavigateToAdmin = () => {
    // @ts-ignore - navegación fuera del tabs
    navigation.getParent()?.navigate('Admin');
  };

  const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.infoCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );

  const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon as any} size={20} color={COLORS.primary} />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  if (!user) {
    return (
      <LinearGradient colors={COLORS.backgroundGradient} style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="person-outline" size={80} color={COLORS.textMuted} />
          <Text style={styles.emptyStateTitle}>No hay sesión activa</Text>
          <Text style={styles.emptyStateSubtitle}>
            Inicia sesión para ver tu perfil
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={COLORS.backgroundGradient} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            {isAdmin && (
              <View style={styles.adminBadge}>
                <Ionicons name="shield-checkmark" size={16} color={COLORS.text} />
                <Text style={styles.adminBadgeText}>Administrador</Text>
              </View>
            )}
          </View>

          <Button
            title="Editar Perfil"
            onPress={handleEditProfile}
            variant="outline"
            size="small"
            icon={<Ionicons name="create-outline" size={16} color={COLORS.primary} />}
          />
        </View>

        {/* Personal Information */}
        <InfoCard title="Información Personal">
          <InfoRow icon="person-outline" label="Nombre completo" value={user.name} />
          <InfoRow icon="mail-outline" label="Email" value={user.email} />
          <InfoRow icon="call-outline" label="Teléfono" value={user.phone || 'No especificado'} />
        </InfoCard>

        {/* Address Information */}
        <InfoCard title="Información de Dirección">
          <InfoRow icon="home-outline" label="Dirección" value={user.address || 'No especificada'} />
          <InfoRow icon="location-outline" label="Ciudad" value={user.city || 'No especificada'} />
          <InfoRow icon="flag-outline" label="País" value={user.country || 'No especificado'} />
        </InfoCard>

        {/* Shopping Summary */}
        {items.length > 0 && (
          <InfoCard title="Resumen de Compra">
            <InfoRow 
              icon="bag-outline" 
              label="Productos en carrito" 
              value={`${getTotalItems()} artículo${getTotalItems() !== 1 ? 's' : ''}`} 
            />
            <InfoRow 
              icon="card-outline" 
              label="Total a pagar" 
              value={`$${getTotalPrice().toFixed(2)}`} 
            />
          </InfoCard>
        )}

        {/* Account Information */}
        <InfoCard title="Información de Cuenta">
          <InfoRow 
            icon="calendar-outline" 
            label="Miembro desde" 
            value={new Date(user.createdAt).toLocaleDateString('es-ES')} 
          />
          <InfoRow 
            icon="shield-outline" 
            label="Tipo de cuenta" 
            value={user.role === 'admin' ? 'Administrador' : 'Usuario'} 
          />
        </InfoCard>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          {/* Botón de Administración - solo para admins */}
          {isAdmin && (
            <TouchableOpacity style={styles.actionItem} onPress={handleNavigateToAdmin}>
              <View style={styles.actionIcon}>
                <Ionicons name="settings" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Panel de Administración</Text>
                <Text style={styles.actionSubtitle}>Gestionar productos y usuarios</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Ionicons name="heart-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Mis Favoritos</Text>
              <Text style={styles.actionSubtitle}>Ver productos guardados</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Ionicons name="receipt-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Historial de Pedidos</Text>
              <Text style={styles.actionSubtitle}>Ver compras anteriores</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Configuración</Text>
              <Text style={styles.actionSubtitle}>Preferencias de la aplicación</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Ionicons name="help-circle-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Ayuda y Soporte</Text>
              <Text style={styles.actionSubtitle}>Contactar con nosotros</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* App Information */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>
            {APP_CONFIG.NAME} v{APP_CONFIG.VERSION}
          </Text>
          <Text style={styles.appInfoText}>
            © {new Date().getFullYear()} {APP_CONFIG.COMPANY}
          </Text>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="outline"
            size="large"
            fullWidth
            icon={<Ionicons name="log-out-outline" size={20} color={COLORS.error} />}
          />
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
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: FONTS.sizes['2xl'],
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  userName: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
  },
  adminBadgeText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    padding: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  cardContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  actionsSection: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  actionSubtitle: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  appInfo: {
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  appInfoText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  logoutSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
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

export default ProfileScreen;
