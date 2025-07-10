import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, FONTS, SPACING } from '../config';
import Input from '../components/Input';
import Button from '../components/Button';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { login } = useAuth();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const success = await login(email.trim(), password);
      if (success) {
        // La navegación se maneja automáticamente por el contexto de auth
      } else {
        Alert.alert(
          'Error de autenticación',
          'Email o contraseña incorrectos. Por favor, verifica tus credenciales.'
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <LinearGradient
      colors={COLORS.backgroundGradient}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>💎</Text>
              </View>
              <Text style={styles.title}>Bienvenido</Text>
              <Text style={styles.subtitle}>
                Inicia sesión para acceder a tu cuenta
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="ejemplo@correo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
                leftIcon={
                  <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />
                }
              />

              <Input
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                placeholder="Tu contraseña"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                error={errors.password}
                leftIcon={
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
                }
                rightIcon={
                  <Button
                    title=""
                    onPress={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="small"
                    icon={
                      <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color={COLORS.textMuted} 
                      />
                    }
                  />
                }
              />

              <Button
                title="Iniciar Sesión"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                variant="primary"
                size="large"
                fullWidth
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                ¿No tienes una cuenta?{' '}
              </Text>
              <Button
                title="Regístrate aquí"
                onPress={handleGoToRegister}
                variant="ghost"
                size="small"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  logoText: {
    fontSize: 30,
  },
  title: {
    fontSize: FONTS.sizes['3xl'],
    fontFamily: FONTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footerText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
});

export default LoginScreen;
