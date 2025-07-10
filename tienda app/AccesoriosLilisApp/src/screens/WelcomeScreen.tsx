import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, FONTS, SPACING, APP_CONFIG } from '../config';
import Button from '../components/Button';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <LinearGradient
      colors={COLORS.backgroundGradient}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo y título */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>💎</Text>
          </View>
          <Text style={styles.title}>{APP_CONFIG.NAME}</Text>
          <Text style={styles.subtitle}>{APP_CONFIG.DESCRIPTION}</Text>
        </View>

        {/* Imagen ilustrativa */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ 
              uri: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' 
            }}
            style={styles.image}
          />
        </View>

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <Button
            title="Iniciar Sesión"
            onPress={handleLogin}
            variant="primary"
            size="large"
            fullWidth
          />
          
          <View style={styles.buttonSpacing} />
          
          <Button
            title="Registrarse"
            onPress={handleRegister}
            variant="outline"
            size="large"
            fullWidth
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Descubre los accesorios más elegantes
          </Text>
          <Text style={styles.companyText}>
            © {new Date().getFullYear()} {APP_CONFIG.COMPANY}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: FONTS.sizes['4xl'],
    fontFamily: FONTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonContainer: {
    marginBottom: SPACING.xl,
  },
  buttonSpacing: {
    height: SPACING.md,
  },
  footer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  footerText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  companyText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});

export default WelcomeScreen;
