import { StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { palette, radius, spacing, typography } from '../theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
  style?: ViewStyle;
};

export default function TextInputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  editable = true,
  style,
}: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && styles.inputDisabled]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.muted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.base },
  label: {
    ...typography.label,
    color: palette.muted,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  input: {
    height: 48,
    backgroundColor: palette.surface,
    borderRadius: radius.base,
    borderWidth: 1.5,
    borderColor: palette.border,
    paddingHorizontal: spacing.base,
    ...typography.body,
    color: palette.text,
  },
  inputDisabled: {
    backgroundColor: palette.surfaceAlt,
    color: palette.muted,
  },
});
