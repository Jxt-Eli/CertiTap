# Certi-Tap

A React Native Expo attendance app with NFC support for scanning student cards, checking in missing records, and fetching registry data from a backend API.

## Features

- NFC-powered attendance scanning using `react-native-nfc-manager`
- Expo-based mobile app with Android and iOS support
- Bottom tab navigation
- Manual registry fetch and check-in workflows
- NFC simulation support for Expo development

## Project layout

This is a two-part project in one repo:

```
CertiTap/
├── src/              ← backend (Spring Boot, Java)
├── pom.xml           ← backend build config
└── gui/              ← frontend (Expo / React Native)
    ├── package.json
    └── src/
```

The frontend lives under `gui/` — **you must `cd gui` before running any
npm command**, since that's where `package.json` actually is. Running
`npm install` from the repo root will fail (there's no `package.json` there).

## Requirements

- Node.js / npm
- Expo CLI
- Android Studio or Xcode for native builds
- Java 17+ and Maven (or use the included `./mvnw` wrapper) for the backend
- A PostgreSQL database for the backend

## Running the backend

1. Copy `.env.example` (repo root) to `.env`, or otherwise set these environment
   variables: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `UITS_API_URL`. See
   `.env.example` for details on each.
2. From the repo root, run:

```bash
./mvnw spring-boot:run
```

The API will start on port 8080 by default.

## Running the frontend

1. Move into the frontend folder — **this step is required**:

```bash
cd gui
```

2. Install dependencies:

```bash
npm install
```

3. Set your backend URL. Copy `gui/.env.example` to `gui/.env` and set
   `EXPO_PUBLIC_API_URL` to your backend's address (e.g.
   `http://<your-laptop-ip>:8080/api/elements`). If you skip this, the app
   falls back to the deployed production backend.

4. Start the Expo development server:

```bash
npm start
```

5. Run on Android:

```bash
npm run android
```

6. Run on iOS:

```bash
npm run ios
```

7. Web preview:

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

## Backend endpoints

| Method | Path | What it does |
|--------|------|-------------|
| POST | `/api/elements/verify-nfc` | Scan (uid only) or register (full payload) |
| GET | `/api/elements/unchecked` | Returns list of unchecked student names |
| POST | `/api/elements/{index}/check-backup` | Manual check-in by index |
| POST | `/api/elements/fetch-external?startIndex=&limitAmount=` | Pull student info from UITS API |
| DELETE | `/api/elements/reset` | Clear pulled records |

---

## Backend Configuration

The frontend's backend URL is controlled by `EXPO_PUBLIC_API_URL` (see
"Running the frontend" above), read in `gui/src/services/api.ts`. If unset, it
falls back to the deployed production URL — there's no hardcoded local IP to
edit anymore.

The backend's own configuration (database, UITS API) is controlled by the
environment variables described in the root `.env.example`.

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

.....
