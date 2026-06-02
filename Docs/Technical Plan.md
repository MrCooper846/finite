# docs/TECHNICAL_PLAN.md

# Technical Plan

## Project Name

Finite

## Tagline

Scroll like you mean it.

## Purpose of This Document

This document defines the technical direction for Finite.

It should guide implementation decisions, especially when using AI coding agents. The goal is to keep the app fast, local-first, simple, and aligned with the product philosophy.

Finite is not a social feed.

Finite is an intentional catch-up router.

## Current Target Version

v0.1 prototype.

The v0.1 goal is to prove the core catch-up flow:

```text
Add creator → Start catch-up → Open profile → Mark done or skip → Finish queue → Leave
```

v0.1 does not require a backend, account system, platform APIs, cloud sync, payments, or scraping.

## Platform Strategy

Finite is being developed first in Expo React Native with TypeScript.

The purpose of the React Native version is to validate the product, user experience, data model, and core catch-up flow quickly.

The likely first public 1.0 release target is Android, because Android distribution and early testing are easier than iOS. Android builds can be shared more directly with testers, and the project can reach early users without being blocked by Apple’s App Store/TestFlight process.

The iOS version may later be handled in one of three ways:

1. React Native iOS build through Expo/TestFlight/App Store.
2. PWA/web fallback for early iPhone users.
3. Native SwiftUI rewrite if the app proves useful and deserves a polished iOS-first implementation.

Because of this, the React Native codebase should be treated as both:

1. a working prototype / likely Android implementation
2. a reference implementation for a possible future SwiftUI version

Implementation should avoid unnecessary React Native-specific coupling in the product logic.

Keep these portable where possible:

* data models
* queue logic
* check-in logic
* date utilities
* validation logic
* copywriting
* UX flow
* screen responsibilities

React Native-specific code should be isolated where practical, especially:

* navigation
* local storage implementation
* external linking
* platform-specific UI behaviour

The goal is not to create a perfect cross-platform abstraction.

The goal is to keep the app simple enough that a SwiftUI rewrite would be straightforward if needed.

## Stack

Finite v0.1 will use:

* Expo
* React Native
* TypeScript
* Local device storage
* External linking for creator profile URLs

## Core Technical Principles

### 1. Local-first

Finite should work without a backend.

For v0.1, all data should be stored locally on the device.

This keeps the app:

* fast
* private
* simple
* cheaper to run
* easier to prototype
* less fragile

No server should be required for the core experience.

### 2. No blocking network dependency

The main catch-up flow must not depend on remote APIs.

The user should be able to:

* open the app
* see saved creators
* start a catch-up session
* open creator links
* mark creators done or skipped

without waiting for a network request.

### 3. Instant structure, lazy decoration

The app should render useful UI from local data first.

Core information:

* display name
* platform
* profile URL
* last checked date
* catch-up progress

Optional information:

* avatar
* profile metadata
* latest post count
* enriched platform data

Optional information must never block the main UI.

### 4. Small, readable modules

Prefer small files with clear responsibilities.

Avoid dumping app logic into screen components.

Keep domain logic, storage logic, and UI separate where practical.

This is especially important because the app may later be rewritten in SwiftUI. Future porting should involve translating clear product logic, not untangling business rules hidden inside large React components.

### 5. Avoid premature architecture

Do not add:

* backend
* authentication
* sync
* database
* payment systems
* platform APIs
* scraping
* complex state management
* analytics platforms

unless explicitly requested.

v0.1 should be simple enough to understand quickly.

## App Architecture

Preferred structure:

```text
src/
  screens/
    HomeScreen.tsx
    AddCreatorScreen.tsx
    ManageCreatorsScreen.tsx
    CatchUpScreen.tsx
    DoneScreen.tsx

  components/
    CreatorCard.tsx
    BigButton.tsx
    PlatformBadge.tsx
    EmptyState.tsx

  domain/
    creator.ts
    checkin.ts
    session.ts
    queue.ts

  services/
    storage.ts
    links.ts

  utils/
    dates.ts
    ids.ts
    validation.ts
```

This structure can be adjusted if Expo Router requires a slightly different layout, but the separation of concerns should remain.

## Screen Responsibilities

### HomeScreen

Purpose:

* show today’s catch-up status
* show number of active creators
* allow user to start catch-up
* link to add/manage creators

v0.1 behaviour:

* “Today’s queue” can simply be all active creators
* show a clear button: “Start catch-up”
* show empty state if no creators exist

Example copy:

```text
Your queue is finite.
Add a creator to start.
```

### AddCreatorScreen

Purpose:

* allow user to manually add one creator/account/profile

Fields:

* display name
* platform
* profile URL
* optional handle

Validation:

* display name is required
* platform is required
* profile URL is required
* profile URL should look like a URL

Do not add platform API validation yet.

### ManageCreatorsScreen

Purpose:

* display saved creators
* allow user to delete creators
* optionally allow basic edit if simple

v0.1 requirement:

* list all creators
* show display name, platform, and URL
* allow deleting a creator

### CatchUpScreen

Purpose:

* show one creator at a time
* let user open the creator externally
* let user mark done or skip
* progress through the queue

Required UI:

```text
2 of 7

Creator Name
Platform
Last checked: 3 days ago

[Open profile]
[Mark done]
[Skip]
```

Behaviour:

* Open profile uses external linking
* Mark done records a check-in
* Skip records a skipped check-in
* Both actions move to the next creator
* When the queue is complete, navigate to DoneScreen

### DoneScreen

Purpose:

* give the user closure
* reinforce that they are finished
* encourage leaving

Example copy:

```text
You’re caught up.

You checked 7 creators.
Now leave before the algorithm finds you.
```

Required actions:

* Back home

## Storage

v0.1 should use local device storage.

Preferred initial option:

* AsyncStorage

Possible later option:

* MMKV for better performance if needed

Storage should be abstracted behind helper functions so it can later be swapped without rewriting screens.

Required storage helpers:

```ts
getCreators(): Promise<Creator[]>
saveCreators(creators: Creator[]): Promise<void>
addCreator(input: CreateCreatorInput): Promise<Creator>
updateCreator(id: string, updates: Partial<Creator>): Promise<Creator>
deleteCreator(id: string): Promise<void>

getCheckIns(): Promise<CheckIn[]>
saveCheckIns(checkIns: CheckIn[]): Promise<void>
addCheckIn(input: CreateCheckInInput): Promise<CheckIn>
```

For v0.1, catch-up session state may live in memory while active, but completed check-ins should persist.

Storage implementation is platform-specific and should stay inside `services/storage.ts`.

Do not spread AsyncStorage calls across screen components.

## Linking

Opening creator profiles should be handled through a dedicated service.

Preferred file:

```text
src/services/links.ts
```

Initial behaviour:

* open the stored profile URL externally
* use Expo/React Native Linking API
* if opening fails, show a simple error message

Do not overcomplicate platform-specific deep links in v0.1.

Later versions can improve links like:

* instagram://user?username=
* tiktok://
* youtube://
* x://

For now, reliable web URLs are enough.

Linking implementation is platform-specific and should stay inside `services/links.ts`.

## State Management

For v0.1, prefer simple state management.

Acceptable:

* React useState/useEffect
* simple context if needed
* local helper hooks if useful

Avoid unless clearly justified:

* Redux
* Zustand
* MobX
* complex global stores

If state starts becoming messy, introduce a small app-level context for creators/check-ins.

Do not introduce global state architecture before the app needs it.

## Performance Requirements

Finite should feel faster than opening social media directly.

Internal UI actions should feel instant.

Performance rules:

* render from local data
* avoid blocking spinners
* avoid heavy animations
* avoid unnecessary network requests
* avoid fetching images/avatars in v0.1
* use FlatList for long creator lists if needed
* keep catch-up screen minimal
* update UI immediately after Mark Done/Skip

The user should never be waiting on Finite before they can begin a catch-up session.

## Error Handling

Errors should be clear and non-dramatic.

Examples:

```text
Couldn’t save creator. Please try again.
Couldn’t open this profile.
This URL doesn’t look right.
```

Do not expose raw technical errors to the user.

Log technical details internally if needed.

## Validation

v0.1 validation should be simple.

For adding creators:

* display name must not be empty
* profile URL must not be empty
* platform must be selected
* URL should begin with http:// or https://, or be normalised to https:// where appropriate

Do not validate whether the profile actually exists in v0.1.

Validation logic should live in a utility or domain file rather than being buried entirely inside a screen.

## Testing Approach

For v0.1, manual QA is acceptable, but pure functions should be easy to test later.

Good candidates for future tests:

* queue building
* date formatting
* URL normalisation
* creator validation
* check-in creation

Manual QA should verify:

* app starts
* creator can be added
* creator persists after reload
* creator can be deleted
* catch-up session starts
* open profile launches external URL
* mark done moves to next creator
* skip moves to next creator
* done screen appears at end

## v0.1 Scope

Build:

* Expo React Native TypeScript project
* navigation
* Creator model
* CheckIn model
* local storage helpers
* Home screen
* Add Creator screen
* Manage Creators screen
* Catch-up screen
* Done screen
* external profile opening
* local persistence

Do not build:

* backend
* login
* cloud sync
* payments
* monetisation
* platform APIs
* Instagram scraping
* TikTok scraping
* YouTube API
* push notifications
* app blocking
* AI summaries
* creator recommendations
* social features

## v0.2 Scope

Possible next step after v0.1:

* edit creators
* check frequency
* due-today queue logic
* better empty states
* export/import JSON
* basic stats
* improved platform URL handling

## v0.3 Scope

Possible polish stage:

* onboarding
* app icon
* improved visual design
* subtle animations
* reminder notifications
* better copywriting
* manual QA checklist
* Android internal testing preparation

## v1.0 Scope

Likely first public 1.0 target: Android.

Possible Android 1.0 candidate:

* polished local-first app
* no account required
* stable creator management
* stable catch-up flow
* basic reminders
* import/export backup
* privacy policy
* Android release build
* internal APK testing
* possible Play Store release later

iOS may follow later through:

* React Native iOS build
* PWA/web fallback
* SwiftUI rewrite

## Technical Non-Goals

Finite should not become technically complex just because it can.

Avoid:

* complex backend architecture
* premature sync
* social graph features
* algorithmic recommendations
* content feeds
* scraping infrastructure
* analytics-heavy behaviour tracking
* attention-maximising loops

## Development Mantra

```text
Make intentional use faster than accidental use.
```
