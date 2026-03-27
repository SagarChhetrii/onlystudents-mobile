import React, { useState } from 'react';
import { View, TextInput as RNTextInput, StyleSheet, TextInputProps, Text } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function ModernTextInput({ label, error, icon, ...props }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container]}>
      <View
        style={[
          styles.inputWrapper,
          focused ? styles.inputWrapperFocused : undefined,
          error ? styles.inputWrapperError : undefined,
        ]}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <RNTextInput
          style={[
            styles.input,
            icon ? styles.inputWithIcon : undefined,
          ]}
          placeholderTextColor={Colors.textTertiary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
    gap: Spacing.sm,
  },
  inputWrapperFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  inputWrapperError: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    padding: 0,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    ...Typography.bodySmall,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});
