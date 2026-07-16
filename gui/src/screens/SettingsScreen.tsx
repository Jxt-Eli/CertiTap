import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import AppButton from '../components/AppButton';
import FetchRegistryModal from '../components/FetchRegistryModal';
import { resetRegistry } from '../services/api';
import { palette, radius, shadow, spacing, typography } from '../theme';

export default function SettingsScreen() {
  const [fetchModalVisible, setFetchModalVisible] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = () => {
    Alert.alert(
      'Clear Registry',
      'This removes all student records imported from the school database. Attendance records are not affected. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setResetting(true);
            const result = await resetRegistry();
            setResetting(false);
            Alert.alert(result.success ? 'Done' : 'Failed', result.message);
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text style={styles.eyebrow}> </Text>
        <Text style={styles.title}>Registry</Text>
      </View>

      {/* Import section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>School Database</Text>
        <Text style={styles.cardDesc}>
          Pull a range of student records from the school's system into the local registry.
          You'll need a start index and the number of records to import.
        </Text>
        <AppButton
          label="Pull Student Records"
          onPress={() => setFetchModalVisible(true)}
        />
      </View>

      {/* Reset section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Clear Pulled Records</Text>
        <Text style={styles.cardDesc}>
          Remove all records imported from the school database. Use this to start a fresh import.
          Attendance records in the elements table are not affected.
        </Text>
        <AppButton
          label="Clear Registry"
          onPress={handleReset}
          variant="danger"
          loading={resetting}
          disabled={resetting}
        />
      </View>

      {/* Connection info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Backend Connection</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Host</Text>
          <Text style={styles.infoVal}>10.0.0.166:8080</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Base path</Text>
          <Text style={styles.infoVal}>/api/elements</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Database</Text>
          <Text style={styles.infoVal}>PostgreSQL · 5432</Text>
        </View>
      </View>

      <FetchRegistryModal
        visible={fetchModalVisible}
        onClose={() => setFetchModalVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.large },
  eyebrow: {
    ...typography.label,
    color: palette.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  title: { ...typography.heading1, color: palette.text },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.large,
    padding: spacing.medium,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 12,
    ...shadow.card,
  },
  cardTitle: { ...typography.heading3, color: palette.text },
  cardDesc: {
    ...typography.caption,
    color: palette.muted,
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: palette.surfaceAlt,
    borderRadius: radius.base,
    padding: spacing.base,
    marginTop: spacing.small,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 10,
  },
  infoTitle: {
    ...typography.label,
    color: palette.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoKey: { ...typography.caption, color: palette.muted },
  infoVal: {
    ...typography.caption,
    color: palette.textSecondary,
    fontFamily: 'monospace',
  },
});
