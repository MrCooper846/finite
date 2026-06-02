# Finite

Scroll like you mean it.

Finite is a local-first Expo React Native app for intentional social media catch-up. Add creators you care about, work through a finite queue, open each profile externally, mark it done or skipped, then leave.

## Running Locally

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

Start with a tunnel for physical phone testing when local Wi-Fi discovery is unreliable:

```bash
npm run tunnel
```

On Windows PowerShell, if script execution policy blocks `npx`, use:

```powershell
npx.cmd expo start
```

## Testing on Your Phone

1. Install **Expo Go** on your phone from the App Store or Google Play.
2. Make sure your phone and development machine are on the same Wi-Fi network.
3. From the project folder, run:

```bash
npx expo start
```

4. Scan the QR code shown in the terminal with Expo Go.
5. If the phone cannot connect on the same Wi-Fi, restart Expo in tunnel mode:

```bash
npm run tunnel
```

Tunnel mode is slower, but it can help when Wi-Fi network discovery is blocked.

## Useful Scripts

```bash
npm run start
npm run tunnel
npm run android
npm run web
npm run verify
```

## Scope

Finite does not use backend services, accounts, cloud sync, scraping, platform APIs, recommendations, ads, or analytics.
