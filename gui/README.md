# Certi-Tap

A React Native Expo attendance app with NFC support for scanning student cards, checking in missing records, and fetching registry data from a backend API.

## Features

- NFC-powered attendance scanning using `react-native-nfc-manager`
- Expo-based mobile app with Android and iOS support
- Bottom tab navigation
- Manual registry fetch and check-in workflows
- NFC simulation support for Expo development

## Requirements

- Node.js / npm
- Expo CLI
- Android Studio or Xcode for native builds
- A backend API compatible with the expected endpoints

## Getting Started

1. Install dependencies

```bash
npm install
```

1. Start the Expo development server

```bash
npm start
```

1. Run on Android

```bash
npm run android
```

1. Run on iOS

```bash
npm run ios
```

1. Web preview

```bash
npm run web
```

## NFC Notes

- NFC requires a native build and cannot be fully tested in Expo Go.
- Use a custom Expo development client for actual NFC scanning.

```bash
npx expo run:android
# or
npx expo run:ios
```

## Backend Configuration

The backend base URL is defined in `src/services/api.ts`.
Update it to match your server address if your machine IP changes.

Example:

```ts
const BASE_URL = 'http://10.0.0.166:8080/api/elements';
```

### Expected backend routes

- `POST /api/elements/verify-nfc`
- `GET /api/elements/unchecked`
- `POST /api/elements/{index}/check-backup`
- `POST /api/elements/fetch-external?startIndex=&limitAmount=`
- `DELETE /api/elements/reset`

## Project Structure

- `App.tsx` — app entry point
- `app.json` — Expo configuration
- `src/navigation/AppNavigator.tsx` — navigation setup
- `src/screens/ScannerScreen.tsx` — main attendance scanner UI
- `src/screens/SettingsScreen.tsx` — settings UI
- `src/screens/MissingScreen.tsx` — missing student check-in UI
- `src/services/api.ts` — API client
- `src/components/` — reusable UI components
- `src/theme/` — styling and theme configuration

## Notes

- The app is branded as **Certi-Tap** in Expo metadata.
- NFC access is requested through `android.permission.NFC` and Expo plugin integration.
- The app supports runtime updates and uses Expo managed workflow configuration.

## License

This repository does not include a specific license file. Add one if you want to share or open-source the project.
