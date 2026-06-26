import { useState } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppButton from '../components/AppButton';
import ScreenContainer from '../components/ScreenContainer';
import TextInputField from '../components/TextInputField';
import { addStudentRecord } from '../services/api';
import { palette, spacing } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPerson'>;

export default function AddPersonScreen({ navigation, route }: Props) {
  const [fullName, setFullName] = useState('');
  const [indexNumber, setIndexNumber] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  const handleSave = async () => {
    if (!fullName || !indexNumber || !referenceNumber) {
      Alert.alert('Missing fields', 'Please complete all fields before saving.');
      return;
    }

    await addStudentRecord({
      cardUid: route.params.cardUid,
      fullName,
      indexNumber,
      referenceNumber,
      checkedIn: false,
    });

    Alert.alert('Saved', 'The student record was stored locally.', [
      { text: 'OK', onPress: () => navigation.popToTop() },
    ]);
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Card UID</Text>
      <Text style={styles.uid}>{route.params.cardUid}</Text>
      <View style={styles.form}>
        <TextInputField label="Full Name" value={fullName} onChangeText={setFullName} placeholder="e.g. Joana Costa" />
        <TextInputField label="Index Number" value={indexNumber} onChangeText={setIndexNumber} placeholder="e.g. S1007" />
        <TextInputField label="Reference Number" value={referenceNumber} onChangeText={setReferenceNumber} placeholder="e.g. REF-509" />
      </View>
      <AppButton label="Store student info" onPress={handleSave} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { color: palette.muted, fontSize: 14, marginBottom: 8 },
  uid: { color: palette.text, fontSize: 20, fontWeight: '700', marginBottom: spacing.large },
  form: { marginBottom: spacing.base },
});
