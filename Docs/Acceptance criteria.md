# Acceptance Criteria.md

# Acceptance Criteria

## Purpose

This document defines how to know when a feature is complete.

Codex should use this file when implementing features and deciding when to stop.

If a feature is not listed here, Codex should follow the closest existing pattern and document any assumptions.

---

# Global Acceptance Criteria

These apply to all features.

A feature is not complete unless:

* it works within the current v0.1 scope
* it does not add out-of-scope functionality
* it does not introduce backend/auth/sync/API dependencies
* it does not add a feed or recommendation surface
* TypeScript passes, or failures are reported
* lint passes if configured, or failures are reported
* app startup is not broken
* manual testing steps are provided
* changed files are summarised

---

# Feature: Add Creator

## Goal

Allow the user to manually add a creator/account/profile they want to check intentionally.

## Fields

* Display name
* Platform
* Handle for supported platforms
* Custom profile URL for Other and edge cases

## Acceptance Criteria

* User can open Add Creator screen.
* User can enter a display name.
* User can select a platform from:

  * Instagram
  * TikTok
  * YouTube
  * X
  * Reddit
  * Other
* User can enter a handle for supported platforms.
* User can enter a custom profile URL for Other and edge cases.
* Save is blocked or shows an error if display name is empty.
* Save is blocked or shows an error if supported-platform handle is empty and no custom URL is provided.
* Save is blocked or shows an error if Other profile URL is empty.
* Save is blocked or shows an error if platform is missing.
* Custom URL is accepted if it begins with `http://` or `https://`.
* Custom URL may be normalised to include `https://` if missing.
* Supported-platform profile URLs pasted into the handle field are cleaned where simple.
* Created creator receives:

  * id
  * isActive: true
  * createdAt
  * updatedAt
* Created creator is saved locally.
* Created creator appears in Manage Creators.
* Created creator appears in the catch-up queue.
* Created creator persists after app restart.
* No platform API validation is added.
* No scraping is added.

## Manual Test Steps

1. Open app.
2. Navigate to Add Creator.
3. Try saving with all fields empty.
4. Confirm save is blocked or errors appear.
5. Enter display name only.
6. Confirm save is still blocked.
7. Enter display name, platform, and URL.
8. Save creator.
9. Confirm creator appears in Manage Creators.
10. Restart app.
11. Confirm creator still appears.

---

# Feature: Manage Creators

## Goal

Allow the user to view and delete saved creators.

## Acceptance Criteria

* User can open Manage Creators screen.
* All saved creators are displayed.
* Each creator item shows:

  * display name
  * platform
  * profile URL or handle
* If no creators exist, an empty state is shown.
* User can delete a creator.
* Deleted creator disappears from Manage Creators.
* Deleted creator disappears from the catch-up queue.
* Deleted creator does not return after app restart.
* Deleting one creator does not delete unrelated creators.
* No backend is required.

## Manual Test Steps

1. Add two creators.
2. Open Manage Creators.
3. Confirm both creators are visible.
4. Delete one creator.
5. Confirm only the deleted creator disappears.
6. Restart app.
7. Confirm deleted creator is still gone and remaining creator persists.

---

# Feature: Home Screen

## Goal

Show the user their finite queue status and provide clear entry points.

## Acceptance Criteria

* Home screen loads without requiring a network connection.
* Home screen shows app name or branding.
* Home screen shows core tagline or short product message.
* Home screen shows number of active creators.
* Home screen shows queue count.
* Home screen has a clear “Start catch-up” action.
* Home screen has an “Add creator” action.
* Home screen has a “Manage creators” action.
* If no creators exist, user is guided to add one.
* Start catch-up is disabled or redirected appropriately if no creators exist.
* UI renders from local data.
* No blocking remote loading state is used.

## Manual Test Steps

1. Start app with no creators.
2. Confirm empty state appears.
3. Add one creator.
4. Return home.
5. Confirm queue count updates.
6. Tap Start catch-up.
7. Confirm catch-up flow starts.

---

# Feature: Catch-up Queue

## Goal

Build a finite queue of creators for the user to check.

## v0.1 Queue Rule

```text
Queue = all active creators
```

## Acceptance Criteria

* Queue includes active creators.
* Queue excludes inactive creators if inactive state exists.
* Queue preserves a predictable order.
* Queue does not include deleted creators.
* Queue does not require network access.
* Queue does not fetch platform data.
* Queue does not recommend creators.
* Queue is finite and has a count.

## Manual Test Steps

1. Add three creators.
2. Start catch-up.
3. Confirm queue count is three.
4. Delete one creator.
5. Start catch-up again.
6. Confirm queue count is two.

---

# Feature: Catch-up Screen

## Goal

Show one creator at a time and help the user check them intentionally.

## Acceptance Criteria

* Screen shows progress, e.g. "1 of 3".
* Screen shows creator display name.
* Screen shows platform.
* Screen shows last checked date if available.
* Screen has "Open profile" button.
* Screen explains that swiping up advances the queue.
* Screen has a visible fallback action for done or skip.
* Open profile opens the stored profile URL externally.
* If the profile URL cannot be opened, user sees a simple error.
* Swiping up after opening a profile creates a done check-in.
* Swiping up after opening a profile updates creator `lastCheckedAt`.
* Swiping up without opening creates a skipped check-in.
* Swiping up without opening does not update `lastCheckedAt`.
* A skipped creator shows a temporary undo action.
* Undo removes the skipped check-in and returns to that creator.
* Swiping up moves to the next creator.
* When the queue is complete, user is taken to Done screen.
* No feed is displayed.
* No platform content is embedded inside Finite.

## Manual Test Steps

1. Add two creators.
2. Start catch-up.
3. Confirm first creator is shown.
4. Tap Open profile.
5. Confirm external URL opens.
6. Return to Finite.
7. Swipe up.
8. Confirm second creator is shown.
9. Swipe up without opening.
10. Confirm Done screen appears.

---
# Feature: Done Screen

## Goal

Give the user closure when a catch-up session ends.

## Acceptance Criteria

* Done screen appears after final queue item is done or skipped.
* Done screen clearly says the user is caught up.
* Done screen shows number of creators checked and/or skipped.
* Done screen encourages leaving rather than continuing.
* Done screen has a “Back home” button.
* Done screen does not recommend more content.
* Done screen does not show a feed.
* Done screen does not create a new scroll loop.

## Suggested Copy

```text
You’re caught up.

You checked X creators.
Now leave before the algorithm finds you.
```

## Manual Test Steps

1. Add one creator.
2. Start catch-up.
3. Tap Open profile, return, and swipe up.
4. Confirm Done screen appears.
5. Tap Back home.
6. Confirm Home screen appears.

---

# Feature: Local Storage

## Goal

Persist app data locally on the device.

## Acceptance Criteria

* Creators are saved locally.
* Check-ins are saved locally.
* App can load with no stored data.
* Empty storage returns empty arrays rather than crashing.
* Corrupted storage is handled gracefully where practical.
* Storage logic is centralised in `services/storage.ts` or equivalent.
* Screens do not directly use storage APIs if storage service exists.
* Data survives app reload.
* No backend is required.
* No account is required.

## Manual Test Steps

1. Start with empty app.
2. Add creator.
3. Restart app.
4. Confirm creator persists.
5. Complete a check-in.
6. Restart app.
7. Confirm last checked state persists.

---

# Feature: External Linking

## Goal

Open creator profiles in original apps/browsers.

## Acceptance Criteria

* Profile opening is handled through a central linking service.
* Stored profile URL is used.
* Web URLs open externally.
* Failure to open URL shows a clear error.
* No platform-specific deep-link system is required for v0.1.
* No platform APIs are used.
* No content is embedded inside Finite.

## Manual Test Steps

1. Add creator with valid URL.
2. Start catch-up.
3. Tap Open profile.
4. Confirm external app/browser opens.
5. Add creator with invalid URL.
6. Try opening.
7. Confirm error is handled without crashing.

---

# Feature: Basic Validation

## Goal

Prevent obviously broken creator entries.

## Acceptance Criteria

* Empty display name is rejected.
* Empty URL is rejected.
* Missing platform is rejected.
* Whitespace-only fields are treated as empty.
* URL can be normalised if missing protocol.
* User receives clear feedback when validation fails.
* Validation logic is reusable where practical.
* Validation does not call external APIs.

## Manual Test Steps

1. Try saving blank creator.
2. Try saving creator with spaces only.
3. Try saving creator without URL.
4. Try saving valid creator.
5. Confirm only valid creator is saved.

---

# Feature: Documentation Updates

## Goal

Keep the project understandable as it evolves.

## Acceptance Criteria

Codex should update documentation when:

* data model changes
* roadmap changes
* technical approach changes
* new major feature is added
* new dependency is added
* significant product decision is made

Documentation updates should be focused and not rewrite unrelated sections.

---

# Stop Conditions

Codex should stop and ask before continuing if:

* acceptance criteria conflict with existing docs
* feature requires backend/auth/sync
* feature requires scraping/API integration
* implementation requires a major dependency
* data model must change significantly
* platform strategy would change
* task scope is too broad
* app cannot run due to missing setup

---

# Acceptance Criteria Rule

If a feature does not meet its acceptance criteria, Codex should not call it complete.

If a criterion cannot be met, Codex should explain why and ask for direction.
