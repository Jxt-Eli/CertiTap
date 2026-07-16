import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import { useFocusEffect, Platform } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import StatusCard from '../components/StatusCard';
import TextInputField from '../components/TextInputField';
import AppButton from '../components/AppButton';
import { fetchMissingStudents, manualCheckIn } from '../services/api';
import { palette, spacing, typography } from '../theme';

export default function MissingScreen() {
  const [list, setList] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [manualIndex, setManualIndex] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    const data = await fetchMissingStudents();
    setList(data);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleManualCheckIn = async () => {
    if (!manualIndex.trim()) {
      Alert.alert('Index required', 'Enter a student index number first.');
      return;
    }
    setCheckingIn(true);
    const result = await manualCheckIn(manualIndex.trim());
    setCheckingIn(false);
    if (result.success) {
      Alert.alert('Marked Present', result.message);
      setManualIndex('');
      load();
    } else {
      Alert.alert('Failed', result.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScreenContainer>
        <View style={styles.header}>
          <Text style={styles.eyebrow}> </Text>
          <Text style={styles.title}>Absent Students</Text>
          {list.length > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{list.length} not checked in</Text>
            </View>
          ) : null}
        </View>

        <FlatList
          data={list}
          keyExtractor={(item, i) => `${item}-${i}`}
          style={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={load}
              tintColor={palette.primary}
              colors={[palette.primary]}
            />
          }
          renderItem={({ item }) => (
            <StatusCard
              title={item}
              badge={{ label: 'Absent', type: 'error' }}
            />
          )}
          ListEmptyComponent={
            !refreshing ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyIcon}>✓</Text>
                <Text style={styles.emptyTitle}>All present</Text>
                <Text style={styles.emptyBody}>
                  No unchecked students at the moment. Pull down to refresh.
                </Text>
              </View>
            ) : null
          }
          contentContainerStyle={
            list.length === 0 ? styles.emptyContainer : styles.listContent
          }
        />

        <View style={styles.manualWrap}>
          <Text style={styles.manualLabel}>Manual Override</Text>
          <TextInputField
            label="Student Index Number"
            value={manualIndex}
            onChangeText={setManualIndex}
            placeholder="e.g. 6147824"
            autoCapitalize="characters"
          />
          <AppButton
            label="Mark Present"
            onPress={handleManualCheckIn}
            loading={checkingIn}
            disabled={checkingIn}
          />
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.base },
  eyebrow: {
    ...typography.label,
    color: palette.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  title: { ...typography.heading1, color: palette.text },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: palette.errorBg,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 6,
  },
  badgeText: { ...typography.label, color: palette.error },
  list: { flex: 1 },
  listContent: { paddingBottom: spacing.base },
  emptyContainer: { flex: 1, justifyContent: 'center' },
  emptyWrap: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyIcon: { fontSize: 40, marginBottom: spacing.base },
  emptyTitle: { ...typography.heading2, color: palette.text, marginBottom: 6 },
  emptyBody: {
    ...typography.body,
    color: palette.muted,
    textAlign: 'center',
    paddingHorizontal: spacing.large,
  },
  manualWrap: {
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingTop: spacing.medium,
    marginTop: spacing.small,
  },
  manualLabel: {
    ...typography.label,
    color: palette.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.base,
  },
});
