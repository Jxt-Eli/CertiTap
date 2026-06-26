import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { palette, spacing } from '../theme';

export default function AppButton({
  label,
  onPress,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
}) {
  const style = variant === 'ghost' ? styles.ghostButton : styles.button;
  const textStyle = variant === 'ghost' ? styles.ghostText : styles.text;

  return (
    <Pressable style={[styles.base, style]} onPress={onPress}>
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
    paddingHorizontal: spacing.base,
  },
  button: {
    backgroundColor: palette.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: palette.primary,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ghostText: {
    color: palette.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
