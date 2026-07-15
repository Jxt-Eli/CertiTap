import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import NfcManager, { NfcTech, NfcB, IsoDep } from 'react-native-nfc-manager';
import ScreenContainer from '../components/ScreenContainer';
import NfcAnimation from '../components/NfcAnimation';
import AppButton from '../components/AppButton';
import StatusCard from '../components/StatusCard';
import AddPersonModal from '../components/AddPersonModal';
import { scanCard } from '../services/api';
import { palette, spacing, typography } from '../theme';

type ScanState = 'idle' | 'scanning' | 'verified' | 'not_found' | 'mismatch' | 'error';

type ResultData = {
  status: ScanState;
  message: string;
  uid?: string;
};

export default function ScannerScreen() {
  const [nfcSupported, setNfcSupported] = useState(false);
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [result, setResult] = useState<ResultData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingUid, setPendingUid] = useState('');
  const resultOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    NfcManager.start()
      .then(() => setNfcSupported(true))
      .catch(() => setNfcSupported(false));
    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  }, []);

  const fadeInResult = (data: ResultData) => {
    setResult(data);
    resultOpacity.setValue(0);
    Animated.timing(resultOpacity, {
      toValue: 1,
      duration: 380,
      useNativeDriver: true,
    }).start();
  };

  const handleScan = useCallback(async () => {
    setScanState('scanning');
    setResult(null);
    try {
      await NfcManager.requestTechnology([
      NfcTech.NfcA,
      NfcTech.NfcB,
      NfcTech.IsoDep,
      ])
      const tag = await NfcManager.getTag();
      const uid = tag?.id ?? null;
      if (!uid) {
        setScanState('error');
        fadeInResult({ status: 'error', message: 'Could not read card UID.' });
        return;
      }
      const apiResult = await scanCard(uid);
      setScanState(apiResult.status);
      if (apiResult.status === 'not_found') setPendingUid(uid);
      fadeInResult({ ...apiResult, uid });
    } catch {
      setScanState('error');
      fadeInResult({ status: 'error', message: 'Scan cancelled or failed.' });
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  }, []);

  const handleSimulate = async () => {
    const fakeUid = 'A1B2C3D4';
    setScanState('scanning');
    setResult(null);
    // small delay to show scanning state
    await new Promise((r) => setTimeout(r, 800));
    const apiResult = await scanCard(fakeUid);
    setScanState(apiResult.status);
    if (apiResult.status === 'not_found') setPendingUid(fakeUid);
    fadeInResult({ ...apiResult, uid: fakeUid });
  };

  const handleReset = () => {
    setScanState('idle');
    setResult(null);
    setPendingUid('');
  };

  const handleRegisterSuccess = () => {
    setShowAddModal(false);
    setScanState('verified');
    fadeInResult({
      status: 'verified',
      message: 'Student registered and marked present.',
      uid: pendingUid,
    });
  };

  const isIdleOrScanning = scanState === 'idle' || scanState === 'scanning';
  const hasResult = result !== null && !isIdleOrScanning;

  const badgeForState = (): { label: string; type: 'success' | 'error' | 'neutral' } => {
    switch (scanState) {
      case 'verified': return { label: 'Checked In', type: 'success' };
      case 'not_found': return { label: 'Not Registered', type: 'neutral' };
      case 'mismatch': return { label: 'Card Mismatch', type: 'error' };
      default: return { label: 'Error', type: 'error' };
    }
  };

  const titleForState = () => {
    switch (scanState) {
      case 'verified': return 'Attendance Logged';
      case 'not_found': return 'Student Not Found';
      case 'mismatch': return 'Card Mismatch';
      default: return 'Scan Error';
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Attendance</Text>
        <Text style={styles.title}>CertiTap</Text>
      </View>

      <View style={styles.animArea}>
        <NfcAnimation active={isIdleOrScanning} />
        {scanState === 'scanning' && (
          <Text style={styles.scanHint}>Hold card near the back of your device…</Text>
        )}
        {scanState === 'idle' && (
          <Text style={styles.scanHint}>Ready to scan</Text>
        )}
      </View>

      {hasResult && result ? (
        <Animated.View style={{ opacity: resultOpacity }}>
          <StatusCard
            title={titleForState()}
            subtitle={result.message}
            badge={badgeForState()}
          >
            {result.uid ? (
              <Text style={styles.detail}>Card UID · {result.uid}</Text>
            ) : null}
          </StatusCard>

          <View style={styles.actions}>
            {scanState === 'not_found' && pendingUid ? (
              <AppButton
                label="Register This Student"
                onPress={() => setShowAddModal(true)}
              />
            ) : null}
            <AppButton
              label="Scan Again"
              onPress={handleReset}
              variant="ghost"
            />
          </View>
        </Animated.View>
      ) : null}

      {isIdleOrScanning ? (
        <View style={styles.actions}>
          {nfcSupported ? (
            <AppButton
              label={scanState === 'scanning' ? 'Scanning…' : 'Scan Card'}
              onPress={handleScan}
              disabled={scanState === 'scanning'}
              loading={scanState === 'scanning'}
            />
          ) : null}
          <AppButton
            label="Scan Student ID"
            onPress={handleSimulate}
            variant="ghost"
            disabled={scanState === 'scanning'}
          />
        </View>
      ) : null}

      <AddPersonModal
        visible={showAddModal}
        cardUid={pendingUid}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleRegisterSuccess}
      />
    </ScreenContainer>
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
  animArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  scanHint: {
    ...typography.body,
    color: palette.muted,
    marginTop: spacing.base,
    textAlign: 'center',
  },
  actions: { gap: 10, marginTop: spacing.small },
  detail: { ...typography.caption, color: palette.muted },
});
