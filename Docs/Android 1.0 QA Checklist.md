# Android 1.0 QA Checklist

Use this checklist before sharing Finite with Android testers.

## Environment

- Node version is compatible with Expo SDK 56.
- `npm.cmd run verify` passes on Windows.
- Expo SDK dependency check reports dependencies are up to date.
- Android bundle can be requested from Metro without errors.

## Fresh Install

- App opens to onboarding on first launch.
- User can skip onboarding.
- User can add first creator from onboarding.
- Home screen renders with no creators.
- Settings screen opens with no creators.

## Creator Management

- User can add a creator with display name, platform, URL, optional handle, and frequency.
- URL without protocol is normalised to `https://`.
- Blank display name is rejected.
- Blank URL is rejected.
- User can edit creator fields.
- User can pause and resume a creator.
- User can delete a creator.
- Deleted creators do not appear in the queue.

## Queue

- Daily creators appear when never checked.
- Mark done creates a check-in and updates last checked.
- Skip creates a check-in and does not update last checked.
- Queue moves to the next creator after done or skip.
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

- App icon appears in Expo/Android build.
- Android package is `app.finite`.
- Android version code is `1`.
- Store listing draft exists in `Docs/Play Store Listing Draft.md`.
