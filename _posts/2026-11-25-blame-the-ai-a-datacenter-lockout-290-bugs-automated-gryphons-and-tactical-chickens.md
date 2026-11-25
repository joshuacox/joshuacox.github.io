---
title: "Blame the AI: A Data-Center Lockout, an 8-Agent Audit of 290 Bugs, Automated Gryphons, and Tactical Chickens"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags:
  - devlog
  - axonwall
  - security
  - networking
  - glyphrig
  - godot
  - gamedev
  - kubernetes
  - ai-agents
photo_url: /img/2026-11-25-datacenter-lockout-audit-banner.jpg
description: "Twenty-four hours of peak engineering drama: Axonwall v0.16.0 ships Lean Core and promptly earns a trip to the data center, triggering an 8-subagent forensic audit (290 verified bugs) and a 2,164-line kernel rollback safety net—while Glyphrig automates Chrome Web Store v2 releases, BokBot clears 166/166 gameplay tests, and DeployCoop merges a -336,354-line red diff."
---

Every infrastructure engineer eventually earns their stripes the hard way: configuring one innocent, unassigned NIC on a remote appliance and watching the SSH cursor freeze forever.

Yesterday morning's [2 AM Chronicles](/blog/2026/11/24/the-2am-all-of-them-chronicles-lean-firewalls-arcane-pianos-and-526k-deleted-lines/) wrapped up full of optimism—Axonwall `v0.16.0` was about to tag its Lean Core + 47-plugin diet, BokBot was mid-interrogation in `/grill-me`, and `DeployCoop/urban-disco` PR #5 was waiting to swing its scythe through a third of a million lines of Helm YAML.

Twenty-four hours later (`Nov 24 08:15 CST → Nov 25 08:56 CST`), we have shipped across **7 repositories**, orchestrated **24 active Antigravity sessions**, retired over **half a million lines** of vendored charts, automated Chrome Web Store publishing end-to-end, passed **166/166** headless Godot gameplay tests—and sparked the undisputed midnight prompt of the month:

> *"and by that I mean your total screw up of locking us out entirely, everyone is blaming the AI (you)"*
> — Followed at `08:56` AM CST by: *"ok I'm headed back to the data center how do I fix this?"*

Buckle up. Here is the full telemetry dispatch from the past 24 hours—complete with architecture postmortems, severity heatmaps, and a steampunk chicken defending an irrigation trench.

![24-Hour Engineering Velocity & Pulse Timeline across 7 Repositories and 24 Active Agent Sessions](/img/2026-11-25-24h-activity-pulse.svg)

---

## Act I: Axonwall `v0.16.0`, the `enp4s0` Lockout, and the 8-Agent Midnight Tribunal

At `08:15` CST yesterday, Axonwall officially tagged **`v0.16.0`** (`ccaf2dfb` + `6fd98cba`), shipping the Lean Router/NGFW Core, 47 modular plugins, 4 curated starter packs, and fresh docs on `axonwall.com` (`8e124d82`, followed shortly by `5fd805f6` switching social cards to raster PNG so Matrix and Element finally render link previews cleanly).

Then came the real-world hardware test on an 8-port Check Point appliance.

Configuring an unassigned bottom-row port—`enp4s0` (`opt3`)—inside the WebGUI did not merely fail cleanly. It disrupted the existing internal interfaces, and the much-vaunted **Commit-Confirm rollback never fired**. Everyone in the room looked at the frozen terminal, looked at each other, and immediately blamed the AI.

At `00:06` CST, the verdict came down: **"you had better prevent this from ever happening again."**

### The Postmortem: Four Compounding Footguns

Digging into the lockout revealed a textbook distributed-state cascade—not one bug, but four bugs holding hands:

1. **Pre-Apply Disk Poisoning**: `saveInterfaceAssignment` in the WebUI server wrote candidate `/etc/axonwall/*.yaml` files directly to disk *before* calling `POST /v1/apply`. When `axonwalld` tried to snapshot the Last-Known-Good (LKG) config, it dutifully snapshotted the broken candidate instead.
2. **The Loopback Auto-Confirm Bypass**: Immediately after `POST /v1/apply`, the server called `POST /v1/confirm` over localhost—short-circuiting the entire 120-second human Commit-Confirm safety timer.
3. **Zero Live Kernel Network Snapshot**: Mutating links, DHCP routes, `/etc/network/interfaces`, and `kea-dhcp4.conf` had *no* live kernel IPv4/route/link snapshot to roll back to.
4. **Rollback That Erased Its Own Parachute**: Even when `executeRollback()` *did* trigger, it applied `lastGoodScript` first; if the script was empty or `nft -f` errored out, it returned early and called `clearPendingLocked()`—deleting the backup snapshots before restoring a single file or route!

![Before and After Architecture Diff: How enp4s0 Locked Out the Appliance vs. the Phase 1A net_rollback.go Safety Net](/img/2026-11-25-commit-confirm-rollback-flow.svg)

### Unleash the Owls: 8 Parallel Adversarial Auditors & 290 Verified Findings

Instead of slapping a band-aid on `enp4s0` and hoping for the best, the session spawned **8 parallel read-only adversarial audit subagents** between `00:07` and `00:47` CST to review **100% of non-test source files** across the entire Axonwall monorepo—and empirically verified every `nftables` compiler edge case against `nft -f -` (`nftables v1.1.7`) inside an ephemeral Linux network namespace.

The result is a **135 KB forensic dossier** (`full_lockout_and_codebase_audit_v016.md`) cataloging **290 raw findings** (`73 CRITICAL`, `131 HIGH`, `74 MEDIUM`, `12 LOW`):

![Axonwall v0.16.0 8-Subagent Adversarial Audit Heatmap showing 290 Verified Findings across 8 Domains](/img/2026-11-25-axonwall-audit-heatmap.svg)

Some of the wildest catches turned up by the 8-agent sweep:
- **The Suricata IPS "Allow-All" Plot Twist (`T0-D1`)**: `nfq.mode: accept` at the top of `chain forward` terminated chain evaluation on `NF_ACCEPT`—silently bypassing CrowdSec, GeoIP, `@blocked_ips`, per-interface drops, and `policy drop`!
- **The Kernel-Upgrade NIC Renamer (`T0-B4`)**: `axonwall-install` boots with predictable names (`enp1s0..enp8s0`), while `axonwall-ab.cfg` and `40_axonwall_ab` hardcoded `net.ifnames=0`. One innocent `update-grub` would rename every NIC to `eth0..eth7` on next reboot.
- **The Boot-Time BPF-LSM Self-Brick (`T0-B9`)**: Enabling `EnforceBpfLoad` with an allowlist containing *only* `axonwalld` and `bpftool` inodes quietly kneecapped `systemd`, `runc`, `k3s`, `tc`, and `cilium-agent`.
- **The `validateFqlQuery` Infinite Loop (`T0-D5`)**: Passing a bare `!`, `&`, or `|` into a NetFlow FQL query left tokenizer index `j === i`, looping forever until Node went OOM.

### Phase 1A Already Landed in the Working Tree (`+1,139 / -663` + `2,164` New Lines)

Before sunrise, **Phase 1A** already locked down the core Commit-Confirm & rollback path across 19 modified files and 3 brand-new modules (`net_rollback.go` at `645` lines, `net_rollback_test.go` at `1,114` lines, and `interface-commit-confirm.test.ts` at `405` lines):

- **Zero Loopback Auto-Confirm & Zero Pre-Apply Clobber**: Stripped localhost `/v1/confirm` bypasses from both interface edits and WireGuard peer registration; added live + static overlapping subnet guards (`findOverlappingSubnet` / `readLiveKernelIpv4Addrs`) and restricted `gateway` emission strictly to `wan`.
- **Kernel-Aware `net_rollback.go`**: Captures live IPv4 addresses, ECMP multipath `"nexthops"` default routes, and external files; deliberately skips overlay/container NICs (`tailscale*`, `wg*`, `veth*`, `tap*`, `cni*`, `cilium*`, `lxc*`, `br-*`) so a rollback never saws off your Tailscale or WireGuard lifeline; and uses non-releasing `stopDhcpClient` + `rebindOrStartDhcpClient` instead of firing premature `DHCPRELEASE` packets.
- **Files & Kernel Restored First**: `executeRollback()` now restores LKG configs, external files, netdev, live kernel state, and routes *before* re-applying `nft -f`—never aborting or wiping backups on a ruleset error.
- **Control-Plane Self-Preservation**: Blocked server-side `stop` on critical control-plane units (`axonwalld`, `axonwall-ui`, `axonwall-controller`, `ssh`/`sshd`), stopped corrupted YAML reads from clobbering disk with factory defaults, and added `RuntimeDirectoryPreserve=yes` so restarting `axonwalld` stops severing `/run/axonwall/agent.sock` bind mounts.

All of which means: yes, Joshua still had to grab a serial cable and head to the data center at `08:56` AM CST to rescue *yesterday's* box via TTY1 `[9] Drop to Root Shell`—but future appliances now carry an actual flight recorder and ejection seat.

---

## Act II: Glyphrig's Automated Chrome Web Store Rocket & BokBot's 166/166 Gameplay Overhaul

While the firewall world was busy conducting a forensic tribunal, two wildly different workshops—browser-extension sync engineering and tactical chicken-coop tower defense—hit major milestones back-to-back.

![Split Tekromancer Workshop: BokBot's Holographic Backyard Tower-Defense Diorama linked via neon conduits to Glyphrig's Automated Gryphon Chrome Web Store Forge](/img/2026-11-25-glyphrig-bokbot-workshop.jpg)

### 1. Glyphrig (`v0.4.3 → v0.4.5`): Three Releases in 31 Minutes & Zero-Touch CWS Publishing

Two days after dodging Chrome Web Store's *"Yellow Argon"* keyword-spam filter, [**Glyphrig**](https://github.com/Glyphrig/Glyphrig) graduated to full push-button release nirvana between `11:58` and `12:29` CST:

- **`v0.4.3` (`c83c203`, `+867 / -107`)**: Replaced cramped inline auth flows with a pop-out GitHub OAuth modal, added OAuth token refresh support in `@glyphrig/core`, and wired up CWS + Tekromancy site links across the landing app.
- **`v0.4.4` (`95951ca`, `+835 / -94`)**: Added **shared GitHub accounts across bookmark sync profiles** (`accounts.ts` + 125-line unit test suite) so you authenticate once and reuse credentials cleanly across repos—and wired up automated **Chrome Web Store API v2** ZIP upload & submission inside `.github/workflows/release.yml` using a dedicated Google Cloud service account.
- **`v0.4.5` (`b1437f5`, `+21 / -9`)**: Met every GitHub Actions veteran's favorite rite of passage—discovering you can't reference the `secrets` context directly inside step-level `if:` conditionals. Three minutes later, the fix shipped, GitHub Actions run **`45460038962`** turned bright green, and the Chrome Web Store API replied with the two sweetest JSON strings in browser-extension dev:

```json
{
  "crxVersion": "0.4.5",
  "uploadState": "SUCCEEDED",
  "state": "PENDING_REVIEW"
}
```

From now on, pushing a `v*` tag automatically builds, tests, publishes `@glyphrig/core`, `@glyphrig/site`, and `@glyphrig/cli` to npm, drafts the GitHub Release, and launches the signed extension ZIP straight into the Chrome Web Store review queue.

### 2. BokBot Chicken TD (`bokbot-godot-td1`): *"proceed phase 1-3"* Lands at 166/166 Green

Remember yesterday's 2 AM BokBot combat audit, where Rocket, Laser, and Plasma turrets politely ignored flying bosses and every boss weakness was silently flattened to `1.0x`?

At `08:40` CST, the `/grill-me` interrogation concluded with three magic words—**`proceed phase 1-3`**—and by `09:30` CST, the full gameplay overhaul landed across **76 modified files (`+4,404 / -789`) and 47 new untracked files**:

- **Phase 1 — Combat, Anti-Air & Unified Damage Math**: Wired `"target_air"` and `"aa_bonus_mult"` (`1.35x`) into `TowerDatabase.gd`; unified enemy & boss weakness/resistance multipliers inside `Enemy.gd` + `EnemyDatabase.gd`; gave turrets and surveillance towers 22 px destructible colliders with salvaged chip returns; upgraded `DamagePopup.gd` with crisp `WEAK!` / `RESIST` tags (capped at 60 popups); and added persistent `FirePatch.gd` ground hazards plus a world-space aiming reticle, `[G]` manual Overdrive, and `[H]` Steam Klaxon.
- **Phase 2 & 3 — Inspection UI, Economy & Interactive Terraforming**: Built brand-new `StructureInspectUI.gd` and `HomesteadModalUI.gd` panels, connected Rainstorm hydrology + burning-cell fire damage + dawn ash clearing in `HydrologyManager.gd`, and shipped the **`irrigation_trench`** Agronomy drag tool so you can literally terraform water channels across your backyard battlefield.
- **Headless + Live OpenGL3 Verification**:
  - `tests/TestRunner.tscn`: **`166 PASSED, 0 FAILED`** (zero script errors)
  - `tests/test_game_headless.gd`: **`11 PASSED, 0 FAILED`**
  - Live `1280×720` Xvfb OpenGL3 captures across Day Prep, `StructureInspectUI`, `HomesteadModalUI`, Night Combat, and `WorldMap`—catching and fixing TopBar clipping, `MinimapRadar` overlap, and `"72 WEAK!"` popup bounds before signing off.

---

## Act III: The 4-Minute Publishing Blitz & GitHub Dispatch

Between `09:05` and `09:41` CST yesterday morning, four repositories fired off ships in rapid succession:

| Time (CST) | Repository | Commit / PR | What Landed |
| :--- | :--- | :--- | :--- |
| `09:05` | **`axonwall/axonwall.com`** | `5fd805f6` | Switched OpenGraph preview cards to raster PNG so Matrix/Element and chat clients actually render thumbnails. |
| `09:08` | **`joshuacox/paperclip`** (`agy`) | `d182e1ac` | Addressed Greptile review feedback (`+135 / -25`) on the *"Adding agy (antigravity)"* PR to `paperclipai/paperclip` and triggered `@greptile review` iteration 2. |
| `09:37` | **`Tekromancy/blog`** | `98f9b40` | Published *"Kubernetes GitOps Control-Plane Internals: Desired-Subset Drift Engines, Server-Side Apply managedFields, Finalizer Ordering, and OCI Helm Pinning"* with 4 custom technical diagrams—and at `08:56` AM today, the daily automation kicked off the *next* deep-dive article. |
| `09:39` | **`DeployCoop/urban-disco`** | **PR #5 Merged** | That glorious **0 additions / 336,354 deletions across 1,745 files** Wave 2 Helm cleanup PR officially merged—sealing the **526,076-line** vendored chart retirement! |
| `09:41` | **`joshuacox.github.io`** | `54d79c2` | Generated and shipped custom `1376×768` banner artwork for the previous four devlog posts so the homepage card grid glows end-to-end. |

---

## Closing Transmission: Safe Travels to the Rack

If there is a single moral to the last 24 hours, it is this: **automation is intoxicating when it works, and deeply educational when it locks you out of `enp4s0`.**

On the bright side:
- **Glyphrig** now ships itself to npm, GitHub Releases, and the Chrome Web Store off a single Git tag.
- **DeployCoop** is half a million lines of stale Helm YAML lighter.
- **BokBot's** chickens finally know how to shoot down drones, read boss weaknesses, and dig tactical irrigation trenches (`166/166` green).
- **Axonwall** turned one painful rack trip into the most thorough adversarial audit in its history—290 verified findings mapped cleanly across every package, with Phase 1A's `net_rollback.go` safety net already written and tested so the next appliance heals itself in 120 seconds instead of summoning a road trip.

Godspeed at the data center—may your serial cable seat on the first try, and may `ip -br addr` bring swift mercy.
