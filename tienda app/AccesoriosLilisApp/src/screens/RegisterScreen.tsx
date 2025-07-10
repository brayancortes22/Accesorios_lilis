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

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  country: string;
  city: string;
}

interface FormErrors {
  [key: string]: string;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    country: '',
    city: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { register } = useAuth();

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'El país es requerido';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const success = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        country: formData.country.trim(),
        city: formData.city.trim(),
      });

      if (success) {
        Alert.alert(
          'Registro exitoso',
          'Tu cuenta ha sido creada correctamente',
          [{ text: 'OK' }]
        );
        // La navegación se maneja automáticamente por el contexto de auth
      } else {
        Alert.alert(
          'Error en el registro',
          'No se pudo crear la cuenta. Por favor, verifica que el email no esté en uso.'
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

  const handleGoToLogin = () => {
    navigation.navigate('Login');
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
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Crear Cuenta</Text>
              <Text style={styles.subtitle}>
                Completa la información para registrarte
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Input
                label="Nombre completo"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                placeholder="Tu nombre completo"
                autoCapitalize="words"
                error={errors.name}
                leftIcon={
                  <Ionicons name="person-outline" size={20} color={COLORS.textMuted} />
                }
              />

              <Input
                label="Email"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
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
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
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

              <Input
                label="Confirmar contraseña"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                placeholder="Confirma tu contraseña"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                error={errors.confirmPassword}
                leftIcon={
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
                }
                rightIcon={
                  <Button
                    title=""
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    variant="ghost"
                    size="small"
                    icon={
                      <Ionicons 
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color={COLORS.textMuted} 
                      />
                    }
                  />
                }
              />

              <Input
                label="Teléfono"
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                placeholder="Tu número de teléfono"
                keyboardType="phone-pad"
                error={errors.phone}
                leftIcon={
                  <Ionicons name="call-outline" size={20} color={COLORS.textMuted} />
                }
              />

              <Input
                label="Dirección"
                value={formData.address}
                onChangeText={(value) => updateFormData('address', value)}
                placeholder="Tu dirección completa"
                error={errors.address}
                leftIcon={
                  <Ionicons name="home-outline" size={20} color={COLORS.textMuted} />
                }
              />

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Input
                    label="País"
                    value={formData.country}
                    onChangeText={(value) => updateFormData('country', value)}
                    placeholder="País"
                    error={errors.country}
                    leftIcon={
                      <Ionicons name="flag-outline" size={20} color={COLORS.textMuted} />
                    }
                  />
                </View>

                <View style={styles.halfWidth}>
                  <Input
                    label="Ciudad"
                    value={formData.city}
                    onChangeText={(value) => updateFormData('city', value)}
                    placeholder="Ciudad"
                    error={errors.city}
                    leftIcon={
                      <Ionicons name="location-outline" size={20} color={COLORS.textMuted} />
                    }
                  />
                </View>
              </View>

              <Button
                title="Registrarse"
                onPress={handleRegister}
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
                ¿Ya tienes una cuenta?{' '}
              </Text>
              <Button
                title="Inicia sesión aquí"
                onPress={handleGoToLogin}
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
    paddingVertical: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -SPACING.xs,
  },
  halfWidth: {
    flex: 1,
    marginHorizontal: SPACING.xs,
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

export default RegisterScreen;
