import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import ModernButton from '@/components/ui/ModernButton';
import ModernTextInput from '@/components/ui/ModernTextInput';

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBg}>
              <MaterialCommunityIcons name="book-open-page-variant" size={32} color={Colors.white} />
            </View>
            <Text style={styles.appName}>onlyStudent</Text>
          </View>
          <Text style={styles.tagline}>
            {mode === 'login'
              ? 'Welcome back'
              : 'Join thousands of students'}
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          {/* Toggle */}
          <View style={styles.toggle}>
            <TouchableOpacity
              onPress={() => setMode('login')}
              style={[styles.toggleBtn, mode === 'login' && styles.toggleBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleText, mode === 'login' && styles.toggleTextActive]}>
                Log In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('signup')}
              style={[styles.toggleBtn, mode === 'signup' && styles.toggleBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleText, mode === 'signup' && styles.toggleTextActive]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Fields */}
          {mode === 'signup' && (
            <ModernTextInput
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              icon={<MaterialCommunityIcons name="account" size={20} color={Colors.textTertiary} />}
              error={errors.name}
              style={styles.input}
            />
          )}

          <ModernTextInput
            placeholder="College Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<MaterialCommunityIcons name="email" size={20} color={Colors.textTertiary} />}
            error={errors.email}
            style={styles.input}
          />

          <ModernTextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<MaterialCommunityIcons name="lock" size={20} color={Colors.textTertiary} />}
            error={errors.password}
            style={styles.input}
          />

          {mode === 'login' && (
            <TouchableOpacity style={styles.forgotRow} activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <ModernButton
            label={loading ? 'Loading...' : mode === 'login' ? 'Log In' : 'Create Account'}
            variant="primary"
            size="lg"
            onPress={handleAuth}
            loading={loading}
            disabled={loading}
            fullWidth
            style={styles.button}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8} onPress={handleAuth}>
              <MaterialCommunityIcons name="google" size={20} color={Colors.text} />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8} onPress={handleAuth}>
              <MaterialCommunityIcons name="linkedin" size={20} color={Colors.text} />
              <Text style={styles.socialText}>LinkedIn</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footerNote}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <Text
              style={styles.footerLink}
              onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </Text>
          </Text>

          <Text style={styles.tos}>
            By continuing, you agree to our{' '}
            <Text style={{ color: Colors.primary, fontWeight: '600' }}>Terms of Service</Text> and{' '}
            <Text style={{ color: Colors.primary, fontWeight: '600' }}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    flexGrow: 1,
  },

  /* Header */
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.base,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoBg: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  appName: {
    ...Typography.h2,
    color: Colors.text,
  },
  tagline: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  /* Card */
  card: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  /* Toggle */
  toggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  toggleText: {
    ...Typography.h4,
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: Colors.primary,
  },

  /* Inputs */
  input: {
    marginBottom: Spacing.md,
  },

  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
    marginTop: -Spacing.sm,
  },
  forgotText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },

  /* Button */
  button: {
    marginVertical: Spacing.md,
  },

  /* Divider */
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },

  /* Social Buttons */
  socialRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  socialText: {
    ...Typography.h4,
    color: Colors.text,
  },

  /* Footer */
  footerNote: {
    textAlign: 'center',
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  footerLink: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tos: {
    textAlign: 'center',
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
});
