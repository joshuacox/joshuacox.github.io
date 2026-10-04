---
title: "namgen - Blazing Fast Procedural Name & Lore Engine"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags:
  - cli
  - cpp
  - linux
  - gaming
  - worldbuilding
photo_url: /img/namgen-banner.png
---

Whether naming cloud servers, generating memorable release tags, populating tabletop RPG campaigns, or procedurally drafting game lore, developers and writers frequently need high-quality random names. Most utilities either offer basic adjective-noun pairings or rely on bloated script runtimes with slow startup and heavy memory footprints.

[namgen](https://joshuacox.github.io/namgen/) is a high-performance command-line name generator written in modern C++17. In addition to clean, Docker-style adjective-noun slugs and casing options, it features **907 specialized procedural name generators** compiled directly into zero-allocation `.rodata`, spanning 40 fictional and historical universes.

---

### What is namgen?

`namgen` combines flexible adjective-noun dictionary engines with an expansive registry of specialized procedural name generators. Everything is compiled natively down to bare metal with zero heap allocation overhead, making it virtually instantaneous to run in CLI pipes, terminal loops, or microservice environments.

It supports clean formatting styles (`kebab-case`, `camelCase`, `CapWords`), custom separators, deterministic random seeds (`--seed`), and structured data output (`--json` and `--csv`) for easy pipeline integration.

Explore the complete generator catalog and interactive web simulator at [joshuacox.github.io/namgen](https://joshuacox.github.io/namgen/) or check out the [GitHub repository](https://github.com/joshuacox/namgen).

---

### 907 Specialized Generators Across 40 Universes

The hallmark of `namgen` is its dynamic generator registry. By passing category flags (e.g. `--<category>-<name>`), you can tap into rich, curated naming algorithms without downloading external databases or wordlists:

- **Fantasy & Mythological Beings**: Dragons (`--fantasy-dragons`), elves, goblins, vampires, angels, and demons.
- **D&D, Pathfinder & Tabletop**: Dragonborn, drows, dwarfs, tieflings, and aasimars.
- **Sci-Fi Universes**:
  - **Star Wars**: Mandalorians (`--star_wars-mandalorians`), Sith Lords (`--star_wars-darths`), Wookiees, and Chiss.
  - **Star Trek**: Klingons, Vulcans, Romulans, and Ferengis.
  - **Warhammer & 40K**: Space Marines (`--warhammer_40k-space_marines`), Necrons, and Daemons of Chaos.
  - **Halo, Destiny & Mass Effect**: Sangheilis, Forerunners, Cabals, Awokens, Asaris, and Turians.
- **Gaming & MMORPG Lore**: World of Warcraft, The Elder Scrolls, The Witcher, Final Fantasy, Guild Wars, Diablo, and EVE Online.
- **Real-World Historical & Cultural**: 130 cultural name models including Anglo-Saxon, Norse/Viking, Roman, Egyptian, and Japanese.
- **Places & Lore**: Castles, dungeons, taverns, islands, potions, spells, guilds, and weapons.
- **Procedural Descriptions & Backstories**: Full multi-sentence narrative blocks for characters, planets, and backstory hooks (`--descriptions-backstorys`).

---

### Key CLI Capabilities

- **Docker-Style Slug Generation**: Clean, readable pairings like `brave-nebula` or `quantum-falcon`.
- **Casing Transformation**:
  - Default: `adjective-noun`
  - `--slug` / `--kebab`: Standard URL-safe lowercase kebab-case.
  - `--camel`: `camelCase` format (`braveNebula`).
  - `--cap`: `CapWords` / `PascalCase` format (`BraveNebula`).
- **Flexible Delimiters**: Custom separators (`-s '_'`) or null concatenation (`-x`).
- **Structured Data Feeds**: Export directly as a JSON array (`--json`) or CSV rows (`--csv`).
- **Deterministic Seeding**: Reproduce exact outputs across runs using `-S, --seed <NUM>`—essential for reproducible game world builds and unit tests.
- **Uniqueness Guarantee**: Batch outputs can guarantee zero collisions with `-u, --unique`.
- **Full Shell Completions**: Comprehensive autocompletions for all 907 generator flags in Bash, Zsh, and Fish.

---

### Installation

#### Building from Source (CMake)
```bash
git clone https://github.com/joshuacox/namgen.git
cd namgen

# Build with CMake
cmake -B build
cmake --build build

# Install binary, man pages, and shell completions
sudo cmake --install build
```

#### Parallel Direct Make Build
```bash
make -j$(nproc)
sudo make install
```

---

### Usage & Examples

#### 1. Generate Standard Hostname / Container Slugs
Generate 3 memorable kebab-case names:

```bash
namgen -c 3
```
*Output:*
```text
brave-nebula
quantum-falcon
swift-badger
```

#### 2. PascalCase / CapWords for Code Identifiers
```bash
namgen --cap -c 2
```
*Output:*
```text
SilentEcho
VividMountain
```

#### 3. Procedural Fantasy Names
Generate dragons, castles, or dungeons for your worldbuilding notes:

```bash
namgen --fantasy-dragons -c 2
namgen --places-castles -c 2
```

#### 4. Sci-Fi & Pop Culture Generators
```bash
namgen --star_wars-mandalorians -c 2
namgen --star_trek-klingons -c 2
namgen --warhammer_40k-space_marines -c 2
```

#### 5. Pipeline JSON Output
Produce machine-readable arrays directly for shell scripts or web services:

```bash
namgen --slug --json -c 4
```
*Output:*
```json
["iron-phoenix", "mystic-citadel", "solar-sentinel", "frost-haven"]
```

#### 6. Reproducible Deterministic Generation
```bash
namgen --seed 42 --dungeon_and_dragons-dwarfs -c 2
```

---

### Links & Documentation

- **Website & Interactive Playground**: [https://joshuacox.github.io/namgen/](https://joshuacox.github.io/namgen/)
- **GitHub Repository**: [https://github.com/joshuacox/namgen](https://github.com/joshuacox/namgen)
- **Bug Reports & Contributions**: [https://github.com/joshuacox/namgen/issues](https://github.com/joshuacox/namgen/issues)
