import { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, spacing } from '../theme';

export default function StatusCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: spacing.base,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 6,
  },
  subtitle: {
    color: palette.muted,
    marginBottom: 12,
    fontSize: 14,
  },
});
