# CodeQuest Attendance — Complete Setup

## Step 1: Fix the database

In your terminal, connect to Postgres and drop the messy tables:

```bash
psql -d codequestdb -f fix_db.sql
```

Then start Spring Boot. It will recreate the tables cleanly.

---

## Step 2: Place the files

Copy the entire `src/` folder and `App.tsx` into your frontend project root:

```
your-frontend/
├── App.tsx                   ← replace existing
├── app.json                  ← replace existing
├── babel.config.js           ← replace existing
├── package.json              ← replace existing
├── tsconfig.json             ← replace existing
└── src/
    ├── theme/index.ts
    ├── services/api.ts
    ├── navigation/AppNavigator.tsx
    ├── components/
    │   ├── ScreenContainer.tsx
    │   ├── AppButton.tsx
    │   ├── TextInputField.tsx
    │   ├── StatusCard.tsx
    │   ├── NfcAnimation.tsx
    │   ├── AddPersonModal.tsx
    │   └── FetchRegistryModal.tsx
    └── screens/
        ├── ScannerScreen.tsx
        ├── MissingScreen.tsx
        └── SettingsScreen.tsx
```

---

## Step 3: Install dependencies

```bash
npm install
```

---

## Step 4: Update your IP if it changes

Your backend URL is in `src/services/api.ts` at the top:

```ts
const BASE_URL = 'http://10.0.0.166:8080/api/elements';
```

If your laptop IP changes, update it here. Your phone and laptop must be on the same WiFi.

---

## Step 5: Test with Expo Go (simulate only)

```bash
npx expo start
```

Scan the QR code with Expo Go. NFC won't work in Expo Go, but the Simulate Scan
button lets you test all navigation and API calls.

---

## Step 6: Build a dev client for real NFC

NFC requires native code — Expo Go can't run it.

```bash
npx expo install expo-dev-client
npx eas build --profile development --platform android
```

Install the APK on your phone, then:

```bash
npx expo start --dev-client
```

---

## Backend endpoints expected

| Method | Path | What it does |
|--------|------|-------------|
| POST | `/api/elements/verify-nfc` | Scan (uid only) or register (full payload) |
| GET | `/api/elements/unchecked` | Returns list of unchecked student names |
| POST | `/api/elements/{index}/check-backup` | Manual check-in by index |
| POST | `/api/elements/fetch-external?startIndex=&limitAmount=` | Pull from school API |
| DELETE | `/api/elements/reset` | Clear pulled records *(add to controller later)* |

---

## Notes

- The **Simulate Scan** button on the Scanner tab always works without a physical card.
- When you switch to Neon, only the Spring `application.properties` datasource URL changes. The frontend is untouched.
- The reset endpoint is a placeholder — wire it into the Spring controller when ready.
