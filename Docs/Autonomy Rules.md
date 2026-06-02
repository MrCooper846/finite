# Autonomy Rules.md

# Autonomy Rules

## Purpose

This document defines how much freedom Codex or any AI coding agent has when working on Finite.

Finite is an opinionated app with a deliberately small scope. The agent should help build the product faster, but should not change the product direction without permission.

The goal is:

```text
Fast implementation, controlled scope, clear handoff.
```

## Core Autonomy Principle

Codex may make normal implementation decisions, but must ask before making product, architecture, dependency, monetisation, backend, or platform-direction decisions.

## Decisions Codex Can Make Freely

Codex may choose reasonable implementation details for the current task, including:

* file organisation within the agreed project structure
* component names
* helper function names
* small UI layout details
* basic error handling wording
* local variable names
* simple TypeScript utility functions
* small refactors inside files directly related to the current task
* whether to split a large component into smaller components
* how to structure a form internally
* how to map data into UI
* whether to create small reusable components if they reduce duplication

Codex may also fix obvious bugs encountered while completing the current task, as long as the fixes are related to that task.

## Decisions Codex Must Ask About First

Codex must ask before doing any of the following:

* adding a backend
* adding authentication
* adding cloud sync
* adding a database service
* adding payments or monetisation
* adding analytics/tracking
* adding push notifications
* adding platform APIs
* adding scraping
* adding AI features
* adding recommendation features
* changing the core product model
* changing the data model in a way that affects existing stored data
* adding major dependencies
* changing navigation architecture
* changing from Expo Router to React Navigation, or vice versa
* adding server-side code
* adding account/user profile concepts
* adding social features
* adding a feed
* adding creator discovery
* adding anything designed to increase time spent inside the app

If in doubt, ask.

## Dependency Rules

Codex should avoid adding dependencies unless they clearly reduce complexity or are standard for the task.

Allowed without asking if not already installed:

* Expo standard packages needed for the task
* AsyncStorage if local storage has not yet been set up
* basic navigation package if the project does not already have navigation

Codex must ask before adding:

* state management libraries
* UI component libraries
* animation libraries
* analytics SDKs
* backend SDKs
* authentication SDKs
* payment libraries
* scraping/parsing libraries
* database clients
* large utility libraries

When proposing a dependency, Codex should explain:

* what the dependency does
* why it is needed
* why built-in React Native/Expo tools are not enough
* whether it affects app size or maintainability

## Scope Rules

Codex should complete one task at a time.

If the task says:

```text
Build Add Creator screen
```

Codex should not also build:

* onboarding
* stats
* settings
* notifications
* creator editing
* catch-up mode
* theme system
* backend sync

unless explicitly asked.

Codex may create placeholders only where necessary to keep the app running.

## Product Direction Rules

Finite is not a social media app.

Finite is a tool for intentional social media use.

Codex must preserve these product rules:

* no infinite feed
* no creator recommendations
* no discover page
* no algorithmic content
* no social graph
* no likes/comments inside Finite
* no engagement-maximising loops
* no shame-based productivity language
* no blocking the core flow with optional data
* no platform scraping for v0.1

Every feature should support:

```text
choose → open → finish → leave
```

## Platform Strategy Rules

Finite is currently being built in Expo React Native with TypeScript.

The likely first 1.0 public version is Android.

iOS may later be handled through:

* React Native iOS build
* PWA/web fallback
* SwiftUI rewrite

Because of this, Codex should keep core logic portable.

Codex should:

* keep domain logic out of screen components where practical
* keep storage implementation isolated
* keep linking implementation isolated
* keep data models simple
* keep business rules easy to translate to Swift later

Codex should not write Swift code unless explicitly asked.

## Code Quality Priorities

When tradeoffs happen, prioritise in this order:

1. Correct core behaviour
2. Simplicity
3. Speed of user flow
4. Maintainability
5. Visual polish
6. Extensibility

Do not over-engineer v0.1 for hypothetical future features.

## Performance Rules

Finite should feel faster than opening social media directly.

Codex should avoid:

* blocking loading screens
* unnecessary network calls
* heavy animations
* large dependencies
* slow startup logic
* image fetching in the core flow
* complicated state machinery

The app should render useful UI from local data immediately.

## Documentation Rules

Codex should update documentation when the task changes project behaviour, architecture, or scope.

Update relevant docs when:

* a milestone is completed
* a decision is made
* data model changes
* technical approach changes
* a feature is added
* acceptance criteria are clarified

Codex should not rewrite all docs unnecessarily.

Small doc updates are preferred.

## Git / Commit Rules

If Codex has access to git, it may create commits only if explicitly asked.

If asked to commit, Codex should use clear commit messages.

Preferred style:

```text
feat: add creator storage helpers
feat: build add creator screen
fix: normalise profile URLs before opening
docs: add roadmap and autonomy rules
```

Do not create large mixed commits containing unrelated changes.

## Running Commands

Codex should run relevant checks where possible.

Preferred checks:

```bash
npm install
npm run typecheck
npm run lint
npm test
npx expo start
```

Only run commands that exist in the project.

If a command does not exist, Codex should say so and not pretend it ran.

If a command fails, Codex should report the failure honestly and either fix it or explain what remains.

## Manual Testing Expectations

For UI tasks, Codex should provide manual testing steps.

Example:

```text
1. Start the app.
2. Open Add Creator.
3. Try saving with empty fields.
4. Add a valid creator.
5. Confirm the creator appears in Manage Creators.
6. Restart the app.
7. Confirm the creator persists.
```

Codex should not claim a flow works unless it was tested or clearly state it was not tested.

## Final Response Requirements

At the end of a task, Codex should respond with:

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

If checks were not run:

```text
Checks not run
- ...
```

## When To Stop

Codex should stop and ask for guidance if:

* the task conflicts with existing docs
* the requested implementation requires a major new dependency
* the data model seems insufficient
* the feature would change product direction
* the feature would require backend/auth/sync
* the feature would add scraping/API integrations
* there are multiple valid architecture paths with long-term consequences
* the project cannot run due to missing setup information

## Agent Behaviour Summary

Codex should behave like a careful junior developer:

* move quickly on clear tasks
* avoid scope creep
* respect product constraints
* ask before major decisions
* document important changes
* report checks honestly
* keep the app simple, fast, and finite
