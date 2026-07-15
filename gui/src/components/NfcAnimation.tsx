import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { palette } from '../theme';

type Props = {
  active?: boolean;
};

export default function NfcAnimation({ active = true }: Props) {
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;
  const cardX = useRef(new Animated.Value(70)).current;

  useEffect(() => {
    if (!active) {
      ring1.setValue(0);
      ring2.setValue(0);
      ring3.setValue(0);
      cardX.setValue(70);
      return;
    }

    const cardAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(cardX, {
          toValue: -8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.delay(300),
        Animated.timing(cardX, {
          toValue: 70,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.delay(400),
      ])
    );

    const makeRing = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.delay(800 - delay),
        ])
      );

    cardAnim.start();
    makeRing(ring1, 0).start();
    makeRing(ring2, 300).start();
    makeRing(ring3, 600).start();

    return () => {
      cardAnim.stop();
      ring1.stopAnimation();
      ring2.stopAnimation();
      ring3.stopAnimation();
    };
  }, [active, cardX, ring1, ring2, ring3]);

  const ringStyle = (val: Animated.Value, size: number) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 1.5,
    borderColor: palette.nfcRingFaint,
    position: 'absolute' as const,
    opacity: val.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [0, 0.55, 0],
    }),
    transform: [
      {
        scale: val.interpolate({
          inputRange: [0, 1],
          outputRange: [0.65, 1.45],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      {/* Pulsing NFC rings — behind everything */}
      <Animated.View style={ringStyle(ring1, 170)} />
      <Animated.View style={ringStyle(ring2, 220)} />
      <Animated.View style={ringStyle(ring3, 270)} />

      {/* Card that slides from the right, sits behind the phone */}
      <Animated.View
        style={[styles.card, { transform: [{ translateX: cardX }] }]}
      >
        {/* Card body */}
        <View style={styles.cardInner}>
          <View style={styles.cardStripe} />
          <View style={styles.cardChip} />
          {/* Mini NFC arcs on card */}
          <View style={styles.cardNfcArea}>
            <View style={[styles.cardArc, styles.cardArc1]} />
            <View style={[styles.cardArc, styles.cardArc2]} />
            <View style={[styles.cardArc, styles.cardArc3]} />
          </View>
        </View>
      </Animated.View>

      {/* Phone body — on top of card */}
      <View style={styles.phone}>
        {/* Phone shell */}
        <View style={styles.phoneShell}>
          {/* Speaker */}
          <View style={styles.speaker} />
          {/* Screen */}
          <View style={styles.screen}>
            {/* NFC symbol on screen */}
            <View style={styles.nfcOnScreen}>
              <View style={[styles.nfcArc, styles.nfcArc1]} />
              <View style={[styles.nfcArc, styles.nfcArc2]} />
              <View style={[styles.nfcArc, styles.nfcArc3]} />
              <View style={styles.nfcDot} />
            </View>
          </View>
          {/* Home bar */}
          <View style={styles.homeBar} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    height: 210,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── NFC card ──
  card: {
    position: 'absolute',
    zIndex: 1,
    right: 10,
  },
  cardInner: {
    width: 88,
    height: 60,
    borderRadius: 7,
    backgroundColor: palette.primaryDim,
    borderWidth: 1,
    borderColor: palette.borderStrong,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 8,
  },
  cardStripe: {
    position: 'absolute',
    top: 14,
    left: 0,
    right: 0,
    height: 13,
    backgroundColor: palette.borderStrong,
  },
  cardChip: {
    width: 18,
    height: 14,
    borderRadius: 3,
    backgroundColor: palette.primaryLight,
    position: 'absolute',
    bottom: 10,
    left: 10,
    opacity: 0.7,
  },
  cardNfcArea: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardArc: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: palette.primary,
    borderRadius: 999,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    opacity: 0.6,
  },
  cardArc1: { width: 8, height: 8, right: 0 },
  cardArc2: { width: 14, height: 14, right: 0, opacity: 0.4 },
  cardArc3: { width: 20, height: 20, right: 0, opacity: 0.2 },

  // ── Phone ──
  phone: {
    zIndex: 2,
  },
  phoneShell: {
    width: 90,
    height: 160,
    borderRadius: 18,
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.borderStrong,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    overflow: 'hidden',
  },
  speaker: {
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: palette.border,
    marginBottom: 6,
  },
  screen: {
    flex: 1,
    width: '85%',
    borderRadius: 8,
    backgroundColor: palette.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeBar: {
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: palette.border,
    marginTop: 6,
  },

  // ── NFC symbol on phone screen ──
  nfcOnScreen: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nfcArc: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: palette.primary,
    borderRadius: 999,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  nfcArc1: { width: 10, height: 10, top: 13 },
  nfcArc2: { width: 20, height: 20, top: 8, opacity: 0.6 },
  nfcArc3: { width: 30, height: 30, top: 3, opacity: 0.3 },
  nfcDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: palette.primary,
    position: 'absolute',
    bottom: 9,
  },
});
