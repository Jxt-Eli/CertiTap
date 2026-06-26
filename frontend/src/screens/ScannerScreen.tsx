import { useEffect, useMemo, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppButton from '../components/AppButton';
import ScreenContainer from '../components/ScreenContainer';
import { palette, spacing } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

const cardPool = ['A1B2C3D4', 'D2E3F4G5', 'F7H8J9K0'];

type Props = NativeStackScreenProps<RootStackParamList, 'Scanner'>;

export default function ScannerScreen({ navigation }: Props) {
  const [pulse] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, useNativeDriver: true, duration: 1400 }),
        Animated.timing(pulse, { toValue: 0, useNativeDriver: true, duration: 1400 }),
      ])
    ).start();
  }, [pulse]);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.8] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0.05] });

  const detectedCard = useMemo(() => cardPool[Math.floor(Math.random() * cardPool.length)], []);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Tap the NFC card near the reader</Text>
        {/* <Text style={styles.subtitle}>A minimal scan screen with a wave-style signal indicator.</Text> */}
      </View>

      <View style={styles.scannerArea}>
        <Animated.View style={[styles.signal, { transform: [{ scale: ringScale }], opacity: ringOpacity }]} />
        <Animated.View style={[styles.signal, { transform: [{ scale: ringScale }], opacity: ringOpacity }]} />
        <View style={styles.centerCircle} />
      </View>

      <View style={styles.actions}>
        <AppButton label="Simulate Card Read" onPress={() => navigation.navigate('PersonDetail', { cardUid: detectedCard })} />
        <AppButton label="Missing Check-in" onPress={() => navigation.navigate('Missing')} variant="ghost" />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.large },
  title: { color: palette.text, fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: palette.muted, lineHeight: 22 },
  scannerArea: {
    flex: 1,
    marginVertical: spacing.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signal: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: palette.primary,
  },
  centerCircle: {
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: palette.primary,
    opacity: 0.9,
  },
  actions: { gap: 12 },
});
