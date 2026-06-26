import { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { palette, spacing } from '../theme';

export default function ScreenContainer({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  page: { flex: 1, padding: spacing.base },
});
