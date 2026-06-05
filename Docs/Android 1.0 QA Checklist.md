# Android 1.0 QA Checklist

Use this checklist before sharing Finite with Android testers.

## Environment

- Node version is compatible with Expo SDK 54.
- `npm.cmd run verify` passes on Windows.
- Expo SDK dependency check reports dependencies are up to date.
- Android bundle can be requested from Metro without errors.
- Internal Android APK build profile exists in `eas.json`.

## Fresh Install

- App opens to onboarding on first launch.
- User can skip onboarding.
- User can add first creator from onboarding.
- Home screen renders with no creators.
- Settings screen opens with no creators.

## Creator Management

- User can add a supported-platform creator with display name, platform, handle, and frequency.
- User can add an Other creator with display name, platform, full profile URL, and frequency.
- Pasted supported-platform profile URLs are cleaned to handles where simple.
- Generated profile URLs are stored and open through the existing Open Profile flow.
- Custom profile URL overrides remain available for edge cases.
- URL without protocol is normalised to `https://` for custom URLs.
- Blank display name is rejected.
- Blank handle is rejected for supported platforms unless a custom URL is provided.
- Blank URL is rejected for Other.
- User can edit creator fields.
- User can pause and resume a creator.
- User can delete a creator.
- Deleted creators do not appear in the queue.

## Queue

- Daily creators appear when never checked.
- Swiping up after opening creates a done check-in and updates last checked.
- Swiping up without opening creates a skipped check-in and does not update last checked.
- Skipped creators show an undo action.
- Undo returns to the skipped creator and removes the skipped check-in.
- Visible fallback actions work if the user does not swipe.
- Queue moves to the next creator after the upward swipe.
- Done screen appears after final queue item.
- Manual creators do not appear automatically in the due queue.
- Paused creators do not appear in the due queue.

## Backup

- Generate backup creates readable JSON.
- Importing the generated JSON restores creators and check-ins.
- Invalid JSON shows an error instead of crashing.
- Clear local data removes creators and check-ins.

## External Links

- Open profile opens a valid URL externally.
- Invalid URL failure shows a clear error.

## Privacy

- Settings privacy copy is visible.
- Privacy policy draft exists in `Docs/Privacy Policy.md`.
- No analytics, ads, auth, cloud sync, scraping, or platform APIs are present.

## Release Notes

- Internal Android APK build can be created with `eas build --platform android --profile android-beta`.
- App icon appears in Expo/Android build.
- Android package is `app.finite`.
- Android version code is `1`.
- Store listing draft exists in `Docs/Play Store Listing Draft.md`.

## Physical Android Beta Smoke Test

- Install the internal APK on a physical Android phone.
- Add one Instagram creator by handle only.
- Add one TikTok, YouTube, X, Reddit User, or Reddit Forum creator by handle only.
- Open a generated creator profile externally.
- Complete a catch-up queue by opening one creator before swiping and swiping past one unopened creator.
- Generate a backup.
- Import the generated backup.
- Restart the app and confirm creators/check-ins persist.
