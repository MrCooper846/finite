# docs/DATA_MODEL.md

# Data Model

## Purpose of This Document

This document defines the core data structures for Finite.

The data model should remain simple for v0.1.

Finite is local-first, so these types represent data stored on the user’s device.

This data model should also be treated as a product-level reference for any future native SwiftUI implementation. The exact syntax may change between TypeScript and Swift, but the concepts should remain portable.

## Design Principles

### 1. Keep the model small

Only store data needed for the core product.

### 2. Prefer user-entered truth

For v0.1, users manually add creators.

Do not rely on platform APIs or scraping to identify creators.

### 3. Store stable local data

The app should work with:

* display name
* platform
* generated or custom profile URL
* optional handle
* active status
* check-in history

Anything else is optional.

### 4. Avoid fake intelligence

If Finite does not know whether a creator has posted, it should not pretend to know.

v0.1 is based on intentional manual check-ins, not automatic post detection.

### 5. Keep models portable

The app may later be rewritten in SwiftUI for iOS.

Avoid designing models around React Native-specific implementation details.

The same concepts should be easy to represent as Swift structs later.

## Platform

The supported platform list for v0.1:

```ts
export type Platform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "x"
  | "reddit"
  | "reddit_community"
  | "other";
```

Platform labels can be displayed as:

```ts
export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
  reddit: "Reddit User",
  reddit_community: "Reddit Forum",
  other: "Other",
};
```

Future versions may add platforms, but v0.1 should keep the list small.

## Creator

A Creator represents one account/profile/channel the user wants to keep up with.

```ts
export type Creator = {
  id: string;
  displayName: string;
  platform: Platform;
  profileUrl: string;
  handle?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastCheckedAt?: string;
};
```

### Field Notes

#### id

Unique local identifier.

Use a UUID or another reliable unique ID generator.

Do not rely on platform IDs for v0.1.

#### displayName

User-facing name.

Examples:

```text
MKBHD
That one Instagram guy
Favourite manga artist
```

The display name is required.

It does not need to match the official platform name.

#### platform

The platform this creator belongs to.

Required.

#### profileUrl

The URL that Finite opens externally.

Required.

Examples:

```text
https://www.instagram.com/example/
https://www.tiktok.com/@example
https://www.youtube.com/@example
https://x.com/example
https://www.reddit.com/user/example
https://www.reddit.com/r/example
```

v0.1 should not require the URL to be verified against the platform.

#### handle

Optional user-entered handle.

Examples:

```text
@example
example
```

Handle is useful for display and future deep-linking, but not required for v0.1.

#### isActive

Determines whether the creator appears in the catch-up queue.

Default:

```ts
true
```

This allows future versions to pause creators without deleting them.

#### createdAt

ISO timestamp for when the creator was added.

#### updatedAt

ISO timestamp for when the creator was last edited.

#### lastCheckedAt

ISO timestamp for the last time the user marked this creator as done.

If the creator has only been skipped, this may remain unchanged depending on product decision.

v0.1 decision:

* Mark Done updates lastCheckedAt
* Skip does not update lastCheckedAt

This keeps “last checked” meaning “actually checked.”

## CreateCreatorInput

Input used when adding a new creator.

```ts
export type CreateCreatorInput = {
  displayName: string;
  platform: Platform;
  profileUrl: string;
  handle?: string;
};
```

When saving, the app should generate:

* id
* isActive
* createdAt
* updatedAt

## UpdateCreatorInput

Input used when editing a creator.

```ts
export type UpdateCreatorInput = Partial<{
  displayName: string;
  platform: Platform;
  profileUrl: string;
  handle: string;
  isActive: boolean;
}>;
```

When updating, the app should refresh:

```ts
updatedAt
```

## CheckIn

A CheckIn records a user action during catch-up.

```ts
export type CheckInStatus = "done" | "skipped";

export type CheckIn = {
  id: string;
  creatorId: string;
  status: CheckInStatus;
  checkedAt: string;
};
```

### Field Notes

#### id

Unique local identifier.

#### creatorId

ID of the creator this check-in belongs to.

#### status

Either:

```text
done
skipped
```

Done means the user intentionally checked the creator.

Skipped means the user chose not to check them in that session.

#### checkedAt

ISO timestamp for when the action happened.

Even skipped items use checkedAt because the user made a decision at that moment.

## CreateCheckInInput

```ts
export type CreateCheckInInput = {
  creatorId: string;
  status: CheckInStatus;
};
```

When saving, the app should generate:

* id
* checkedAt

## CatchUpSession

A CatchUpSession represents one active or completed queue.

For v0.1, session state can be held in memory while the catch-up flow is active.

Future versions may persist sessions.

```ts
export type CatchUpSession = {
  id: string;
  startedAt: string;
  completedAt?: string;
  creatorIds: string[];
  completedCreatorIds: string[];
  skippedCreatorIds: string[];
};
```

### Field Notes

#### id

Unique local identifier.

#### startedAt

ISO timestamp for when the catch-up session began.

#### completedAt

ISO timestamp for when the session ended.

Undefined while active.

#### creatorIds

The original queue of creators included in the session.

#### completedCreatorIds

Creators marked done.

#### skippedCreatorIds

Creators skipped.

## v0.1 Queue Model

For v0.1, the queue should be simple:

```ts
active creators = creators where isActive === true
today's queue = all active creators
```

No frequency logic yet.

No due dates yet.

No platform-specific post detection yet.

No smart recommendations.

Queue logic should live in a domain file, not inside a screen component.

Suggested file:

```text
src/domain/queue.ts
```

## Future Queue Model

Later versions may add check frequency:

```ts
export type CheckFrequency =
  | "daily"
  | "twice_weekly"
  | "weekly"
  | "manual";
```

Possible future Creator extension:

```ts
checkFrequency?: CheckFrequency;
```

But this should not be required for v0.1.

## Storage Keys

Suggested local storage keys:

```ts
const STORAGE_KEYS = {
  creators: "finite.creators",
  checkIns: "finite.checkIns",
};
```

If persisted sessions are added later:

```ts
sessions: "finite.sessions"
```

## Storage Shape

Creators should be stored as a JSON array:

```json
[
  {
    "id": "creator_123",
    "displayName": "Example Creator",
    "platform": "instagram",
    "profileUrl": "https://www.instagram.com/example/",
    "handle": "@example",
    "isActive": true,
    "createdAt": "2026-06-01T10:00:00.000Z",
    "updatedAt": "2026-06-01T10:00:00.000Z",
    "lastCheckedAt": "2026-06-02T10:00:00.000Z"
  }
]
```

Check-ins should be stored as a JSON array:

```json
[
  {
    "id": "checkin_123",
    "creatorId": "creator_123",
    "status": "done",
    "checkedAt": "2026-06-02T10:00:00.000Z"
  }
]
```

## Data Integrity Rules

### Creator deletion

When deleting a creator, v0.1 can simply remove the creator.

Check-ins may remain, but future stats should handle missing creators gracefully.

Possible future improvement:

* soft-delete creators with `isActive: false`
* add `deletedAt`

For v0.1, hard delete is acceptable.

### Missing or corrupted storage

If local storage is empty:

```ts
return []
```

If local storage is corrupted:

* catch the error
* avoid crashing
* return an empty array if necessary
* optionally log the issue

Do not wipe data silently unless required.

### URL normalisation

If the user enters:

```text
instagram.com/example
```

The app may normalise to:

```text
https://instagram.com/example
```

If unsure, preserve the user’s input but ensure Linking can open it.

## Derived Values

These should be computed, not stored.

### activeCreators

```ts
creators.filter((creator) => creator.isActive)
```

### checkedToday

Future utility.

Determines whether a creator has a done check-in today.

Not required for v0.1.

### lastCheckedLabel

Display value derived from `lastCheckedAt`.

Examples:

```text
Never checked
Checked today
Checked yesterday
Checked 3 days ago
```

## Example Creator

```ts
const exampleCreator: Creator = {
  id: "creator_001",
  displayName: "Example Creator",
  platform: "instagram",
  profileUrl: "https://www.instagram.com/example/",
  handle: "@example",
  isActive: true,
  createdAt: "2026-06-01T10:00:00.000Z",
  updatedAt: "2026-06-01T10:00:00.000Z",
  lastCheckedAt: undefined,
};
```

## Example CheckIn

```ts
const exampleCheckIn: CheckIn = {
  id: "checkin_001",
  creatorId: "creator_001",
  status: "done",
  checkedAt: "2026-06-02T10:00:00.000Z",
};
```

## SwiftUI Portability Notes

If Finite is later rewritten in SwiftUI, the equivalent models should likely become Swift structs.

Conceptual mapping:

```text
Creator TypeScript type → Creator Swift struct
Platform union type → Platform Swift enum
CheckIn TypeScript type → CheckIn Swift struct
CatchUpSession TypeScript type → CatchUpSession Swift struct
AsyncStorage JSON arrays → SwiftData/UserDefaults/local JSON storage
```

The React Native version should not depend on model behaviour that would be difficult to represent in Swift.

Avoid:

* dynamic untyped objects
* deeply nested flexible metadata
* platform-specific storage fields
* API-specific platform IDs in the core model
* hidden business logic inside UI components

Prefer:

* explicit fields
* simple enums
* ISO timestamp strings
* clear domain functions
* predictable local storage shape

## Data Model Non-Goals

Do not add these to v0.1:

* follower count
* profile picture
* bio
* latest post URL
* latest post count
* OAuth tokens
* platform account IDs
* platform API metadata
* recommendation scores
* engagement metrics
* user accounts
* cloud sync IDs
* payment status

These may be considered later only if they directly support Finite’s core purpose.
