---
title: "Wear OS Glucose Complications, Glyphrig Themes, and K3s Telemetry"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags:
  - devlog
  - wearos
  - kubernetes
  - automation
---

# Wear OS Glucose Complications, Glyphrig Themes, and K3s Telemetry

It's been a busy stretch across the local repos, GitHub, and Antigravity sessions—spanning everything from Wear OS watch faces and CGM data pipelines to Kubernetes telemetry and static site theming.

## Bridging FitDjinn and Noctiluca on Wear OS

The biggest cross-repo story is the new bridge between **FitDjinn** (`fitdjinn_main`) and **Noctiluca** (`noctiluca`):

- **FitDjinn (`05969b4`)** gained Wear OS Watch API tokens (`010_watch_api_tokens.sql`) and a dedicated `/api/watch/glucose` endpoint, backed by unit tests and dashboard token management. This builds on the recent **Abbott FreeStyle Libre 3 CGM** support and multi-database food search expansion (Canadian Nutrient File, USDA FNDDS, Open Food Facts, Nutritionix, Edamam, and FatSecret).
- **Noctiluca (`b6a1366`)** now ships a **Noctiluca Digital** watch face with a customizable rim slot and a `FitDjinnGlucoseComplicationService` in the companion app—meaning live glucose readings can now flow straight from FitDjinn onto the watch face.

## SpareTank v0.0.25: Smarter Watch Battery Alerts

Over in **SpareTank** (`127de1a` / `27be8d5`), `v0.0.25` tackles two quality-of-life issues for Wear OS battery monitoring:

- **No more false unplug reminders**: Bluetooth delta inference no longer overwrites authoritative Wear OS Data Layer state, and `WatchPowerReceiver` + `WakeLock` on `DataLayerListenerService` ensure instant unplug syncs.
- **Timed notification silencing**: Added a Dashboard Silence pill, a duration picker (15m–12h), a live remaining-silence banner, and a quick-silence button in Settings, all backed by regression tests.

## Glyphrig v0.4.0: Custom Themes & CLI Tooling

**Glyphrig** (`c96c648`) jumped to `v0.4.0` with a full customizable theme system, presets, and CLI theme tooling (`THEMING.md`, `theme.ts`, and tests), alongside fixes to Astro build staging so `.astro/.prerender` resolves dependencies cleanly. That's already powering bookmark syncs in `Tekromancy/bookmarks` (`joshuacox_bookmarks`).

## Axonwall v0.14.1 & Open Source

- **Axonwall** (`74d9005b`) bumped to `v0.14.1`, bringing live telemetry visualizations across all K3s console pages.
- **Eluvix** (`32f4d03`) tagged `v1.0.23`.
- **GitHub (`joshuacox`)**: Active PRs and issue discussions on `paperclipai/paperclip` (including PR `#21121`), plus bookmark pushes to `Tekromancy/bookmarks`.

## Automating This Log

Finally, this post itself was generated while setting up a new daily Antigravity automation (`daily-blog-post`) scheduled for 7:30 AM `US/Central`—so future dev logs can write themselves from the day's commits, GitHub events, and local sessions.
