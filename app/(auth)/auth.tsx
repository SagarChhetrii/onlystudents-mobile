import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

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
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <LinearGradient colors={['#3730A3', '#4F46E5', '#7C3AED']} style={styles.header}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <View style={styles.logoRow}>
            <Text style={styles.logoEmoji}>🐝</Text>
            <Text style={styles.appName}>onlyStudents</Text>
          </View>
          <Text style={styles.headerTagline}>
            {mode === 'login' ? 'Welcome back! 👋' : 'Join 50,000+ students 🚀'}
          </Text>
        </LinearGradient>

        {/* Form Card */}
        <View style={styles.card}>
          {/* Toggle */}
          <View style={styles.toggle}>
            <TouchableOpacity
              onPress={() => setMode('login')}
              style={[styles.toggleBtn, mode === 'login' && styles.toggleActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleText, mode === 'login' && styles.toggleTextActive]}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('signup')}
              style={[styles.toggleBtn, mode === 'signup' && styles.toggleActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleText, mode === 'signup' && styles.toggleTextActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Fields */}
          {mode === 'signup' && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Aarav Singh"
                placeholderTextColor={Colors.subtext}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>College Email</Text>
            <TextInput
              style={styles.input}
              placeholder="yourname@iitd.ac.in"
              placeholderTextColor={Colors.subtext}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.subtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {mode === 'login' && (
            <TouchableOpacity style={styles.forgotRow} activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <PrimaryButton
            title={mode === 'login' ? 'Log In →' : 'Create Account →'}
            onPress={handleAuth}
            loading={loading}
            fullWidth
            size="lg"
            style={{ marginTop: 8, marginBottom: 20 }}
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
              <Text style={styles.socialIcon}>G</Text>
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8} onPress={handleAuth}>
              <Text style={styles.socialIcon}>in</Text>
              <Text style={styles.socialText}>LinkedIn</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footerNote}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <Text style={styles.footerLink} onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </Text>
          </Text>

          <Text style={styles.tos}>
            By continuing, you agree to our{' '}
            <Text style={{ color: Colors.primary }}>Terms of Service</Text> &{' '}
            <Text style={{ color: Colors.primary }}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1 },

  header: {
    paddingTop: 60, paddingBottom: 48,
    paddingHorizontal: 24, overflow: 'hidden',
  },
  circle1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)', top: -50, right: -50,
  },
  circle2: {
    position: 'absolute', width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.04)', bottom: -30, left: -30,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  logoEmoji: { fontSize: 28, marginRight: 8 },
  appName: { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerTagline: { fontSize: 26, fontWeight: '700', color: '#fff' },

  card: {
    margin: 16, marginTop: -24,
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },

  toggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 11,
    alignItems: 'center',
  },
  toggleActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  toggleText: { fontSize: 15, fontWeight: '600', color: Colors.subtext },
  toggleTextActive: { color: Colors.text },

  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  input: {
    height: 52, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 14, paddingHorizontal: 16, fontSize: 15,
    color: Colors.text, backgroundColor: '#FAFAFA',
  },

  forgotRow: { alignItems: 'flex-end', marginBottom: 8, marginTop: -8 },
  forgotText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },

  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { marginHorizontal: 12, color: Colors.subtext, fontSize: 13 },

  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  socialBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 14,
    paddingVertical: 13, gap: 8,
  },
  socialIcon: { fontSize: 16, fontWeight: '800', color: Colors.text },
  socialText: { fontSize: 14, fontWeight: '600', color: Colors.text },

  footerNote: { textAlign: 'center', color: Colors.subtext, fontSize: 14, marginBottom: 12 },
  footerLink: { color: Colors.primary, fontWeight: '700' },
  tos: { textAlign: 'center', color: Colors.subtext, fontSize: 11, lineHeight: 17 },
});
