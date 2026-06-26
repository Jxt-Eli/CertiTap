import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppButton from '../components/AppButton';
import ScreenContainer from '../components/ScreenContainer';
import StatusCard from '../components/StatusCard';
import { fetchStudentByCard, StudentRecord } from '../services/api';
import { palette, spacing } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'PersonDetail'>;

export default function PersonDetailScreen({ navigation, route }: Props) {
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchStudentByCard(route.params.cardUid).then((result) => {
      setStudent(result);
      setLoading(false);
      if (!result) {
        Alert.alert('Student not found', 'This card has no stored info yet.', [
          { text: 'Add info', onPress: () => navigation.replace('AddPerson', { cardUid: route.params.cardUid }) },
          { text: 'Back', style: 'cancel' },
        ]);
      }
    });
  }, [navigation, route.params.cardUid]);

  if (loading) {
    return (
      <ScreenContainer>
        <Text style={styles.loading}>Loading student data…</Text>
      </ScreenContainer>
    );
  }

  if (!student) {
    return (
      <ScreenContainer>
        <Text style={styles.noData}>No student profile is stored for this card.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <StatusCard title={student.fullName} subtitle={`Index: ${student.indexNumber}`}>
        <Text style={styles.detail}>Reference: {student.referenceNumber}</Text>
        <Text style={styles.detail}>Card UID: {student.cardUid}</Text>
        <Text style={styles.detail}>Checked in: {student.checkedIn ? 'Yes' : 'No'}</Text>
      </StatusCard>
      <AppButton label="Back to Scanner" onPress={() => navigation.popToTop()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loading: { color: palette.muted, fontSize: 16, marginTop: spacing.large },
  noData: { color: palette.text, fontSize: 18, fontWeight: '600', marginTop: spacing.large },
  detail: { color: palette.text, fontSize: 15, marginBottom: 8 },
});
