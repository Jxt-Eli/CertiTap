import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { palette, radius, shadow, spacing, typography } from '../theme';

type BadgeType = 'success' | 'error' | 'neutral';

type Props = {
  title: string;
  subtitle?: string;
  badge?: { label: string; type: BadgeType };
  children?: ReactNode;
};

export default function StatusCard({ title, subtitle, badge, children }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {badge ? (
          <View style={[styles.badge, badgeBg[badge.type]]}>
            <Text style={[styles.badgeText, badgeColor[badge.type]]}>
              {badge.label}
            </Text>
          </View>
        ) : null}
      </View>
      {children ? (
        <View style={styles.body}>{children}</View>
      ) : null}
    </View>
  );
}

const badgeBg: Record<BadgeType, object> = {
  success: { backgroundColor: '#D4F4E8' },
  error: { backgroundColor: '#FCE8E8' },
  neutral: { backgroundColor: palette.primaryDim },
};

const badgeColor: Record<BadgeType, object> = {
  success: { color: palette.success },
  error: { color: palette.error },
  neutral: { color: palette.primary },
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.large,
    padding: spacing.medium,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleArea: { flex: 1, marginRight: spacing.small },
  title: { ...typography.heading2, color: palette.text },
  subtitle: { ...typography.caption, color: palette.muted, marginTop: 3 },
  body: {
    marginTop: spacing.base,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingTop: spacing.base,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.round,
    alignSelf: 'flex-start',
  },
  badgeText: { ...typography.label },
});
