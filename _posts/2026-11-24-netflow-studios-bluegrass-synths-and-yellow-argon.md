---
title: "NetFlow Studios, Bluegrass Synths, and Fighting 'Yellow Argon': 24 Hours in the Lab"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags:
  - devlog
  - axonwall
  - netflow
  - godot
  - gamedev
  - procedural-audio
  - tekromancy
  - glyphrig
  - android
  - kubernetes
photo_url: /img/netflow-synths-yellow-argon-banner.png
description: "Axonwall v0.15.1 ships a 5-phase NetFlow/IPFIX/sFlow Analytics Studio, three games simultaneously get procedural symphonies and visual overhauls, Tekromancy adopts the Sovereign Telemetry Deck, Glyphrig spars with Chrome Web Store's 'Yellow Argon' bot, and Killibre gets wireless ADB DND surgery."
---

If yesterday's devlog was about making complex systems behave, the past 24 hours (`Nov 23 – Nov 24, 2026`) were about **giving everything a pulse—and a procedural soundtrack**.

Somewhere between yesterday afternoon and just past midnight, a firewall grew a full Kentik-style NetFlow/IPFIX/sFlow analytics studio, *three* completely different games simultaneously received synthesized symphonies and visual glow-ups, a Chrome Web Store bot accused a bookmark extension of a mysterious crime called **Yellow Argon**, a Pixel 7a underwent wireless ADB Do-Not-Disturb surgery, and 28 Helm charts began their great migration upstream.

Here is the full midnight transmission from `/mnt/unreal/git`, GitHub, and the Antigravity trenches.

---

## Axonwall `v0.15.1`: Five Phases of NetFlow / IPFIX / sFlow in One Sitting

It started innocently enough: build a `netflow-collector` plugin for Axonwall. Then came the four most dangerous words in software engineering—*"can you suggest more improvements or enhancements?"*—immediately followed by *"phase 1 --> 5 directly on top"*.

The result landed in **`81bd9212`** (**+16,933 insertions across 64 files**), followed by a sweeping documentation & OpenAPI refresh (**`c5dab885`**, plus `axonwall.com` `47fcd69` exporting 33/33 static pages) and the **`v0.15.1`** release tag (**`5a3a27d4`**) at `00:10` CST:

- **Wire-Speed Pure-Go Collector (`apps/axonwalld/engine/netflow_*.go`, `CGO_ENABLED=0`)**: Full decoding for **NetFlow v5**, **NetFlow v9**, **IPFIX (`RFC 7011`)** over UDP, TCP, and **TLS 1.3 / optional mTLS**, plus **sFlow v5** sample extraction. Backed by Linux `SO_REUSEPORT` multi-worker socket scaling and a UDP fan-out replicator (with optional `CAP_NET_RAW` source-IP spoofing for downstream SIEMs).
- **Dual-Stack IPFIX Self-Export & Kernel NPM Telemetry (`netflow_sockdiag.go`)**: Emits IPFIX **Template 256 (IPv4)** and **Template 257 (IPv6)** complete with NAT/CGNAT Information Elements (`225`–`228`), VLAN/interface indexes, and live kernel TCP RTT and retransmit metrics pulled straight from Linux `NETLINK_SOCK_DIAG`.
- **Zero-CGO Enrichment Pipeline (`netflow_mmdb.go`, `netflow_enrich.go`)**: A pure-Go MaxMind `.mmdb` v2 reader with on-demand GeoLite2/DB-IP updates, live FRR BGP RIB longest-prefix-match (AS-Path / Next-Hop), Kubernetes K3s Pod/Namespace/Service attribution, Linux `conntrack` NAT mapping, reverse DNS, SNMP `ifAlias` tagging, and Suricata/CrowdSec threat correlation.
- **Rollups, ClickHouse Pushdown, Baselines & Fleet Federation**: Persisted `1m` / `5m` / `1h` Zstd rollups, parameterized FQL-to-ClickHouse SQL pushdown (`netflow_clickhouse_sql.go`), Prometheus exposition at `/api/v1/netflow/metrics`, **95th/99th-percentile capacity & billing reports** (CSV/Markdown/JSON), **168-slot (`7d×24h`) EWMA/Z-score anomaly baselines**, and multi-host **Fleet Federation** queries across `topology.peers`.
- **5-Tab Analytics Studio (`/reporting/netflow`)**: `FqlInputBar` autocomplete, interactive time-brush zoom, bidirectional biflow stitching, Source×Dest & Port×Time heatmaps, an offline SVG `GeoTrafficMap`, SSE live tail (`/api/v1/netflow/stream`), 11 secret-redacted API routes, `axonwallctl netflow` + TUI hooks, and 1-click pivots straight to XDP Drop, Packet Capture, Firewall Alias, and Topology Studio.

And because nobody in this lab sleeps while a tag is still warm, seven minutes later (`00:17` CST) the next Axonwall thread was already spinning up to refactor the `/ai` console page into a modular plugin.

---

## Midnight Game Dev Jam: Zero-Asset Symphonies Across Three Worlds

While firewalls were crunching IPFIX packets in one terminal, three separate game codebases went through a synchronized late-night audio and visual renaissance—none of them using a single static `.wav` or `.ogg` file checked into git.

### 1. BokBot Chicken TD (`bokbot/bokbot-godot-td1`): Rescuing a Silent Barn
First came **`bafc9c9`** (`20 files, +855/-140`), giving chickens, goats, human defenders, turrets, traps, beehives, and the Bestiary Barn UI a complete procedural animation overhaul via `CreatureAnimator.gd`.

Then an audio audit turned up three gloriously bizarre bugs lurking in the coop:
1. **`MusicManager.gd`** dutifully tracked five musical states (`day_pastoral`, `night_defense`, `morning_peace`, `somber_sunset`, `boss_showdown`)—and **never assigned a stream or called `.play()`**. Meanwhile, `MainMenu.gd` and `WorldMap.gd` were calling a `play_track()` method that didn't exist.
2. **40+ call sites** were passing pitch multipliers (`0.94–2.5`) into the `volume_db` parameter of `SoundManager.play()`, quietly cranking up the loudness every time a sound tried to shift pitch.
3. **11 procedural synths** were computing `sin(TAU * lerp(f0, f1, p) * t)` instead of integrating phase continuously, creating glorious DSP glitch-sweeps instead of clean laser/explosion/whistle ramps.

Commit **`a27c071`** (`71 files, +2,919/-1,041` at `00:08` CST) fixed *all of it* in a 3-phase procedural audio overhaul:
- A proper bus mastering chain (`Master` limiter at `-0.5 dB`, `SFX` compressor, `Music`/`Ambience` low-pass filters for cozy pause-menu muffling).
- 20 non-spatial + 16 spatial `AudioStreamPlayer2D` voices with per-SFX cooldowns and 4-tier priority voice stealing so bullets never clip a boss stinger or morning rooster crow.
- Continuous 3-layer weather/day/night ambience (`loop_day_meadow`, `loop_night_crickets`, `loop_rain`, wind-modulated gusts, urban hum, wetlands) and real thunderclaps instead of firing a `"rocket"` sound on lightning strikes.
- An expanded **`KarplusStrongSynth.gd`** (+529 lines) composing **5 bar-aligned multi-stem adaptive tracks** across five biome musical profiles (*Heartland Bluegrass*, *Bayou Blues*, *Mesa Western*, *Alpine Chimes*, and *Metro Synth-Folk*)—plus finally putting actual audio on **Tractor Radio** stations `1120 AM` and `1450 AM`.

Before the commit message even settled, *"full phase, all of it"* kicked off the next graphics & animation pass.

### 2. Pixie Patrol (`PixiePatrolGodot1`): 37 Pre-Baked Synths & a 10-Biome Lute
Over in Godot fairy-defense land, **`2231239`** (`14 files, +1,325/-252`) dropped an equally ambitious procedural audio overhaul:
- **`AudioWavBuilder.gd`** synthesizes **37 pre-baked 44.1 kHz 16-bit mono WAV SFX clips** at boot.
- **`SoundSynth.gd`** jumped to a **12-voice polyphonic stereo pool** with cooldowns and spatial panning.
- The adaptive music sequencer expanded to **16 bars across 10 biome profiles**, featuring Karplus-Strong lute and harp plucks, celesta chimes, clock ticks, tambourine, and a town bell—all backed by headless procedural audio tests.
- Right past midnight (`00:06`), a storybook-fantasy visual upgrade (sub-pixel fairy wing flutter, secondary cloak motion, and animation polish) went straight into the oven.

### 3. Pianomancer (`pianomancer`): Arcane Conservatory Polish & Acoustic Dreams
Not to be left out of the midnight jam, **Pianomancer** wrapped a sweeping 40-file graphics and animation upgrade across its React/TypeScript conservatory: a three-tier visual quality engine (`low` / `balanced` / `ultra` in `graphicsSettings.ts`), live audio FFT visuals, `MasterPortrait.tsx`, `GradeStamp.tsx`, `TitleArt.tsx`, and `conservatory-arcane.css`. And at `00:20` CST, *"all of them"* greenlit the next wave—including **real-time acoustic piano microphone pitch detection** (`AudioWorklet` / YIN) and **MIDI-Out** routing for light-up guide keyboards.

---

## Tekromancy & Namgen: Sovereign Telemetry Styling & The Naming Oracle

The writing and brand-craft side of the workspace kept pace with the systems work:

- **Tekromancy Blog (`tekromancy/blog`)**:
  - **`909cf2d`** (`27 files, +2,354/-1,393`): Formalized `PRODUCT.md`, `DESIGN.md`, and `.impeccable/design.json` into the **Sovereign Telemetry Deck** design system and polished every Astro component and page to match.
  - **`4e4eda0`**: Channeled the Axonwall NetFlow build straight into a 466-line deep-dive draft—*"Flow Telemetry Under Fire: NetFlow v5/v9, IPFIX (RFC 7011), and sFlow v5 Collector Internals on Linux"*—covering `SO_REUSEPORT` sharding, `recvmmsg()` batching, stateful IPFIX template graphs, and eBPF inner-overlay export in Kubernetes. Better yet, drafting it served as the live test run for a new **Tekromancy Daily Deep Dive** automation scheduled for 7:00 AM daily.
- **Namgen (`85079aa` on branch `6264`)**:
  - Gave the **Namespace Naming Oracle** a flagship interactive showcase on `apps/githubio` (`OracleShowcase.jsx`, +372 lines), highlighting its 4-stage naming pipeline and five brand archetypes (*Arcane / Cyberpunk*, *Classical Etymology*, *Punchy Portmanteaus*, *Functional Minimalist*, and *Sovereign Neologisms*).

---

## Real-World Friction Patrol: "Yellow Argon" & Wireless ADB Surgery

Shipping software into the real world always produces at least two plot twists:

### Glyphrig vs. The Chrome Web Store's "Yellow Argon"
After yesterday's victorious Gryphon Crest launch kit and `v0.4.2` push, Google's Chrome Web Store review team sent back a rejection—not for code, permissions, or artwork, but **Violation Reference ID: `Yellow Argon` (Keyword Spam)**. The offense? Listing six static hosts (`GitHub Pages, GitLab Pages, Codeberg, Cloudflare Pages, Netlify, or Vercel`) in a single comma-separated sentence in the Detailed Description. `STORE_LISTING.md` got swiftly de-spammed and tightened so the gryphon can clear customs on the next upload.

### Killibre Live Field Diagnosis on Pixel 7a
When glucose alerts still weren't coming through on the actual phone last night, connecting to the **Pixel 7a over wireless ADB** and digging into `dumpsys audio` and `dumpsys notification` gave a crisp verdict:
- **The good news**: `PLAY_AUDIO: deny` was doing its job—logs showed the Libre 3 app trying to blast `STREAM_MUSIC` sirens every five minutes and getting cleanly muted every single time.
- **The blockers**: All three Libre notification channels were still toggled off (`mImportance=0`), so Killibre's `NotificationListenerService` saw zero incoming events, and Android Do Not Disturb was suppressing the replacement channel.
- **The fix**: Shipped `killibre_alert_control_v2` with `setBypassDnd(true)` in `NotificationChannels.kt`, wired `cmd notification allow_dnd com.killibre.app` into `scripts/killibre-adb.sh`, built and installed the updated APK, and verified `mImportance=4` + `mBypassDnd=true` live on the device.

---

## GitHub & Workspace Dispatch: Chart Waves, Paperclip & Midnight Clones

| Project | Activity | Highlight |
| :--- | :--- | :--- |
| **`DeployCoop/vigilant-octo-waffle`** | **PR #147** merged, **PR #148** opened | Great Helm chart migration underway: **Wave 1** repointed 9 apps to pinned upstream charts, and **Wave 2** (`feat/charts-wave2-upstream`) just opened at `00:20` CST to repoint 19 more apps upstream. |
| **`DeployCoop/urban-disco`** | **PR #4** opened & merged | Retired the local Wave 1 chart copies (`chore/remove-wave1-charts`) in lockstep now that they're served directly from upstream. |
| **`joshuacox/paperclip` & `paperclipai/paperclip`** | Branches + PR review | Pushed `fix/15998-issue-reference-quadratic`, `fix/16930-hermes-cost-nan`, and `agy` updates, plus joined review discussion on millisecond-precision finaliser lease expiry. |
| **`Tekromancy/bookmarks` & `joshuacox_bookmarks`** | Automated syncs | Glyphrig quietly keeping git-backed bookmark archives synced across repos while waiting on Chrome Web Store review. |
| **`CrewsAIdarr` & `polyglot-benchmark`** | Freshly pulled (`00:03`–`00:07` CST) | Cloned into `/mnt/unreal/git` just past midnight for CrewAI coder experiments and polyglot benchmarking across Rust, Python, JS, Java, Go, and C++. |

---

## Until Tomorrow's Transmission

From zero-CGO MaxMind readers and 168-slot NetFlow Z-score baselines to Karplus-Strong bluegrass banjos, fairy-wing sub-pixel flutter, and dodging Chrome Web Store keyword traps named after noble gases, the past 24 hours refused to stay in a single lane—and that's half the fun. Let's see how many of those midnight *"all of them"* prompts have landed by tomorrow's log.
