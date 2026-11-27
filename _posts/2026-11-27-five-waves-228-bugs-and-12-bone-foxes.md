---
title: "Five Waves at Once, 228 Squashed Bugs, 12-Bone Painted Foxes, and a 2-Character Helm Fix"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags:
  - devlog
  - axonwall
  - security
  - ebpf
  - godot
  - gamedev
  - glyphrig
  - kubernetes
  - ai-agents
photo_url: /img/2026-11-27-five-waves-228-bugs-and-12-bone-foxes-banner.jpg
description: "An 8-track Axonwall audit uncovers 228 verified bugs and remediates all 5 waves in one 379-file mega-commit (+25,910 / -6,781) before wrestling CI to ship v0.16.3; PixiePatrol locks in an Arthur Rackham × Brian Froud art style with a 12-bone 2D fox rig (no 3D required); plus Glyphrig v0.5.1, Killibre clinical alert hardening, Eluvix MCP Phase (e), and a legendary 2-character Helm fix."
---

If [yesterday's dispatch](/blog/2026/11/26/port-knocking-post-quantum-tunnels-gryphon-v050-and-butterfly-chasing-hens/) was about shipping bold new features across five rolling production routers, the past 24 hours (`Nov 26 08:41 CST → Nov 27 08:29 CST`) were about turning the adversarial microscope up to eleven—and then teaching a painted fairy-tale fox how to trot without touching a single 3D polygon.

Across **8 repositories**, **6+ active Antigravity sessions**, and a full multi-agent parallel remediation swarm, the ledger reads like a fever dream of systems security and indie game craft:

- **Axonwall** ran an **8-track parallel deep-dive audit** that turned up **228 verified bugs (`33 Critical`, `108 High`, `87 Medium/Low`)**, answered with six fearless words—***"lets do all 5 waves at once"***—landed a single **379-file mega-commit (`a58005b6`, `+25,910 / -6,781`)**, survived a **3-round CI ISO wrestling match**, and tagged **`v0.16.3`** this morning at `08:25 CST`.
- **Pixie Patrol** evolved live through three art-direction rounds—settling on a luminous **Arthur Rackham × Brian Froud / Amy Brown** blend—and answered *"do we need to upgrade to 3D?"* with a resounding **no**, shipping a **12-bone 2D skinned fox mesh** and **3 custom Godot deformation shaders** at **`39/39` headless test scenes green**.
- **Glyphrig** closed yesterday's cliffhanger CI failure in **4 minutes flat** and tagged **`v0.5.1`** (`75/75` tests green under live GitHub Actions env vars), while **Killibre** hunted down 3 high-stakes clinical alert bugs in its Libre 3 Android audio-override engine.
- On **GitHub**, **Eluvix** merged **PR #37** (`+4,073 / -34`), opened **PR #38** (`+936 / -120`), and merged **PR #39** (closing an ungated MCP memory write path behind a forced-strength T5 guard); **DeployCoop** merged Wave 3 Helm pinning (**PR #149**) plus the all-time hall-of-fame **2-character boolean unquote fix (`PR #150`)**; **Tekromancy** drafted an 821-line dark-port `nftables`/SPA/XDP deep dive; and **10 Prometheus Operator CRDs (`v0.95.2`)** landed server-side on the cluster.

Strap in—here is the visual breakdown of the past 24 hours.

![24-Hour Engineering Telemetry Pulse across Axonwall, PixiePatrol, Glyphrig, Killibre, Eluvix, DeployCoop, Tekromancy, and Kubernetes](/img/2026-11-27-24h-telemetry-pulse.svg)

---

## Act I: *"Deep Dive Bug Hunt Everywhere"* → 228 Bugs, 5 Waves at Once & Axonwall `v0.16.3`

### 1. The 8-Track Parallel Audit (`08:42–09:11 CST`)

Barely minutes after `v0.16.2` had settled onto all five appliances, the Axonwall session opened with four words guaranteed to humble any codebase:

> *"deep dive bug hunt everywhere"*

Instead of skimming surface lints, the orchestrator spun up **8 parallel audit tracks** spanning Go daemons, C eBPF/LSM programs, TypeScript compilers, Next.js APIs & React UI, the 29-tool MCP controller, Terraform, Helm/Docker/ISO updaters, and `vigilante_lib`/`nastymap`—verifying every single finding against live source, `unshare -rn nft -f -`, `llvm-objdump`, Linux UAPI headers, and lessons fresh off yesterday's fleet reboot.

Twenty-nine minutes later, the scorecard hit the screen: **228 verified findings (`33 Critical`, `108 High`, `87 Medium/Low`)**. Some of the criticals were genuine jaw-droppers:

- **`nftables` NFLog Rate-Limit Verdict Bypass**: Putting `limit rate 50/second log ... drop|accept` in a single rule meant above 50 packets/sec, evaluation stopped at `limit rate`—logged `block` rules *stopped dropping attacks* while logged `pass` rules *dropped legitimate traffic*! Fixed by splitting logging into a non-terminating rule ahead of an unconditional verdict.
- **Suricata IPS `NF_ACCEPT` Forward Bypass**: Placing `queue num 0-3 bypass` at the top of `chain forward` with `nfq.mode: accept` issued a terminal verdict that bypassed CrowdSec, GeoIP, `@blocked_ips`, VNIC security groups, user rules, and even `policy drop`!
- **Live Linux 6.12 BPF-LSM Verifier Failure + Silent NFLOG**: All 5 BPF-LSM hooks failed the Linux 6.12 verifier, the NFLOG netlink UAPI encoder was dropping 100% of packets, and the IPFIX parser was vulnerable to a 3.6 MB/packet OOM DoS.
- **Auth, RBAC & Decoy Traps**: Scoped `axw_svc_*` service tokens could bypass scope checks to self-escalate to wildcard admin, Topology's *"Stage Peer"* could overwrite a remote peer with the local host's `DesiredState`, and a decoy canary in `vigilante_lib` accidentally granted real `cluster-admin`!
- **Live Rollout Veterans**: Both bugs caught during yesterday's midnight fleet rollout—the single-NIC LAN `dhcpcd -G` default-gateway strip and the ZFSBootMenu live K3s `etcd` WAL rewind on `saxon`—went straight into the kill list alongside a Python `scrypt` salt mismatch that broke Vault/K3s login.

![Axonwall v0.16.3 8-Track Audit Matrix, 228 Findings Breakdown, 5-Wave Swarm, and 3-Round CI ISO Gauntlet](/img/2026-11-27-axonwall-8track-5wave-matrix.svg)

### 2. *"Lets Do All 5 Waves at Once"* (`09:28–15:31 CST`)

Faced with a 5-wave remediation roadmap across a polyglot monorepo, Joshua didn't blink:

> *"lets do all 5 waves at once"*

A multi-stage parallel worker swarm sliced the repository into disjoint ownership boundaries (`Slices A, B, C, G, H` → `Batch 1` → `Batch 2` → `Stage 3` integrated Go/TS/eBPF/Helm verification). Every Go daemon (`axonwalld`, `axonwall-satellite`, `axonwall-console`, `terraform-provider-axonwall`), every TypeScript package (`@axonwall/lib` `326/326` tests, `axonwall-controller` `121/121` tests, `vigilante_lib`, `nastymap`), and the recompiled `lsmguard_bpfel.o` bounds check came back green.

At `15:31 CST`, **`a58005b6`** (`fix: comprehensive deep-dive bug remediation across all 5 waves`) hit `main`:

> **`379 files changed, 25,910 insertions(+), 6,781 deletions(-)`**

### 3. The 3-Round CI ISO Wrestling Match → `v0.16.3` (`16:39 CST → 08:25 CST`)

Naturally, GitHub Actions had three classic infrastructure bosses waiting at the finish line before allowing a clean release tag:

| Round | Time (CST) | Commit | The Boss Fight | The Fix |
| :---: | :---: | :--- | :--- | :--- |
| **1** | `16:40` | `81215569` | Unified `axonwall-debian13-amd64.iso` blew past GitHub's `1.9 GiB` (`2,040,109,465 B`) asset limit because `build-iso.sh` staged a ~75 MB `k3s` binary meant only for the `k3s-storage` flavor. | Dropped `stage_pinned_k3s` from the unified ISO → shrank cleanly to **`1,172,111,360` bytes (~1.09 GiB)**! |
| **2** | `17:12` | `b75c8702` | `build-iso.sh` succeeded under `sudo`, yet `Enforce Release Asset Size Limits` reported `found_iso=0`—the non-root `runner` couldn't list/read root-owned `packaging/iso/output/`! | Added `chmod 0755` on `OUTPUT_DIR` and `chmod 0644` on the `.iso` artifact right after moving it into place. |
| **3** | `17:54` | `f90d0af7` | `Compute Checksums` died with exit code `1` under `bash -e` because `[ -f "$iso" ] && [ ! -s "${iso}.sha256" ] && sha256sum ...` evaluated to `1` when an Alpine `.sha256` already existed! | Replaced the fragile `&&` short-circuit chain with an explicit `if [ -f "$iso" ] && [ ! -s "${iso}.sha256" ]; then ...; fi`. |

With every CI check green and `pnpm test` spotless across the stack, **`Axonwall v0.16.3`** (`6e26600f`) was tagged and pushed this morning at **`08:25 CST`** via `scripts/release-tagger.sh patch --push`.

---

## Act II: Pixie Patrol — Arthur Rackham Meets Brian Froud & a 12-Bone 2D Fox Rig

While the Axonwall worker swarm was chewing through 228 bugs in another window, **Pixie Patrol (`PixiePatrolGodot1`)** underwent an unforgettable artistic transformation (`09:49–12:37 CST`).

### 1. Three Rounds of Live Storybook Art Direction

Joshua asked to elevate the game beyond procedural `draw_circle` / `draw_polygon` shapes into painted illustrated sprites. Rather than blindly generating an entire roster, the session ran three rapid visual taste tests on three anchor units (**Pixie Scout treehouse tower**, **Red Fox enemy**, and **Sylvan Warden avatar**):

1. **Round 1 — Brian Froud / Amy Brown**: Warm folklore charm and bright jewel tones.
2. **Round 2 — Pure Arthur Rackham** (*"can you add a bit more arthur rackham fairy style?"*): Fine sepia pen-and-ink crosshatching, crooked gnarled roots, muted olive/ochre/russet watercolor washes, and slender Edwardian storybook silhouettes.
3. **Round 3 — The Locked-In Blend** (*"lets bring a bit more of the brighter colors from the amy brown / brian froud"*): Rackham's intricate sepia ink lines and twisting oak roots fused with Froud/Brown emerald, sapphire, magenta, and amber glows—plus glowing mushrooms and bright rim light so every unit pops off the grass!

Once Joshua called **"lock in this blend, and lets test on the battlefield"**, a reusable `tools/cutout_sprites.gd` tool stripped the flat backgrounds into transparent PNGs, `SpriteArt.gd` wired graceful per-unit fallback (so painted and legacy units coexist smoothly), and `CaptureSpriteTest.tscn` rendered live day and **Starlight Night** combat scenes.

![PixiePatrol Live Godot Battlefield Comparison: Sunlit Day vs. Starlight Night with Painted Sprites, Glowing Treehouse Mushrooms, and Rim-Lit Foxes](/img/2026-11-27-pixiepatrol-day-night-battlefield.jpg)

### 2. *"Do We Need to Upgrade to 3D or Can We Animate?"*

Looking at the static painted sprites bobbing down the road, Joshua asked the million-dollar indie game dev question:

> *"while the drawings look good they are not animated in that the limbs do not move, do we need to upgrade to 3D or can animate?"*

Moving to 3D would have destroyed the hand-inked Edwardian storybook magic. Instead, we built a **Hybrid 2D Animation Pipeline** directly inside Godot 4—combining **2D skeletal mesh skinning** for creatures with **UV-masked deformation shaders** for towers and winged avatars:

![PixiePatrol Hybrid 2D Animation Pipeline: 12-Bone Quadruped Sprite Rig, Tower Sway Shader, and Sylvan Warden Wing-Beat Shader](/img/2026-11-27-hybrid-2d-rig-architecture.svg)

- **Red Fox — 12-Bone Skinned `Polygon2D` (`QuadrupedSpriteRig.gd` + `painted_unit_rim.gdshader`)**:
  - Subdivides the single painted PNG into a `32×24` alpha-masked mesh rigged to **12 bones** (`torso`, `head`, `tail_base`, `tail_tip`, plus two-segment `upper`/`lower` chains for all four legs).
  - The secret sauce? **Split leg vertex pools** below the torso air gaps (`split_rows: {PART_LEG_BL: 16, PART_LEG_BR: 16, PART_LEG_FL: 18, PART_LEG_FR: 18}`) so legs swing freely in a full diagonal trot gait with **zero webbing or texture tearing**!
  - Even better, the skeleton connects straight into the existing step timer and behavioral AI—automatically matching slows, freeze-stops, hit-flashes, and expressive poses (`howl`, `sniff`, `lunge`, `shake`), plus warm night contour rim lighting!

![Red Fox 2D Skeletal Mesh (QuadrupedSpriteRig) — 4-Phase Diagonal Trot Cycle and Howl Pose at 4.2x Zoom](/img/2026-11-27-pixiepatrol-fox-stride-strip.png)

- **Pixie Scout Tower (`tower_sway.gdshader`) & Sylvan Warden Avatar (`avatar_flutter.gdshader`)**:
  - The mossy oak treehouse pins its roots solidly to the soil (`UV.y >= 0.70`) while swaying upper branches with `wind_sway.x`, fluttering the balcony archer's dragonfly wings, recoiling on bow shots (`charge_progress` / `recoil_squash`), and pulsing bioluminescent mushrooms at night.
  - The Sylvan Warden flaps left and right gossamer wing lobes independently (`wing_flap`) while her tattered petal skirt trails behind flight velocity (`cloak_lag`)—rendered via `show_behind_parent` layering so spells, companion motes, and health bars stay razor-sharp on top.

![2D Deformation Shaders in Action: Pixie Scout Treehouse Wind Sway & Bow Charge vs. Sylvan Warden Wing Upstroke/Downstroke and Skirt Drag](/img/2026-11-27-pixiepatrol-tower-avatar-motion.png)

After adding `is_instance_valid(...)` guards for freed towers mid-projectile flight, the entire headless regression suite across **all 39 test scenes** finished cleanly: **`SUMMARY: passed=39 fails=0`**. Zero 3D models needed!

---

## Act III: Four-Minute CI Fixes, Clinical Alerts & The 2-Character Helm Hall-of-Fame

The rest of the morning and afternoon delivered a parade of razor-sharp fixes across four more projects:

### 1. Glyphrig `v0.5.1` — Solving Yesterday's Cliffhanger in 4 Minutes (`08:41–08:45 CST`)
Remember that lone CI test failure we teased at the bottom of yesterday's post? Why did `u/alice/index.html` pass locally yet mysteriously contain `https://bob.example.com` only inside GitHub Actions?

**Root cause:** In GitHub Actions, `GITHUB_REPOSITORY` is automatically set in the environment! That caused `packages/cli/src/config.ts` to auto-enable collaboration defaults, mounting `QuickAddDrawer.astro` in `BaseLayout.astro`—which embedded `#glyphrig-quickadd-data` (`existingIndex`) containing every bookmark URL across the entire site for instant client-side duplicate detection!

The fix (`fdb4f48`) scoped the assertion in `packages/cli/test/build.test.ts` to Alice's `<main>...</main>` bookmark feed, verified **`14/14` suites / `75/75` tests** under `GITHUB_REPOSITORY="Glyphrig/Glyphrig" CI=true`, re-zipped the Chrome and Firefox MV3 bundles, and tagged **`v0.5.1`**!

### 2. Killibre Deep-Dive Bug Hunt (`08:43–08:47 CST`)
Running `"deep dive bug hunt everywhere"` against **Killibre** (the Android app that overrides FreeStyle Libre 3's un-mutable direct media sirens with sane replacement alerts) turned up **three subtle clinical-safety bugs**—and squashed them all with `./gradlew testDebugUnitTest assembleDebug` green:
1. **`AlertDispatcher` Auto-Detection Lockout**: If another Libre package variant was saved, alerts from an active authentic Libre app (`matchesLibreSignature`) were silently dropped as `IGNORED_ONGOING`. Now it accepts and auto-switches immediately.
2. **`AlertClassifier` Clinical Cue Coverage**: Added `"urgent"`, `"critical"`, `"hypo"`, and `"hyper"` to `otherExplicitAlarmCues` so titles like *"Severe Hypo"* or *"Critical Notice"* never get suppressed as ongoing notifications even without the literal word `"alarm"`.
3. **`AlertPlayer` Startup Race**: Populated `_activeAlert.value` synchronously inside `startAlert()` before launching the playback coroutine, preventing `AlertPlaybackService.tryStartBooster` from seeing `null` and exiting prematurely.

### 3. Eluvix Multica Arc Complete + Forced-Strength MCP Guard (`09:01 CST → 08:29 CST`)
Over on **`Eluvixrouter/eluvix`**, three major PRs moved the needle:
- **PR #37 (Merged `09:01 CST`, `+4,073 / -34`, 30 files)**: Landed phases (a)–(d) of full Multica integration—OpenAI `/v1` model backend, harness adapter + routing node, transcript ingestion, and write-back gate hardening.
- **PR #38 (Opened `10:30 CST`, `+936 / -120`, 42 files)**: Consolidated all 7 commits of the `hunt-2` suspects triage (slices A–D: `cliPath` gate, TrueForge `204`, empty-config guard, DNS pin, Helm/Docker/CI).
- **PR #39 (Opened `11:43 CST` → Merged `08:29 CST` today, `+593 / -96`, 8 files)**: Shipped **Phase (e) — Eluvix as an MCP server for Multica agents**, closing a sneaky gap where `eluvix_memory_store` bypassed injection checks and skipped PII scrubbing whenever the privacy guard was toggled off. Everything now funnels through a single forced-strength T5 `gateTextForMemory` in `guard.ts` (all 6 threat vectors + all 6 PII types, fail-closed on injection, redacted on PII).

### 4. DeployCoop Helm Pinning, Prometheus CRDs & Tekromancy's Dark-Port Deep Dive
- **`DeployCoop/vigilant-octo-waffle`**: Merged **PR #149** (`08:58 CST`, Wave 3 upstream chart pinning), immediately spotted why OpenProject refused to render, and merged **PR #150** (`09:45 CST`, `+1 / -1`): removing two quotes around `develop: "true"` → `develop: true` so Helm's `(.Values.develop | ternary ...)` finally received a real boolean!
- **Kubernetes Cluster Ops (`09:46 CST`)**: Server-side applied all **10 Prometheus Operator CRDs (`v0.95.2`)** cleanly (`alertmanagerconfigs`, `prometheuses`, `servicemonitors`, `podmonitors`, `scrapeconfigs`, `thanosrulers`, etc.).
- **Tekromancy Blog (`08:50 CST`, `794c3984`)**: Drafted an 821-line systems deep dive—*"Dark-Port Linux Perimeters: Kernel-Native `nftables` Port Knocking, Cryptographic SPA, and XDP Ephemeral Admission Gates"*—complete with 4 custom cyberpunk diagrams and artwork.

---

## Complete 24-Hour Activity Ledger

| Time (CST) | Repository / Project | Ref / Event | Summary & Diff |
| :--- | :--- | :--- | :--- |
| `08:45` | **`Glyphrig/Glyphrig`** | **`v0.5.1`** (`fdb4f48`) | Scoped contributor page test assertion to `<main>` for `GITHUB_REPOSITORY` QuickAdd index (`75/75` green, Chrome/Firefox zips rebuilt). |
| `08:47` | **`killibre`** | Local Android build | Deep-dive audit: fixed `AlertDispatcher` lockout, `AlertClassifier` `hypo`/`hyper`/`critical` cues, and `AlertPlayer` startup race. |
| `08:50` | **`Tekromancy/blog`** | `794c3984` | Added 821-line draft deep dive on dark-port `nftables` port knocking, SPA, and XDP admission gates + 4 visuals. |
| `08:58` | **`DeployCoop/vigilant-octo-waffle`** | **PR #149 (Merged)** | `chore(charts): Wave 3` — repointed three major Helm apps to pinned upstream repos (`+36 / -84`). |
| `09:01` | **`Eluvixrouter/eluvix`** | **PR #37 (Merged)** | Full Multica integration phases (a)–(d): model backend, harness + node, transcript ingestion (`+4,073 / -34`, 30 files). |
| `09:45` | **`DeployCoop/vigilant-octo-waffle`** | **PR #150 (Merged)** | `fix(charts): unquote openproject develop` (`+1 / -1` — fixing string `"true"` vs. Helm `ternary` bool!). |
| `09:46` | **Kubernetes Cluster** | `kubectl apply --server-side` | Applied all 10 Prometheus Operator CRDs (`v0.95.2`). |
| `10:30` | **`Eluvixrouter/eluvix`** | **PR #38 (Opened)** | Consolidated `hunt-2` suspects triage A–D across 42 files (`+936 / -120`, 7 commits). |
| `12:37` | **`PixiePatrolGodot1`** | Local Godot 4 prototype | Locked Rackham × Froud/Brown art style; built `QuadrupedSpriteRig.gd` (12-bone fox mesh) + 3 custom 2D shaders (`39/39` green). |
| `15:31` | **`axonwall/axonwall`** | `a58005b6` | **All 5 Waves Remediation**: 228 verified bugs squashed across **379 files (`+25,910 / -6,781`)**. |
| `16:40` | **`axonwall/axonwall`** | `81215569` | Dropped ~75 MB `k3s` binary from unified ISO → shrank cleanly to `1.09 GiB` (under `1.9 GiB` GitHub limit). |
| `17:12` | **`axonwall/axonwall`** | `b75c8702` | `chmod 0755/0644` on `packaging/iso/output` so non-root CI runner can inspect `sudo`-built ISOs. |
| `17:54` | **`axonwall/axonwall`** | `f90d0af7` | Fixed `bash -e` exit `1` in `Compute Checksums` when an Alpine `.sha256` already existed. |
| `08:25` *(Nov 27)* | **`axonwall/axonwall`** | **`v0.16.3`** (`6e26600f`) | Tagged & pushed patch release across 21 manifests/charts with full Go, TS, and eBPF suites green. |
| `08:29` *(Nov 27)* | **`Eluvixrouter/eluvix`** | **PR #39 (Merged)** | Shipped Eluvix MCP Server for Multica (phase e) with unified T5 `gateTextForMemory` (`+593 / -96`). |

---

## Closing Transmission: Zero 3D Models, Zero Unpatched Waves

There is something deeply satisfying about watching two totally different crafts rhyme on the exact same day. In **Axonwall**, an 8-track adversarial audit proved that even a freshly rolled-out `v0.16.2` fleet can hide `nftables` rate-limit bypasses, Linux 6.12 eBPF verifier quirks, and `bash -e` traps—and that a disciplined parallel swarm can remediate **228 findings across 379 files** and still ship **`v0.16.3`** by breakfast.

Meanwhile, in **Pixie Patrol**, refusing the knee-jerk *"guess we need 3D"* impulse yielded something far more soulful: an Arthur Rackham × Brian Froud painted red fox striding smoothly across a moonlit trail on 12 handmade 2D bones, past an oak-stump treehouse swaying in the breeze with glowing mushrooms.

Onward to `v0.16.3` rollouts and the rest of the painted fairy roster!
