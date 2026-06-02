# docs/UX_PRINCIPLES.md

# UX Principles

Finite must feel fast, finite, and intentional.

The user should never feel like they have opened another attention-hungry app.

## 1. Finite Must Be Faster Than the Bad Habit

The main competitor is not another productivity app.

The main competitor is muscle memory.

If opening Instagram directly feels faster than opening Finite, users will bypass Finite.

Therefore:

* home screen should load quickly
* start catch-up should be one tap
* core actions should feel instant
* no unnecessary onboarding friction
* no blocking loading screens
* no slow transitions
* no unnecessary confirmation dialogs
* no feature should make the core flow slower without a strong reason

Target internal action feel:

```text
Tap → immediate response
```

## 2. No Blocking Load States

Finite should render useful UI immediately from local data.

The app should not block the user because optional data is loading.

Core data:

* creator display name
* platform
* profile URL
* last checked state
* queue position

Optional data:

* avatar
* profile picture
* external metadata
* latest post count
* platform-specific enrichment
* stats beyond the current session

Optional data must never block the core catch-up flow.

## 3. Instant Structure, Lazy Decoration

The user should see the structure of the app immediately.

For example:

```text
[grey avatar] @creator
              Instagram · last checked 2 days ago
```

If an avatar or extra detail is available later, it can appear after the rest of the UI is already usable.

Do not use large spinners for creator cards.

Prefer:

* initials
* platform icons
* grey avatar placeholders
* stable skeleton spaces

Avoid:

* layout shifts
* full-page loading screens
* blocking network requests
* flickering content

## 4. No Infinite Surfaces

Finite must not contain:

* infinite feeds
* endless scroll pages
* creator discovery feeds
* trending pages
* recommended creators
* suggested content loops
* autoplay video feeds

Scrolling is acceptable for normal lists, such as the user’s saved creators, but those lists must be bounded by user-added data.

Finite should never create an algorithmic content surface.

## 5. One Screen, One Job

Each screen should have a clear purpose.

Home:

```text
Start a catch-up session or manage creators.
```

Add Creator:

```text
Add one creator.
```

Manage Creators:

```text
Review or edit saved creators.
```

Catch-up:

```text
Open this creator, then mark done or skip.
```

Done:

```text
Give closure and encourage leaving.
```

Avoid screens that mix too many jobs.

## 6. Completion Is the Reward

Most apps reward continued use.

Finite rewards completion.

The Done screen is important because it gives the user a sense of closure.

The Done screen should make it clear:

```text
You are finished.
You do not need to keep checking.
You can leave now.
```

Example copy:

```text
You’re caught up.

You checked 7 creators.
Now leave before the algorithm finds you.
```

## 7. Support Creators

Finite should not steal engagement from creators.

When a user opens a creator, Finite should open the real profile, channel, or page in the original platform/app/browser.

Users can then:

* watch
* like
* comment
* share
* subscribe
* follow
* interact normally

Finite’s job is to help the user arrive intentionally and leave afterwards.

## 8. Calm but Direct Tone

Finite should not sound like:

* a corporate productivity tool
* a medical app
* a parental control app
* a guilt-trip machine
* a fake wellness startup

Finite should sound:

* calm
* direct
* lightly witty
* human
* minimal
* firm when needed

Good copy:

```text
Keep up. Then leave.
Your queue is finite.
Open what you came for.
You’re caught up.
Now leave before the algorithm finds you.
```

Avoid copy like:

```text
You failed your focus goal.
You are addicted.
Your productivity score decreased.
Unlock premium to regain control.
```

## 9. No Shame-Based Design

Finite exists because modern apps are designed to capture attention.

The user is not stupid for getting pulled in.

Avoid shame, guilt, and moralising.

Use language that gives agency:

```text
Choose what you came for.
Finish your queue.
Leave on purpose.
```

## 10. The App Should Not Become the Problem

Finite should not become another app users compulsively check.

Avoid:

* unnecessary notifications
* streak pressure
* social comparison
* public leaderboards
* random rewards
* engagement bait
* “come back now” prompts
* artificial scarcity
* infinite analytics

If a feature makes users spend more time inside Finite without helping them leave social media faster, it probably does not belong.

## 11. Default to Manual, Reliable, and Transparent

For v0.1, Finite should not pretend to know more than it does.

If the app cannot reliably detect whether an Instagram or TikTok creator posted, it should not fake it.

Manual creator lists and last-checked dates are acceptable.

Reliability beats fake intelligence.

## 12. Progressive Complexity

The first-time user should not need to understand every feature.

The initial experience should be:

```text
Add a creator.
Start catch-up.
Open profile.
Mark done.
Finish.
```

Advanced features should appear later only when needed.

## 13. Accessibility and Readability

Finite should use:

* large tap targets
* readable font sizes
* strong contrast
* simple layouts
* clear button labels
* minimal clutter

The app should be usable when the user is tired, distracted, or already fighting the urge to scroll.

## 14. Core Interaction Standard

The catch-up screen should be extremely simple.

Minimum elements:

```text
Progress: 2 of 7
Creator name
Platform
Last checked date

[Open profile]
[Mark done]
[Skip]
```

No extra content should compete with the main action.

## 15. Design Mantra

```text
Finite is not a feed.
Finite is an exit.
```
