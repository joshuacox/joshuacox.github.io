---
title: "Topology Studio, Gryphon Crests, and Silencing Medical Sirens: 24 Hours in the Lab"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags:
  - devlog
  - axonwall
  - kubernetes
  - glyphrig
  - wearos
  - android
  - eluvix
  - open-source
photo_url: /img/topology-gryphon-killibre-banner.png
description: "From Axonwall v0.15.0's NetBox, LibreNMS, and Topology Studio fabric editor to Glyphrig's Gryphon Chrome Web Store launch kit, Killibre's Libre 3 siren override, and a flurry of Eluvix and DeployCoop PRs."
---

If the past 24 hours across `/mnt/unreal/git`, GitHub, and Antigravity sessions had a theme, it would be **making complex systems behave—and look good doing it**. Between late-night packaging firefighting, waking up to rolling-reboot a fleet of firewalls, designing heraldic gryphon crests for a browser extension, and building an Android app purely to stop a medical sensor from screaming at full media volume, it's been one of those high-velocity stretches where half a dozen projects clicked together at once.

Here is the full transmission from the last 24 hours (`Nov 22 – Nov 23, 2026`).

---

## Axonwall: From CI Preflight Firefighting to `v0.15.0` Topology Studio

Axonwall had a marathon 24 hours—climbing from **`v0.13.1` → `v0.14.0` → `v0.14.1` → `v0.15.0`** in less than a single rotation of the Earth.

### 1. Taming BusyBox, Merged-`/usr`, and Missing Payloads (`v0.14.0`)
Yesterday evening started in the build trenches after Alpine and cloud-image CI builds went red for classic Linux-packaging reasons:
- **`534cf5bc`**: BusyBox `mktemp` didn't like a template with a trailing extension during the K9s `v0.51.0` download step.
- **`667b7dc2`**: The cloud-image `qcow2` build needed `rsync -aK` for `includes.chroot` so it wouldn't clobber the merged-`/usr` `/lib` symlink.
- **`60f75401`**: Rather than wait for GitHub Actions to catch packaging regressions 20 minutes into an ISO build, a new CI & packaging preflight suite (`scripts/ci-preflight.sh` + `ci-preflight.test.ts`) now validates Alpine/BusyBox assumptions, merged-`/usr` symlinks, and Next.js runtime payloads locally before anything goes red.

### 2. Ring-0 eBPF & Live K3s Telemetry (`v0.14.1`)
With the pipelines green, the UI got a massive observability upgrade:
- **eBPF Ring-0 Telemetry (`076a48f0`)**: Raw `BPF_LINK_GET_NEXT_ID` syscall link inspection in `axonwalld`, `/proc/net/softnet_stat` and socket parsing, an interactive **XDP packet flow Sankey diagram**, kernel TCP state machine funnel, L3/L4 traffic heatmap with fast-drop actions, and a `bpf_stats_enabled` runtime profiler with an icicle flame-strip.
- **K3s Console Visualizations (`809fec24`, `639d7058`)**: After squashing a crash on `/k3s/explorer` (caused by `null` `shortNames` in `K9sExplorerWorkbench`—now guarded with an error boundary), **5,820 lines** of live K3s telemetry landed across cluster, storage, workloads, and VOW pages (`K3sCapacityRings`, `K3sClusterArchitectureMap`, `K3sNodeBinPackingMap`, `K3sPulseCharts`, `K3sStorageVisuals`, `K3sTopologyMap`, `K3sVowVisuals`, and `K3sWorkloadsVisuals`).
- This morning, `v0.14.1` rolled out across the `axon` hosts with **sequential reboots** so the whole fleet wouldn't blink out simultaneously.

### 3. NetBox, LibreNMS, and Topology Studio (`v0.15.0`)
Then came the centerpiece commit of the day (`824eed6a` — **+20,159 lines across 68 files**), capped off by `axonwall.com` docs updates (`1b00645`) and the **`v0.15.0`** release bump (`0977c893`) right before 1:50 PM:
- **NetBox & LibreNMS Plugins**: Full Go engine backends (`netbox.go`, `librenms.go`), TypeScript compilers in `axonwall_lib`, console pages, webhook/sync/NetBox-sync API routes, and secret-redaction test suites.
- **Topology Studio (`/topology`)**: Inspired by Eluvix's node editor, `TopologyStudioWorkspace` turns multi-host Axonwall fabrics into an interactive node graph with WAN and edge-node primitives, cable cut-sheet drawers, path tracing, staged diffs, triad sync, and scenario management.

---

## Glyphrig: Custom Themes, Gryphon Crests, and Chrome Web Store Prep

**Glyphrig**—the selective bookmark-folder-to-Git-repo sync extension and static digital garden generator—sprinted from `v0.3.3` all the way to **`v0.4.2`**:

- **Astro Prerender & `piccolore` Fixes (`v0.3.3`–`v0.3.5`)**: Tracked down why `@glyphrig/cli` builds failed during `.astro/.prerender` resolution and fixed it by staging and `chdir`-ing inside the CLI package root (`34afe9e`, `cace880`), while actively syncing `joshuacox_bookmarks` (`55adc2a`) and bootstrapping `Tekromancy/bookmarks`.
- **Theme System & Digital Garden Port (`v0.4.0`)**: Shipped a customizable theme system with presets and CLI tooling (`c96c648`), and ported the theme from `tekromancy/blog` straight into `tekromancy/bookmarks`.
- **Chrome Web Store Kit & GitHub Pages Site (`v0.4.1`–`v0.4.2`)**: Generated **Concept D (Archival Ex Libris Gryphon Crest)** production icons (`16`–`128px`), `1280×800` store screenshots, promo tiles, `STORE_LISTING.md`, and `PRIVACY.md` (`46a9ec8`). To host the docs and privacy policy cleanly, `apps/githubio` launched as a dedicated Next.js static site deployed via GitHub Actions—complete with Google Search Console verification (`53d689d`).

---

## Wear OS & CGM Liberation: Killibre, FitDjinn ↔ Noctiluca, and SpareTank

Diabetes tech shouldn't sound like a smoke detector inside a submarine, and your watch shouldn't nag you about being unplugged when it's still sitting on the charger.

### Killibre: Overriding FreeStyle Libre 3's Direct Media Siren
Living locally in `/mnt/unreal/git/killibre` (built out in an intense late-night Antigravity session) is **Killibre** (`com.killibre.app`)—an Android app with one very focused mission:

1. **Permanent Audio Override**: Enforces `appops set <pkg> PLAY_AUDIO deny` against regional FreeStyle Libre 3 packages via **Shizuku**, **Root (`su`)**, or PC ADB (`scripts/killibre-adb.sh`).
2. **Civilized Alert Replacement**: Uses Android's `NotificationListenerService` (including Android 15–17's `RECEIVE_SENSITIVE_NOTIFICATIONS` permission handling) to replace the piercing siren with synthesized musical chimes (`Gentle Chime`, `Soft Pulse`, `Urgent Triad`), smooth volume escalation, **spoken TTS glucose readouts**, Quiet Hours with urgent-low overrides, and ongoing-status filtering so routine 1-minute updates don't false-trigger alarms.

### FitDjinn ↔ Noctiluca & SpareTank `v0.0.25`
- **FitDjinn (`05969b4`) + Noctiluca (`b6a1366`)**: Added Wear OS Watch API tokens (`010_watch_api_tokens.sql`) and `/api/watch/glucose` in FitDjinn, wired straight into the new **Noctiluca Digital** watch face (`FitDjinnGlucoseComplicationService`)—finished off this morning (`08:35` CST) by completing the watch token setup so live glucose sits on the lower-right rim gauge.
- **SpareTank `v0.0.25` (`127de1a`, `27be8d5`)**: Squashed false watch-unplug battery alerts (`WatchPowerReceiver` + `WakeLock` on `DataLayerListenerService`) and added timed notification silencing (15m–12h) with a live countdown banner.

---

## GitHub Dispatch: Eluvix, DeployCoop, Paperclip & Exercism Watcher

Outside the local flagship releases, GitHub and local Go/agent repos kept humming:

| Project | Activity | Highlight |
| :--- | :--- | :--- |
| **`Eluvixrouter/eluvix`** | `v1.0.23` (`32f4d03`) & **PR #36** merged | Added a recall-only `ClaudeMemContextProvider` (`thedotmack/claude-mem` `v16.1.0`) in `router-core` that turns loopback search results into `L1` memory blocks. |
| **`DeployCoop/vigilant-octo-waffle`** | **PRs #144, #145, #146** merged | Added **Multica** (chart `0.11.1`) as an ArgoCD catalog app, wired **Phase 1 studios** (`guard`, `drift`, `previews`, `fleet`, `secretops`, `migrate`) to real backend systems, and rolled up Dependabot PRs `#139`, `#141`, and `#143`. |
| **`paperclipai/paperclip`** | Pushes + PR hygiene | Pushed `fix/22345-skill-sync-actor-leak` (`25ff235`) and `fix/15776-disposition-repair-attempts` (`85be741`) to `joshuacox/paperclip`, closed superseded PR `#18112`, and triggered `@greptile review` on PR `#21121` (`Adding agy (antigravity)`). |
| **`exercism_watcher`** | Local Go cleanup | Hardened the CLI event loop, added tests (`detect_test.go`, `exercism_watcher_test.go`), and refreshed build/CI configuration. |
| **`joshuacox.github.io`** | Site & automation | Resolved merge conflicts in `layout.tsx` and `Header.tsx` (`766abe2`), updated Tailwind styling (`6efd538`), regenerated RSS/sitemap (`485ac9a`), and set up the `daily-blog-post` Antigravity automation. |

---

## Until Tomorrow's Transmission

From ring-0 eBPF flame-strips and multi-host NetBox/LibreNMS fabric graphs to Ex Libris gryphons and polite TTS glucose chimes, it's rare to see infrastructure, browser tooling, and personal wearables all move forward in the same 24-hour window. Time to let the sequential host reboots settle—and see what tomorrow's log brings.
