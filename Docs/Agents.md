# AGENTS.md

# AI Development Instructions for Finite

## Project Summary

This project is called Finite.

Tagline:

```text
Scroll like you mean it.
```

Finite is a mobile app for intentional social media use.

It helps users build a finite catch-up queue of creators/accounts they care about, open each creator in the original platform/app/browser, mark them done or skipped, and leave when the queue is complete.

Finite is not a feed.

Finite is an exit.

## Required Reading Before Making Changes

Before making code changes, read these files:

```text
README.md
docs/PRODUCT_BRIEF.md
docs/UX_PRINCIPLES.md
docs/TECHNICAL_PLAN.md
docs/DATA_MODEL.md
docs/ROADMAP.md
docs/DECISIONS.md
```

If any of these files do not exist yet, do not invent conflicting behaviour. Follow the existing files and the current user task.

## Core Product Rules

### 1. Do not build a feed

Finite must not contain:

* infinite feeds
* recommended content feeds
* creator discovery feeds
* trending pages
* For You style surfaces
* autoplay video feeds

### 2. Do not maximise engagement

The app should help users finish and leave.

Do not add features designed to keep users inside Finite unnecessarily.

### 3. Do not replace social platforms

Finite should open creators in their original platforms/apps/browsers.

Creators should still receive engagement on the original platform.

### 4. Do not add scraping

Do not scrape Instagram, TikTok, YouTube, X, Reddit, or any other platform unless explicitly requested.

### 5. Do not add platform APIs yet

Do not add OAuth, API integrations, YouTube API, TikTok API, Instagram API, or metadata enrichment unless explicitly requested.

### 6. Do not add backend/auth/cloud sync yet

v0.1 is local-first.

Do not add:

* backend
* user accounts
* login
* authentication
* cloud sync
* remote database
* server functions

unless explicitly requested.

### 7. Keep the app fast

Finite should render useful UI immediately from local data.

No network request should block the core catch-up flow.

### 8. Keep the scope small

Only implement the requested task.

Do not expand the task without permission.

If a feature seems useful but is out of scope, mention it in the final response as a possible future improvement rather than implementing it.

## Current Technical Direction

Use:

* Expo
* React Native
* TypeScript
* local storage
* external linking

For v0.1:

* use AsyncStorage for persistence
* use local data only
* use simple navigation
* use simple state management
* keep code modular and readable

## Platform Strategy

The current app is being built with Expo React Native and TypeScript.

The React Native version has two purposes:

1. validate the product and user experience quickly
2. act as the likely Android-first implementation path

The likely first public 1.0 release target is Android.

The iOS version may later be handled through:

1. a React Native iOS build
2. a PWA/web fallback
3. a native SwiftUI rewrite

Because a SwiftUI rewrite is possible later, keep the product logic portable.

When implementing features:

* keep domain logic separate from UI components
* avoid hiding business rules inside screen components
* avoid unnecessary React Native-specific abstractions in core logic
* keep data models simple and well-typed
* keep copy and product decisions easy to reuse
* centralise platform-specific services such as storage and linking

Do not add complex cross-platform abstractions prematurely.

The goal is simple portable logic, not architecture astronaut nonsense.

## Preferred Project Structure

Use or preserve this structure where practical:

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

If Expo Router or another navigation structure requires different folders, keep the same separation of responsibilities.

## Coding Style

Use TypeScript.

Prefer:

* small functions
* clear names
* explicit types
* simple components
* readable logic
* minimal dependencies

Avoid:

* clever abstractions
* unnecessary libraries
* large components
* deeply nested logic
* untyped objects
* hard-coded duplicate strings where a simple constant would help

## Dependency Rules

Do not add new dependencies unless necessary.

Before adding a dependency, explain:

* why it is needed
* why the existing stack cannot handle it
* whether it affects app size, performance, or maintainability

For v0.1, avoid dependencies for things that can be implemented simply.

## Data Model Rules

Follow `docs/DATA_MODEL.md`.

Core types:

* Platform
* Creator
* CheckIn
* CatchUpSession

Do not change the data model unless the current task explicitly requires it.

If the data model appears insufficient, stop and explain the proposed change before implementing it.

## Storage Rules

All v0.1 persistence should be local.

Storage helpers should be centralised.

Do not access AsyncStorage directly from many screens if a storage service exists.

Preferred storage service:

```text
src/services/storage.ts
```

Required helper concepts:

```ts
getCreators()
saveCreators()
addCreator()
updateCreator()
deleteCreator()

getCheckIns()
saveCheckIns()
addCheckIn()
```

Handle empty storage gracefully.

Handle corrupted storage without crashing where practical.

Storage implementation is platform-specific. Keep it isolated so the product logic can later be ported to SwiftUI if needed.

## Linking Rules

External profile opening should be handled centrally.

Preferred file:

```text
src/services/links.ts
```

v0.1 should use stored profile URLs.

Do not overbuild platform-specific deep linking unless requested.

If a URL cannot be opened, show a simple user-facing error.

Linking implementation is platform-specific. Keep it isolated so the catch-up flow remains portable.

## UX Rules

Follow `docs/UX_PRINCIPLES.md`.

The app should feel:

* fast
* calm
* minimal
* direct
* intentional

Good copy:

```text
Keep up. Then leave.
Your queue is finite.
Open what you came for.
You’re caught up.
Now leave before the algorithm finds you.
```

Avoid shame-based language.

Avoid productivity-guru language.

Avoid corporate filler.

## Task Discipline

Only do the task requested.

Do not also:

* redesign unrelated screens
* add new features
* refactor large areas unnecessarily
* add new dependencies casually
* change product direction
* add backend/auth/sync
* build platform integrations

If you notice a problem outside the current task, mention it in the final response.

## Before Finishing a Task

Before reporting completion:

1. Run TypeScript checks if available.
2. Run lint if available.
3. Run tests if available.
4. If the app can be started, confirm the start command.
5. If checks cannot be run, say exactly why.
6. Summarise changed files.
7. Explain manual test steps.
8. Mention assumptions or limitations.
9. Do not claim that something works if it was not tested.

## Final Response Format

When finishing a task, respond with:

```text
Summary
- ...

Files changed
- ...

Checks run
- ...

Manual test steps
- ...

Notes / assumptions
- ...
```

If checks were not run, say:

```text
Checks not run
- ...
```

Do not hide failures.

## Definition of Done

A task is done only when:

* requested behaviour is implemented
* scope was not expanded
* TypeScript errors are fixed or reported
* lint/test status is reported
* app still starts or startup issue is reported
* manual testing steps are provided
* docs/TODO or docs/TASKS is updated if the task requested it

## Current v0.1 Build Order

Recommended task order:

```text
TASK-001: Create project docs and repo structure
TASK-002: Create Expo TypeScript project skeleton
TASK-003: Add data model types
TASK-004: Add local storage service
TASK-005: Build Home screen
TASK-006: Build Add Creator screen
TASK-007: Build Manage Creators screen
TASK-008: Build Catch-up screen
TASK-009: Build Done screen
TASK-010: Manual QA and bug fixes
```

## Android-first Note

The likely first public 1.0 release is Android.

When building the React Native version, make sure it works well on Android and is easy to package/test as an Android app.

Do not ignore iOS compatibility, but do not let iOS App Store/TestFlight constraints block v0.1 development.

## SwiftUI Portability Note

If the app is later rewritten in SwiftUI, the React Native version should provide a clean product reference.

This means:

* domain logic should be understandable
* data models should be explicit
* screen responsibilities should be clear
* copywriting should be reusable
* platform-specific code should be isolated
* business rules should not be buried inside JSX

Do not attempt to write Swift code in this repo unless explicitly requested.

## Important Product Reminder

Finite should make intentional use easier than accidental use.

Every feature should help the user:

```text
choose → open → finish → leave
```

If a feature does not support that loop, question whether it belongs.
