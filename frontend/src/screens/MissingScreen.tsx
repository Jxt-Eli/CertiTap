import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import ScreenContainer from '../components/ScreenContainer';
import StatusCard from '../components/StatusCard';
import TextInputField from '../components/TextInputField';
import { checkInStudent, fetchMissingStudents, StudentRecord } from '../services/api';
import { palette, spacing } from '../theme';

export default function MissingScreen() {
  const [list, setList] = useState<StudentRecord[]>([]);
  const [manualIndex, setManualIndex] = useState('');

  const loadMissing = () => {
    fetchMissingStudents().then(setList);
  };

  useEffect(() => {
    loadMissing();
  }, []);

  const handleManualCheckIn = async () => {
    if (!manualIndex) {
      Alert.alert('Index required', 'Enter a student index to check them in.');
      return;
    }

    const success = await checkInStudent(manualIndex);
    if (success) {
      Alert.alert('Checked in', `${manualIndex} has been marked present.`);
      setManualIndex('');
      loadMissing();
      return;
    }

    Alert.alert('Not found', 'No student with that index was found.');
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Students not checked in</Text>
      <FlatList
        data={list}
        keyExtractor={(item) => item.cardUid}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <StatusCard title={item.fullName} subtitle={`Index ${item.indexNumber}`}>
            <Text style={styles.detail}>Card: {item.cardUid}</Text>
            <Text style={styles.detail}>Ref: {item.referenceNumber}</Text>
          </StatusCard>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No unchecked students at the moment.</Text>}
      />

      <View style={styles.manualArea}>
        <TextInputField
          label="Manual index check-in"
          value={manualIndex}
          onChangeText={setManualIndex}
          placeholder="S1001"
        />
        <AppButton label="Mark present" onPress={handleManualCheckIn} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { color: palette.text, fontSize: 22, fontWeight: '700', marginBottom: spacing.base },
  list: { paddingBottom: spacing.large },
  detail: { color: palette.muted, fontSize: 14 },
  empty: { color: palette.muted, fontSize: 16, marginTop: spacing.base },
  manualArea: { marginTop: spacing.large },
});
