# README.md

# Finite

**Scroll like you mean it.**

Finite is a mobile app for intentional social media use.

It helps users build a finite catch-up queue of creators, accounts, channels, or profiles they actually care about. Instead of opening Instagram, TikTok, YouTube, X, or Reddit and getting pulled into algorithmic feeds, users open Finite, work through a short queue, open each creator in the original app or browser, mark them done, and leave.

Finite is not a social feed.

Finite is an exit.

## Core Idea

People often open social media for a specific reason:

* to check one creator
* to watch one channel
* to see if a friend posted
* to catch up with a specific account
* to follow something they intentionally care about

But once they open the platform, infinite scroll, recommendations, For You pages, Explore pages, Shorts, Reels, and suggested content pull them away from what they came for.

Finite solves this by turning social media use into a finite ritual:

```text
Add creators -> Start catch-up -> Open profile -> Swipe up -> Finish queue -> Leave
```

## Philosophy

Finite does not try to replace social platforms.

Finite sends users to the original apps and websites so creators still receive views, likes, comments, shares, and platform engagement.

The goal is not to stop users from using the internet.

The goal is to help them use it deliberately.

## Tagline

**Scroll like you mean it.**

## Current Status

v0.1 prototype in development.

The first prototype is local-first and does not use a backend, authentication, cloud sync, scraping, or platform APIs.

## v0.1 Scope

The first working version should allow the user to:

* add a creator manually
* choose a platform
* enter a handle or custom profile URL
* view saved creators
* delete creators
* start a catch-up queue
* open each creator profile externally
* mark each creator as done or skipped
* reach a completion screen
* persist creator and check-in data locally

## Out of Scope for v0.1

Do not build these yet:

* backend
* accounts/login
* cloud sync
* payments
* subscriptions
* platform API integrations
* Instagram/TikTok scraping
* creator recommendations
* infinite feed
* social features
* AI summaries
* app blocking
* push notifications

## Tech Stack

* Expo
* React Native
* TypeScript
* Local device storage
* External linking for creator profile URLs

## Running Locally

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

## Product Rule

Every feature must support one of these goals:

1. Help users choose what they came for.
2. Help users open it quickly.
3. Help users finish.
4. Help users leave.

If a feature encourages users to spend more time inside Finite for no clear reason, it probably does not belong.
