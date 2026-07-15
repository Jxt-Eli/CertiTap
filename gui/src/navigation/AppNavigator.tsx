import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import ScannerScreen from '../screens/ScannerScreen';
import MissingScreen from '../screens/MissingScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { palette, typography } from '../theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScannerStackParamList = {
  Scanner: undefined;
};

export type TabParamList = {
  ScannerTab: undefined;
  MissingTab: undefined;
  SettingsTab: undefined;
};

// ─── Stack (for future drill-down from scanner) ───────────────────────────────

const Stack = createNativeStackNavigator<ScannerStackParamList>();

function ScannerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Scanner" component={ScannerScreen} />
    </Stack.Navigator>
  );
}

// ─── Tab icons (SVG-free, emoji-free, pure shapes) ───────────────────────────

function ScanIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
      <View style={[styles.scanRing, focused && styles.scanRingActive]} />
      <View style={[styles.scanDot, focused && styles.scanDotActive]} />
    </View>
  );
}

function AbsentIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
      <View style={[styles.listLine, focused && styles.listLineActive]} />
      <View style={[styles.listLine, styles.listLineMid, focused && styles.listLineActive]} />
      <View style={[styles.listLine, styles.listLineShort, focused && styles.listLineActive]} />
    </View>
  );
}

function RegistryIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
      <View style={[styles.regCircle, focused && styles.regCircleActive]} />
      <View style={[styles.regBar, focused && styles.regBarActive]} />
    </View>
  );
}

// ─── Tab Navigator ────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator<TabParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: palette.primary,
          tabBarInactiveTintColor: palette.muted,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="ScannerTab"
          component={ScannerStack}
          options={{
            tabBarLabel: 'Scanner',
            tabBarIcon: ({ focused }) => <ScanIcon focused={focused} />,
          }}
        />
        <Tab.Screen
          name="MissingTab"
          component={MissingScreen}
          options={{
            tabBarLabel: 'Absent',
            tabBarIcon: ({ focused }) => <AbsentIcon focused={focused} />,
          }}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Registry',
            tabBarIcon: ({ focused }) => <RegistryIcon focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: palette.surface,
    borderTopColor: palette.border,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    ...typography.label,
    fontSize: 11,
  },

  // Base icon container
  iconBox: {
    width: 38,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  iconBoxActive: {
    backgroundColor: palette.primaryDim,
  },

  // Scanner icon
  scanRing: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: palette.muted,
    position: 'absolute',
  },
  scanRingActive: { borderColor: palette.primary },
  scanDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: palette.muted,
  },
  scanDotActive: { backgroundColor: palette.primary },

  // Absent icon
  listLine: {
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: palette.muted,
    marginVertical: 2,
  },
  listLineMid: { width: 12 },
  listLineShort: { width: 9 },
  listLineActive: { backgroundColor: palette.primary },

  // Registry icon
  regCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: palette.muted,
    marginBottom: 3,
  },
  regCircleActive: { borderColor: palette.primary },
  regBar: {
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: palette.muted,
  },
  regBarActive: { backgroundColor: palette.primary },
});
