import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScannerScreen from '../screens/ScannerScreen';
import PersonDetailScreen from '../screens/PersonDetailScreen';
import AddPersonScreen from '../screens/AddPersonScreen';
import MissingScreen from '../screens/MissingScreen';

export type RootStackParamList = {
  Scanner: undefined;
  PersonDetail: { cardUid: string; studentId?: string };
  AddPerson: { cardUid: string };
  Missing: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0C4ED3' },
        headerTintColor: '#fff',
        contentStyle: { backgroundColor: '#F5F8FF' },
      }}
    >
      <Stack.Screen name="Scanner" component={ScannerScreen} options={{ title: 'NFC Scanner' }} />
      <Stack.Screen name="PersonDetail" component={PersonDetailScreen} options={{ title: 'Student Info' }} />
      <Stack.Screen name="AddPerson" component={AddPersonScreen} options={{ title: 'Add Person' }} />
      <Stack.Screen name="Missing" component={MissingScreen} options={{ title: 'Missing Check-in' }} />
    </Stack.Navigator>
  );
}
