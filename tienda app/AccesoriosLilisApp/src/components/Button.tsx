import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../config';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
}) => {
  const getButtonStyles = () => {
    const baseStyles = [styles.button];

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyles.push(styles.primaryButton);
        break;
      case 'secondary':
        baseStyles.push(styles.secondaryButton);
        break;
      case 'outline':
        baseStyles.push(styles.outlineButton);
        break;
      case 'ghost':
        baseStyles.push(styles.ghostButton);
        break;
    }

    // Size styles
    switch (size) {
      case 'small':
        baseStyles.push(styles.smallButton);
        break;
      case 'medium':
        baseStyles.push(styles.mediumButton);
        break;
      case 'large':
        baseStyles.push(styles.largeButton);
        break;
    }

    // State styles
    if (disabled) {
      baseStyles.push(styles.disabledButton);
    }

    if (fullWidth) {
      baseStyles.push(styles.fullWidthButton);
    }

    return baseStyles;
  };

  const getTextStyles = () => {
    const baseStyles = [styles.buttonText];

    switch (variant) {
      case 'primary':
        baseStyles.push(styles.primaryButtonText);
        break;
      case 'secondary':
        baseStyles.push(styles.secondaryButtonText);
        break;
      case 'outline':
        baseStyles.push(styles.outlineButtonText);
        break;
      case 'ghost':
        baseStyles.push(styles.ghostButtonText);
        break;
    }

    switch (size) {
      case 'small':
        baseStyles.push(styles.smallButtonText);
        break;
      case 'medium':
        baseStyles.push(styles.mediumButtonText);
        break;
      case 'large':
        baseStyles.push(styles.largeButtonText);
        break;
    }

    if (disabled) {
      baseStyles.push(styles.disabledButtonText);
    }

    return baseStyles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? COLORS.text : COLORS.primary} 
        />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={getTextStyles()}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: SPACING.sm,
  },
  buttonText: {
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },
  // Variant styles
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  // Size styles
  smallButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    minHeight: 32,
  },
  mediumButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 44,
  },
  largeButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 52,
  },
  // Text styles
  primaryButtonText: {
    color: COLORS.text,
  },
  secondaryButtonText: {
    color: COLORS.text,
  },
  outlineButtonText: {
    color: COLORS.primary,
  },
  ghostButtonText: {
    color: COLORS.primary,
  },
  smallButtonText: {
    fontSize: FONTS.sizes.sm,
  },
  mediumButtonText: {
    fontSize: FONTS.sizes.md,
  },
  largeButtonText: {
    fontSize: FONTS.sizes.lg,
  },
  // State styles
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: COLORS.textMuted,
  },
  fullWidthButton: {
    width: '100%',
  },
});

export default Button;
