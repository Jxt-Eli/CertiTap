import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppButton from './AppButton';
import TextInputField from './TextInputField';
import { fetchExternalStudents } from '../services/api';
import { palette, radius, shadow, spacing, typography } from '../theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

type UIState = 'idle' | 'loading' | 'success' | 'error';

export default function FetchRegistryModal({ visible, onClose }: Props) {
  const [startIndex, setStartIndex] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  const [uiState, setUiState] = useState<UIState>('idle');
  const [message, setMessage] = useState('');

  const reset = () => {
    setStartIndex('');
    setLimitAmount('');
    setUiState('idle');
    setMessage('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFetch = async () => {
    if (!startIndex.trim() || !limitAmount.trim()) {
      setMessage('Both fields are required.');
      setUiState('error');
      return;
    }
    const limit = parseInt(limitAmount, 10);
    if (isNaN(limit) || limit < 1) {
      setMessage('Limit must be a valid number greater than 0.');
      setUiState('error');
      return;
    }
    setUiState('loading');
    const result = await fetchExternalStudents(startIndex.trim(), limit);
    setMessage(result.message);
    setUiState(result.success ? 'success' : 'error');
    if (result.success) {
      setTimeout(handleClose, 1800);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kvWrap}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Pull from School Registry</Text>
          <Text style={styles.subtitle}>
            Import a range of student records from the school database.
          </Text>

          {uiState === 'success' ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>✓  {message}</Text>
            </View>
          ) : (
            <>
              {uiState === 'error' ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{message}</Text>
                </View>
              ) : null}

              <TextInputField
                label="Start Index"
                value={startIndex}
                onChangeText={setStartIndex}
                placeholder="e.g. 6147824"
                autoCapitalize="characters"
              />
              <TextInputField
                label="Number of Records"
                value={limitAmount}
                onChangeText={setLimitAmount}
                placeholder="e.g. 50"
                keyboardType="numeric"
                autoCapitalize="none"
              />

              <View style={styles.actions}>
                {uiState === 'loading' ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color={palette.primary} />
                    <Text style={styles.loadingText}>Fetching records…</Text>
                  </View>
                ) : (
                  <>
                    <AppButton label="Import Records" onPress={handleFetch} />
                    <AppButton label="Cancel" onPress={handleClose} variant="ghost" />
                  </>
                )}
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(26,35,64,0.4)' },
  kvWrap: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  sheet: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.large,
    paddingBottom: spacing.xl,
    ...shadow.strong,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.round,
    backgroundColor: palette.border,
    alignSelf: 'center',
    marginBottom: spacing.medium,
  },
  title: { ...typography.heading2, color: palette.text, marginBottom: 4 },
  subtitle: {
    ...typography.caption,
    color: palette.muted,
    marginBottom: spacing.medium,
    lineHeight: 18,
  },
  successBox: {
    backgroundColor: palette.successBg,
    borderRadius: radius.base,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  successText: { ...typography.body, color: palette.success, fontWeight: '600' },
  errorBox: {
    backgroundColor: palette.errorBg,
    borderRadius: radius.small,
    padding: spacing.small,
    marginBottom: spacing.base,
  },
  errorText: { ...typography.caption, color: palette.error },
  actions: { gap: 10, marginTop: spacing.small },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  loadingText: { ...typography.body, color: palette.muted },
});
