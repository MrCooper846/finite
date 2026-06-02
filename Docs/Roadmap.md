# Roadmap.md

# Roadmap

## Purpose

This document defines the build phases for Finite.

The roadmap exists to prevent scope creep and keep development focused on the smallest useful version first.

Finite should become useful before it becomes clever.

## Product Mantra

```text
Keep up. Then leave.
```

## Platform Strategy

Finite is being built first in Expo React Native with TypeScript.

The likely first public 1.0 release target is Android.

iOS may follow later through:

* React Native iOS build
* PWA/web fallback
* SwiftUI rewrite

The React Native version should therefore act as both a working product and a clear reference implementation for any future native iOS version.

---

# Milestone 0 — Project Setup

## Goal

Create a clean repo foundation so development can proceed without confusion.

## Features / Tasks

* Create Expo React Native TypeScript project
* Create docs folder
* Add product and technical documentation
* Add `AGENTS.md`
* Establish project structure
* Confirm app runs locally
* Confirm package manager
* Confirm Expo SDK version
* Confirm TypeScript setup

## Done When

* App can start with the documented command
* Basic placeholder screen renders
* Docs exist and are linked from `AGENTS.md`
* Codex can understand product direction from repo docs

---

# Milestone 1 — Local MVP

## Goal

Build the smallest working version of Finite.

This milestone proves the core loop:

```text
Add creator → Start catch-up → Open profile → Mark done/skip → Finish → Leave
```

## Features

### Creator Data Model

* Define `Platform`
* Define `Creator`
* Define `CheckIn`
* Define `CatchUpSession`
* Add basic utility types for creating/updating creators

### Local Storage

* Store creators locally
* Store check-ins locally
* Load creators on app start
* Persist creators after restart
* Persist check-ins after restart

### Home Screen

* Show app name and tagline
* Show number of active creators
* Show current queue count
* Show “Start catch-up” button
* Show “Add creator” button
* Show “Manage creators” link/button
* Show empty state if no creators exist

### Add Creator Screen

* User can enter display name
* User can select platform
* User can enter profile URL
* User can optionally enter handle
* Required fields are validated
* Creator is saved locally
* User is returned to previous/main screen after saving

### Manage Creators Screen

* Show saved creators
* Show platform and URL
* Allow deleting creators
* Empty state if no creators exist

### Catch-up Screen

* Build queue from all active creators
* Show one creator at a time
* Show progress, e.g. “2 of 7”
* Show last checked date if available
* Open profile externally
* Mark done
* Skip
* Move to next creator
* Navigate to Done screen when queue is complete

### Done Screen

* Show completion message
* Show number of creators checked/skipped
* Encourage user to leave
* Provide “Back home” button

## Explicit Non-Goals

Do not build:

* backend
* login
* account sync
* platform APIs
* scraping
* notifications
* payments
* onboarding
* stats dashboard
* app blocking
* AI features
* creator recommendations
* feeds

## Done When

* A user can complete the entire core flow
* Data persists after app restart
* App works offline
* No backend is required
* No platform API is required
* Manual QA passes

---

# Milestone 2 — Habit Loop Improvements

## Goal

Make Finite more useful as a repeated daily/weekly tool.

## Features

### Creator Editing

* Edit display name
* Edit platform
* Edit URL
* Edit handle
* Toggle active/inactive

### Check Frequency

Add optional frequency:

```text
Daily
Twice weekly
Weekly
Manual
```

### Due Queue Logic

* Build queue based on check frequency
* Show due creators
* Manual creators only appear when user chooses
* Avoid showing every creator every day unless configured

### Basic History

* Show last checked date
* Show recent check-ins
* Show simple “checked today” state

### Better Empty States

* No creators yet
* No creators due today
* Queue completed
* Deleted all creators

## Explicit Non-Goals

Still do not build:

* backend
* sync
* platform APIs
* scraping
* payments
* AI summaries
* recommendations
* feeds

## Done When

* Finite can be used repeatedly without manually resetting everything
* User can control which creators appear regularly
* Basic history makes the app feel persistent and useful

---

# Milestone 3 — Polish and Android Beta

## Goal

Prepare the app for real-world testing by early users, likely on Android first.

## Features

### Visual Polish

* Improve layout
* Improve spacing
* Improve typography
* Add consistent button styles
* Add platform badges/icons
* Add subtle but non-distracting transitions

### Onboarding

* Explain Finite in under 30 seconds
* Let user add first creator quickly
* Avoid long onboarding slides
* No account requirement

### Settings

* Export data as JSON
* Import data from JSON
* Clear all data
* Manage basic preferences

### Basic Stats

Keep stats minimal and non-addictive.

Possible stats:

* creators checked this week
* sessions completed this week
* average queue size
* most recent catch-up

Avoid:

* leaderboards
* guilt metrics
* excessive streak pressure

### Android Testing

* Create Android build
* Test APK install
* Test on physical Android device
* Fix Android-specific issues
* Prepare for small external tester group

## Done When

* Android build can be shared with testers
* Core flow feels fast and smooth
* Empty/error states are acceptable
* App is usable without explanation

---

# Milestone 4 — Android 1.0 Candidate

## Goal

Ship a polished local-first Android version.

## Features

* Stable local storage
* Stable catch-up flow
* Creator management
* Check frequency
* Export/import backup
* Basic reminders if feasible
* Privacy policy
* App icon
* Store listing copy if Play Store release is chosen
* Final manual QA
* Bug fixes from beta testers

## Monetisation

Potential options:

* free app with optional supporter purchase
* generous free version with one-time Pro upgrade
* no monetisation in first public release

Do not add monetisation until the core app is useful.

## Done When

* App is stable enough for public Android users
* Known critical bugs are fixed
* User data is not easily lost
* App works without backend
* App feels aligned with product principles

---

# Milestone 5 — iOS Strategy

## Goal

Decide the best iOS path after Android/local MVP validation.

## Options

### Option 1: React Native iOS

Use the existing React Native codebase to build for iOS.

Pros:

* faster than rewrite
* reuses current code
* easier if app is already stable

Cons:

* still requires Apple Developer workflow
* may feel less native
* distribution requires TestFlight/App Store for most users

### Option 2: PWA/Web Fallback

Create a web/PWA version for iPhone users.

Pros:

* avoids App Store initially
* easy to share
* useful for testing

Cons:

* less native
* deep linking may be worse
* app-like feel may be limited

### Option 3: SwiftUI Rewrite

Rewrite the app natively for iOS using SwiftUI.

Pros:

* polished native iOS feel
* better long-term iOS fit
* useful learning path

Cons:

* requires Mac/Xcode access
* slower
* separate codebase
* more maintenance

## Done When

* iOS strategy is chosen based on actual product validation
* React Native codebase has served as a clear reference implementation
* No major iOS rewrite begins before the core app proves useful

---

# Future Ideas

These should not distract from the MVP.

Possible future features:

* YouTube/RSS smart updates
* multiple lists
* optional cloud sync
* widgets
* browser extension
* custom done-screen messages
* custom themes/icons
* advanced reminders
* supporter/pro features

## Permanent Non-Goals

Finite should never become:

* a feed
* a creator discovery platform
* a recommendation engine
* a social network
* an engagement platform
* a doomscroll app with better branding

## Roadmap Rule

When unsure, build the smaller version first.

The correct order is:

```text
Useful → reliable → polished → clever
```
