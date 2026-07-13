import { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { palette, spacing } from '../theme';

type Props = {
  children: ReactNode;
  scrollable?: boolean;
  noPad?: boolean;
};

export default function ScreenContainer({ children, scrollable = false, noPad = false }: Props) {
  const content = (
    <View style={[styles.inner, noPad && styles.noPad]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {scrollable ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.medium,
    paddingBottom: spacing.base,
  },
  noPad: { padding: 0 },
});
