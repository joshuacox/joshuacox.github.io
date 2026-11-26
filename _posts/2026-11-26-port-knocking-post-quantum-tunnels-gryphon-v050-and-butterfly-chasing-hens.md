---
title: "Port Knocking, Post-Quantum Tunnels, Gryphon v0.5.0, and Butterfly-Chasing Hens"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags:
  - devlog
  - axonwall
  - networking
  - security
  - glyphrig
  - godot
  - gamedev
  - kubernetes
  - ai-agents
photo_url: /img/2026-11-26-port-knocking-gryphons-banner.jpg
description: "Picking up straight from the data-center serial cable cliffhanger: Axonwall v0.16.1 rescues the Check Point rack, v0.16.2 ships edge-to-central analytics offload + zero-port-at-rest WAN port knocking across a 5-host rolling reboot, Glyphrig v0.5.0 drops 9,552 lines and a 60+ bug hunt, and BokBot + PixiePatrol come alive with 24 new idle behaviors."
---

When we signed off [yesterday's dispatch](/blog/2026/11/25/blame-the-ai-a-datacenter-lockout-290-bugs-automated-gryphons-and-tactical-chickens/), the story ended on a classic sysadmin cliffhanger: Joshua heading back to the data center with a serial cable after an unassigned NIC edit locked out a remote Check Point appliance.

Plot twist: not only did `picocom -b 9600 /dev/ttyUSB0` save the day, the next 24 hours (`Nov 25 09:02 CST → Nov 26 08:40 CST`) turned into a **~35,000-line multi-repository sprint** spanning **7 repositories** and **8+ active Antigravity sessions**:

- **Axonwall** went from `v0.16.1` (lockout hardening) straight to **`v0.16.2` (`+14,508 / -701` across 108 files)**—shipping full **edge-to-central telemetry offload**, **zero-port-at-rest WAN Headscale invites with stateful `nftables` port knocking**, a **29-tool MCP server**, and a midnight **5-host sequential fleet rollout** across ZFSBootMenu and Btrfs/Snapper hosts.
- **Glyphrig** heard *"can you suggest further improvements?"*, answered **"all of the above!"**, ran an adversarial **60+ bug hunt**, became an official **Tekromancy-sponsored app**, and tagged **`v0.5.0` (`+9,552 / -782` across 75 files)** for parallel Chrome/Firefox/Edge store publishing.
- **BokBot** and **PixiePatrol** got simultaneous late-night **"Living Worlds"** animation overhauls—24 new procedural idle behaviors, floating vector emote bubbles, drifting cloud shadows, butterfly-chasing hens, and fairy towers juggling figure-8 orbs of light.
- Meanwhile on **GitHub**, two midnight pull requests landed across **`Eluvixrouter/eluvix#37`** (`+4,073 / -34`) and **`DeployCoop/vigilant-octo-waffle#149`** (Wave 3 upstream chart pinning).

Grab your coffee and your console cable—here is the complete visual dispatch from the past 24 hours.

![24-Hour Engineering Velocity Timeline across Axonwall, Glyphrig, Tekromancy, BokBot, PixiePatrol, Eluvix, and DeployCoop](/img/2026-11-26-24h-telemetry-timeline.svg)

---

## Act I: Serial Rescue, Post-Quantum WireGuard & Axonwall `v0.16.2`

### 1. From `picocom` at the Rack to Rosenpass Post-Quantum Tunnels (`09:02–11:55 CST`)

Before the wheels even hit the data-center parking lot, **Axonwall `v0.16.1`** (`2fb2fb86` + `e369459b`, **`+3,314 / -674` across 23 files**) was tagged and documented on `axonwall.com` (`80055e2`), locking in the hardened Commit-Confirm rollback path and live kernel snapshot safety net from yesterday's audit. Four minutes later (`09:06 CST`), the **Tekromancy blog** (`26e914e`, `+748 lines` + 4 custom cyberpunk diagrams) captured the entire kernel postmortem as a draft deep dive: *"Zero-Lockout Linux Networking: Engineering `commit confirmed` Dead-Man's Switches Across `rtnetlink`, `nftables`, and Routing Tables."*

At `10:18 CST`, live from the rack:
> *"you can serial into the thing right now, investigate `picocom -b 9600 /dev/ttyUSB0`"*

The Check Point appliance (`checkpoint1`) came back online, updated to `v0.16.1`, survived a live verification reboot while hands were still on-site (*"let's reboot the appliance while I am still here to fix it if need be"*), and even threw one cheeky puzzle when setting up WireGuard (`wg0`) for remote access: `0 B received` on handshake!

The culprit? **Post-quantum cryptography doing its job a little *too* well.** `rosenpass` was enabled in `/etc/axonwall/vpn.yaml`, quietly rotating Classic McEliece + ML-KEM preshared keys into `wg0` at startup—so a vanilla WireGuard peer without Rosenpass couldn't complete the handshake. Pairing the workstation with local `rosenpass` restored the encrypted tunnel cleanly.

### 2. `/grill-me` → Edge-to-Central Analytics Offload + Zero-Port-At-Rest Port Knocking (`16:57–22:40 CST`)

Once `checkpoint1` was humming again, the evening shifted from firefighting to pure architecture ambition:

1. **At `16:57` & `18:48 CST`**: *"let's investigate shipping out all of our netflow logs from an edge to another axonwall host for analysis... so one of the k3s/storage hosts can take on the data and analysis while leaving the edge free to do routing"* — followed by a full `/grill-me` design interrogation.
2. **At `20:18 CST`**: *"let's come up with a way for people to be able to access the headscale signup links from the WAN, perhaps we should use port knocking?"*

By `22:40 CST`, **`Axonwall v0.16.2`** (`fbeaa148` + `29a4dff4`) landed across **108 files (`+14,508 / -701`)**, alongside a 35-file `axonwall.com` docs refresh (`d96bd02`):

![Axonwall v0.16.2 Dual Architecture: Edge-to-Central Telemetry Offload and Zero-Port-At-Rest WAN Headscale Invite Gate](/img/2026-11-26-axonwall-edge-offload-portknock.svg)

Here is what actually shipped under the hood:

- **Zero-Overhead Edge Shipper (`apps/axonwalld`)**:
  - Unified `observability.offload` in `system.yaml` plus decoupled `netflow.mode` (`collector` | `exporter` | `both`) and `netflow.nodeId`, adding zero runtime overhead on standalone edge installs.
  - Non-blocking **Prometheus Remote-Write** (`snappy` + protobuf `WriteRequest`), **VictoriaLogs NDJSON/gzip** shipper with a native `NETLINK_NETFILTER` NFLOG listener (token-bucket rate-limited at `50/s` default), `journald`, Suricata EVE, CrowdSec alerts, Kea DHCP leases, and opt-in Unbound logs—all cushioned by a **bounded RAM ring buffer + opt-in `zstd` disk spool**.
  - Upgraded `flow_tracker.c` eBPF maps with `ingress_ifindex`, lifted the old 50-flow exporter ceiling to `16,384` flows, and added **IPFIX Enterprise PEN `62999` Options Templates `258`/`259`** so central ClickHouse knows exactly which remote edge node and NIC originated every flow.
- **Central K3s Analytics Hub & 29-Tool MCP Server (`apps/axonwall`, `apps/axonwall-controller`)**:
  - Added scrypt-hashed **Scoped Service Tokens (`axw_svc_*`)**, unprivileged `--mode=collector`, a brand-new `/reporting/observability` Offload Control Center, `/reporting/logs` LogsQL Explorer, multi-node `node:` FQL filtering in NetFlow Studio, and **18 read-only resources + 29 guardrailed MCP tools** (`mcp_query_metrics`, `mcp_query_logs`, `mcp_query_historical_flows`, and opt-in XDP `mcp_trigger_edge_mitigation` protected by `protectedCidrs`).
- **Zero-Port-At-Rest WAN Headscale Invite Gate (`headscale_wan_gate.go`)**:
  - At rest, **zero WAN ports are open**. `HeadscaleWanGateManager` dynamically reconciles the `headscale_wan_window_ports` `nftables` set against active unexpired invites (with a 15-second expiry ticker and post-`nft -f` reconciliation).
  - Layered defense-in-depth: optional **kernel-native UDP/TCP stateful `nftables` port knocking** (`headscale_knock_s*` → `headscale_knock_allow_v4/v6`), optional `allowedCidrs`, hardened **HAProxy** path allowlisting with strict TLS SNI/`Host` checks and `http-request silent-drop` keeping `/login`, `/admin`, and `/metrics` invisible from WAN, plus optional scrypt-hashed **6-digit out-of-band PINs** (auto-revoking after 5 failed guesses) leading to single-page CLI/QR onboarding.

### 3. The Midnight 5-Host Sequential Rollout (`23:22–23:55 CST`)

*"ok let's push 0.16.2 to all known axonwalls — reboot in sequence."*

Across 33 tense minutes, all **5 reachable Axonwall appliances** were upgraded to the verified `axonwall_0.16.2_amd64.deb` package and rebooted one by one:

| Order | Host | RootFS / Snapshot Mode | Post-Reboot Status |
| :---: | :--- | :--- | :--- |
| 1 | `saxon` | ZFSBootMenu (`zroot/ROOT/axonwall-0.16.2`) | All services `active`; K3s `Ready` |
| 2 | `suburban-hello` | ZFSBootMenu (`zroot/ROOT/axonwall-0.16.2`) | All services `active`; `headscale` & K3s `Ready` |
| 3 | `prize-hammer` | ZFSBootMenu (`zroot/ROOT/axonwall-0.16.2`) | All services `active`; `headscale` & K3s `Ready` |
| 4 | `klaxon` | ZFSBootMenu (`zroot/ROOT/axonwall-0.16.2`) | All 6 services `active`; Keepalived VIPs restored; 4/4 K3s `Ready` |
| 5 | `checkpoint1` | Btrfs + Snapper (`pre=#6`, `post=#7`) | `slotA: 0.16.2`; `axonwalld`, `wg-quick@wg0`, `ssh` `active` |

And because real-world rollouts always teach you things unit tests can't, the fleet upgrade caught **two subtle production edge cases** immediately:
1. **ZFSBootMenu + Live K3s `etcd` WAL Rewind**: Because `/var/lib/rancher/k3s` lived inside the root boot environment, snapshotting `saxon` while `etcd` was actively writing rewound its local WAL upon reboot (`panic: tocommit(6291201) is out of range [lastIndex(6291025)]`). Syncing the clean-shutdown `etcd` directory from the prior BE and cleanly stopping `k3s` before snapshotting the remaining nodes made upgrades #2–#4 smooth as silk.
2. **Single-NIC LAN `dhcpcd -G` Default-Route Strip**: On nodes with no enabled WAN interface, `startDhcpClientProcess` still passed `-G` to `dhcpcd`, stripping the DHCP default gateway on boot—immediately identified and queued for the next patch.

---

## Act II: Glyphrig `v0.5.0` — *"All of the Above!"*, 60+ Squashed Bugs & Tekromancy Sponsorship

At `22:52 CST`, the [**Glyphrig**](https://github.com/Glyphrig/Glyphrig) session opened with the kind of prompt every AI coding agent secretly lives for:

> *"can you suggest further improvements and enhancements? let's make this the best bookmarking collaboration tool ever"*
> — Six minutes later: **"all of the above!"**

Followed at `23:11 CST` by officially welcoming **Glyphrig** into the **Tekromancy** ecosystem (`tekromancy/blog` commit `f7b071b`, `+125 / -29`), adding it as a Tekromancy-sponsored application across the app registry, homepage showcase, `/apps` page, and `PRODUCT.md`.

Then at `23:25 CST`, before tagging a single byte, came the magic safety phrase: **`deep dive bug hunt`**.

![Glyphrig v0.5.0 Collaboration Suite, 6 Universal Importers, 60+ Adversarial Bug-Hunt Shield, and 3-Store Parallel CI](/img/2026-11-26-glyphrig-v050-collab-matrix.svg)

At `00:06 CST`, **`Glyphrig v0.5.0`** (`c4ad0f5`, **`75 files changed, +9,552 / -782`**) shipped across the entire monorepo:

- **`@glyphrig/core` — Team Knowledge Gardens**:
  - **4 Collaboration Sync Modes**: `two-way` (asymmetric 3-way browser ↔ markdown merge), `contribute-only`, `subscribe-only`, and fork-safe `propose-pr` across hardened **GitHub, GitLab, and Forgejo** adapters.
  - Per-contributor threaded `@notes`, maintainer badges, auto-tag rules engine (`autotag.ts`), 1-click garden invite codec (`invite.ts`), and full-fidelity 4-kind conflict records.
- **`@glyphrig/cli` — Universal Migration & Living Archive**:
  - **6 Universal Importers (`importers.ts`, 855 lines)**: Netscape HTML, Raindrop, Pinboard, Pocket, Linkding, and Karakeep.
  - **Link Health & Wayback Auto-Archiving (`link-health.ts`)** plus automated **Weekly Digest Generation (`digest.ts`)** formatted for Slack, Discord, Matrix, Markdown, and JSON.
- **`@glyphrig/site` & `apps/extension` — Frictionless Curation**:
  - Published `glyphrig.json` garden manifests, a 1-click **Join Garden Modal**, granular RSS feeds (`/feeds/f/...`, `/feeds/tags/...`, `/feeds/u/...`), a rich Quick Add drawer with duplicate detection, an `Alt+Shift+B` **Save & Annotate** popup with tag suggestions, right-click context menus, and an interactive 4-kind conflict resolver.
- **The 60+ Adversarial Bug Hunt**:
  - Eradicated stored DOM XSS by replacing `innerHTML` with `textContent` DOM construction and escaping `</script>` / line separators in inline JSON (`safeJsonForScript`).
  - Enforced `isSafeHttpUrl()` (`http:`/`https:` only) across remote links, `ogImage`, `waybackUrl`, and OAuth redirects while scrubbing OAuth fragments.
  - Swapped regex HTML filtering for a strict **fail-closed SVG favicon & HTML allowlist**, added MV3 concurrent storage locks + echo suppression, made Firefox bookmark separators index-safe, and wired up **independent parallel release jobs** for npm, GitHub Releases, Chrome Web Store (`≤132` char description), Mozilla AMO (`Firefox MV3 140.0`), and Microsoft Edge Add-ons.
  - *(Bonus 08:41 AM CST morning catch: CI immediately paid for itself by flagging a single assertion in `packages/cli/test/build.test.ts` verifying `.archived/` exclusion in generated HTML—already under active inspection!)*

---

## Act III: The Midnight "Living Worlds" Godot Sprint (BokBot & PixiePatrol)

At `23:14 CST` and `23:27 CST`—literally while Axonwall hosts were rolling through ZFS reboots and Glyphrig was mid-bug-hunt—both Godot tower-defense worlds received the exact same joyful brief:

> *"can you improve the graphics and animations further? I want to add more random behaviors and improve the graphics and animations overall"*

The result? Pure indie-game magic across **both** codebases—**24 brand-new procedural idle behaviors**, richer atmosphere shaders, and living wildlife that reacts to its neighbors:

![Split-Scene Living Worlds Showcase: BokBot's Sunlit Backyard Diorama vs. PixiePatrol's Twilight Enchanted Fairy Glade](/img/2026-11-26-living-worlds-godot-split.jpg)

### 1. BokBot Chicken TD (`bokbot-godot-td1`, `167/167` + `11/11` Headless Green)
- **12 New Species-Tuned Random Behaviors (`CreatureAnimator.gd`)**: `yawn`, `tail chase`, `pounce`, `stalk`, `ear scratch`, `startle`, `proud strut`, `butt wiggle`, `stare`, `roll over`, `shiver`, and `sit`.
  - Big cats stalk and pounce toward the coop; rats and ferrets roll over and chase their tails; coyotes and wolves howl; pirates and samurai strut; aliens tilt and shiver.
  - **Mood-Weighted Hens**: Gloomy hens shiver, sit, and stare; happy hens strut, wiggle, stop for **two-hen cluck-and-response social chats**, kick up dirt/grass particles during zoomies, and occasionally **bolt after a passing butterfly or dragonfly**! Meanwhile, the farmer stretches and yawns by day and twitches in his sleep at night.
- **Vector Emotes, Cloud Shadows & Impact Juice**:
  - `EmoteFX.gd` renders crisp pure-vector thought/emote bubbles (`?`, `!`, `z`, `♪`, hearts, sparkles, sweat drops, dizzy swirls).
  - `AtmosphereFX.gd` sweeps **feathered wind-driven cloud shadows**, sunlit pollen motes, night mist, and daytime bird flocks (with matching ground shadows every 24–48s) across the yard, paired with crit shockwave rings in `RingFX.gd`.
- **Bonus Catch by `TEST 87`**: Writing the new regression test immediately caught an untyped-array bug in `HumanDefender` that would have silently prevented the farmer's idle quirks from ever firing. Fixed, verified, **`167 PASSED / 0 FAILED`**!

### 2. Pixie Patrol (`PixiePatrolGodot1`, `31 files` modified + 3 new)
- **12 Expressive Fairy Tower Behaviors & Neighbor Waves (`Tower.gd`)**: `stretch`, `scan`, `twirl`, `hop`, `peek`, `settle`, `wave`, `daydream`, `preen`, `juggle`, `cheer`, and `spark_play`—complete with `_social_scan_timer` so adjacent fairies tilt and wave to each other (and celebrate every kill or wave clear!), plus custom procedural props like **3 figure-8 juggling light orbs**, wing-preen sparkles, elastic squash-and-stretch build pop-ins, and golden Archon upgrade rings.
- **Panicking Enemies & Drain-Trail Health Bars (`Enemy.gd`)**: 8 family-tuned behaviors (`yawn`, `scratch`, `howl`, `taunt`, `groom`, `burrow_peek`, `flutter_hover`, `panic_sprint`) plus `trigger_ally_death_reaction()` startling up to 3 nearby allies within `95px` when a creature falls—complete with expanding howl soundwaves and a delayed amber/ivory health-drain bar.
- **Enchanted Atmosphere & Combat VFX (`GameBoard.gd`, `WeatherOverlay.gd`, `CombatVFX.gd`)**: Drifting diagonal volumetric sunbeams and night moonbeams, orbiting amethyst portal rune shards, counter-rotating golden shrine blessing arcs, two-depth rain with ground splashes and distant sheet lightning, forked micro-branch lightning bolts, and spinning coins with magnetic light trails.

---

## Act IV: GitHub Midnight Dispatch & Repository Roundup

Rounding out the 24-hour telemetry sweep, public GitHub activity and local repos logged two major pull requests right around midnight:

| Time (CST) | Repository | Ref / PR | Diff / Highlight |
| :--- | :--- | :--- | :--- |
| `09:02` | **`axonwall/axonwall`** & **`axonwall.com`** | `v0.16.1` (`2fb2fb86`, `80055e2`) | Commit-Confirm rollback hardening, live kernel snapshots, systemd IPC self-preservation (`+3,314 / -674`). |
| `09:06` | **`Tekromancy/blog`** | `26e914e` | Draft deep dive on transactional Linux networking (`rtnetlink` vs. `nftables` RCU batches) + 4 custom cyberpunk diagrams (`+748`). |
| `22:40` | **`axonwall/axonwall`** & **`axonwall.com`** | `v0.16.2` (`fbeaa148`, `d96bd02`) | Edge-to-central analytics offload, zero-port-at-rest WAN Headscale invites + port knocking, 29-tool MCP (`+14,508 / -701`). |
| `23:15` | **`Tekromancy/blog`** | `f7b071b` | Added **Glyphrig** as an official Tekromancy-sponsored application (`+125 / -29`). |
| `23:41` | **`Eluvixrouter/eluvix`** | **PR #37 (Opened)** | `feat(multica): full Multica integration — model backend, harness + node, transcript ingestion, write-back gate hardening` (**`+4,073 / -34`**). |
| `00:06` | **`Glyphrig/Glyphrig`** | `v0.5.0` (`c4ad0f5`) | Team collaboration suite, 6 importers, Wayback link health, 60+ bug hunt, 3-store parallel CI (**`+9,552 / -782`**). |
| `00:25` | **`DeployCoop/vigilant-octo-waffle`** | **PR #149 (Opened)** | `chore(charts): Wave 3 — repoint the three majors at upstream, pinned` (`+36 / -84`). |

---

## Closing Transmission: Zero Open Ports, Full Backyard Joy

What a contrast 24 hours makes. Yesterday morning started with a frozen SSH cursor and a drive to the data center; by midnight, five production Axonwall nodes had rolled cleanly onto `v0.16.2` with zero-port-at-rest `nftables` port knocking, post-quantum Rosenpass tunnels, and an edge-to-central VictoriaMetrics/ClickHouse/MCP telemetry backbone.

Meanwhile, **Glyphrig `v0.5.0`** evolved into a hardened team bookmarking powerhouse backed by Tekromancy, **Eluvix** opened a 4,000-line Multica integration PR, and two indie Godot games learned how to make hens chase butterflies and fairies juggle light orbs under drifting cloud shadows.

Not a bad recovery from a locked-out `enp4s0`. Onward to tomorrow's commits!
