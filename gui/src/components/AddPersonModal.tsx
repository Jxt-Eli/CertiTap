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
import { registerStudent } from '../services/api';
import { palette, radius, shadow, spacing, typography } from '../theme';

type Props = {
  visible: boolean;
  cardUid: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddPersonModal({ visible, cardUid, onClose, onSuccess }: Props) {
  const [fullName, setFullName] = useState('');
  const [indexNumber, setIndexNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFullName('');
    setIndexNumber('');
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!fullName.trim() || !indexNumber.trim()){
      setError('All fields are required.');
      return;
    }
    setError(null);
    setLoading(true);
    const result = await registerStudent({
      incomingNfc: cardUid,
      fullName: fullName.trim(),
      indexNumber: indexNumber.trim(),
    });
    setLoading(false);
    if (result.success) {
      reset();
      onSuccess();
    } else {
      setError(result.message || 'Registration failed. Try again.');
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
          <Text style={styles.title}>Register Student</Text>
          <Text style={styles.subtitle}>Card UID · {cardUid}</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TextInputField
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="e.g. Kwame Mensah"
            autoCapitalize="words"
          />
          <TextInputField
            label="Index Number"
            value={indexNumber}
            onChangeText={setIndexNumber}
            placeholder="e.g. S1001"
            autoCapitalize="characters"
          />
          <View style={styles.actions}>
            {loading ? (
              <ActivityIndicator color={palette.primary} style={{ paddingVertical: 14 }} />
            ) : (
              <>
                <AppButton label="Register" onPress={handleSubmit} />
                <AppButton label="Cancel" onPress={handleClose} variant="ghost" />
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26,35,64,0.4)',
  },
  kvWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
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
  subtitle: { ...typography.caption, color: palette.muted, marginBottom: spacing.medium },
  errorBox: {
    backgroundColor: palette.errorBg,
    borderRadius: radius.small,
    padding: spacing.small,
    marginBottom: spacing.base,
  },
  errorText: { ...typography.caption, color: palette.error },
  actions: { gap: 10, marginTop: spacing.small },
});
