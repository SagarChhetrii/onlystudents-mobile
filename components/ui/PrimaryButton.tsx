import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Typography, Spacing } from '@/constants/theme';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  fullWidth?: boolean;
}

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  style,
  fullWidth = false,
}: Props) {
  const sizeStyles = {
    sm: { paddingVertical: 8,  paddingHorizontal: 16, fontSize: 13 },
    md: { paddingVertical: 13, paddingHorizontal: 24, fontSize: 15 },
    lg: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 16 },
  };

  const s = sizeStyles[size];

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[fullWidth && styles.fullWidth, style]}
      >
        <LinearGradient
          colors={disabled ? ['#9CA3AF', '#9CA3AF'] : ['#4F46E5', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradientBtn, { paddingVertical: s.paddingVertical, paddingHorizontal: s.paddingHorizontal }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={[styles.gradientText, { fontSize: s.fontSize }]}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          styles.outlineBtn,
          { paddingVertical: s.paddingVertical, paddingHorizontal: s.paddingHorizontal },
          fullWidth && styles.fullWidth,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={Colors.primary} size="small" />
        ) : (
          <Text style={[styles.outlineText, { fontSize: s.fontSize }]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'ghost') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        style={[fullWidth && styles.fullWidth, style]}
      >
        <Text style={[styles.ghostText, { fontSize: s.fontSize, paddingVertical: s.paddingVertical }]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  // Secondary
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.secondaryBtn,
        { paddingVertical: s.paddingVertical, paddingHorizontal: s.paddingHorizontal },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={[styles.gradientText, { fontSize: s.fontSize }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fullWidth: { width: '100%' },
  gradientBtn: {
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  outlineBtn: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  ghostText: {
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryBtn: {
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
