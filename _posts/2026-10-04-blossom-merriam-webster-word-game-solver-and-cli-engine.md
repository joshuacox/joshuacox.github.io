---
title: "blossom - Merriam-Webster Blossom Word Game Solver & Multiplier Engine"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags:
  - bash
  - cli
  - gaming
  - puzzles
  - linux
  - automation
photo_url: /img/blossom-banner.png
---

Word puzzles like Merriam-Webster's daily [Blossom Word Game](https://www.merriam-webster.com/games/blossom-word-game) test vocabulary, pattern recognition, and strategic foresight. Unlike standard anagram solvers or word grids where every valid word counts identically, Blossom introduces geometric and round-based scoring constraints:

1. **Center Requirement**: Every played word *must* include the central golden letter.
2. **Surrounding Petals**: Words can only use the surrounding 6 petal letters (and repeat letters if allowed).
3. **Length Scaling**: Longer words scale steeply from 2 points (4-letter words) up to 12 points (7-letter words) plus +3 points for each additional letter beyond 7.
4. **The Pangram Surge**: Using all 7 distinct letters in a single valid word awards an automatic **+7 point bonus**.
5. **Bonus Petal Multipliers**: Each round gives one petal a special bonus status. Every single occurrence of that bonus letter in your played word adds **+5 bonus points**.

When you're trying to achieve Genius or Master tier, calculating which candidate words yield maximum point density across specific bonus petals can turn into a serious combinatorial challenge.

Enter [blossom](https://joshuacox.github.io/blossom/)—a fast, POSIX-compliant terminal tool and interactive solver built to parse system wordlists, evaluate regex candidate filters, and score permutations in milliseconds.

---

### What is blossom?

`blossom` is a lightweight command-line utility (accompanied by an interactive browser solver at [joshuacox.github.io/blossom](https://joshuacox.github.io/blossom/)) that takes the center letter and petal letters, filters candidate words from your system dictionary, and prints a sorted breakdown of points:

```bash
# Basic syntax: ./blossom CENTER_LETTER PETAL_LETTERS [BONUS_LETTER]
./blossom e sombody m
```

Output:
```text
18	size_score( 5)  4 + bonus_score( 2) 10 + pangram_score  0	embosom
21	size_score( 6)  6 + bonus_score( 3) 15 + pangram_score  0	mommies
24	size_score( 7) 12 + bonus_score( 2) 10 + pangram_score  0	embodied
32	size_score( 8) 15 + bonus_score( 2) 10 + pangram_score  7	somebody_PANGRAM
```

Check out the project homepage and live web calculator at [joshuacox.github.io/blossom](https://joshuacox.github.io/blossom/) or visit the [GitHub repository](https://github.com/joshuacox/blossom).

---

### Key Capabilities

- **Zero-Dependency Unix Simplicity**: Built on standard POSIX shell tools (`grep`, `sed`, `sort`, `awk`), running effortlessly on Linux, macOS, and WSL.
- **Official Scoring Model**: Faithfully implements Merriam-Webster's tiered length brackets, +7 pangram awards, and +5 bonus letter multipliers.
- **Smart Disk Caching**: Stores parsed dictionary matches for a letter set in `/tmp/blossom_cache/${ALL_LETTERS}.txt`. When cycling through different bonus petals throughout the game, lookups return in sub-milliseconds without re-scanning system wordlists.
- **Custom Dictionaries**: Point `blossom` to any dictionary file (`DICTIONARY=/usr/share/dict/words ./blossom ...`) or Merriam-Webster wordlists.
- **Exhaustive Evaluation (`uber_blossom`)**: Run `uber_blossom` to automatically iterate through all surrounding petals, producing a comprehensive matrix of best possible words across every stage of the game.
- **Interactive Companion Web App**: Explore candidate words and calculate points directly in your browser with real-time reactive filters.

---

### Quickstart & Installation

You can bootstrap `blossom` instantly with the one-line installer:

```bash
curl -sL https://raw.githubusercontent.com/joshuacox/blossom/refs/heads/main/bootstrap.sh | bash
```

Alternatively, clone the repository directly:

```bash
git clone https://github.com/joshuacox/blossom.git
cd blossom
chmod +x blossom uber_blossom
```

#### 1. Basic Solver Query

Supply the center letter first, followed by the surrounding petal letters:

```bash
./blossom e sombody
```

If no bonus letter is provided, `blossom` cycles through all petal letters automatically, printing scored matches sorted from lowest to highest point yield.

#### 2. Target a Specific Bonus Petal

When playing a round with a designated bonus petal (e.g. `m`), append it as the 3rd argument:

```bash
./blossom e sombody m
```

Words with multiple instances of `m` (like `mommies` or `embosom`) will see their score surge with the +5 bonus multiplier per letter.

#### 3. Full Game Permutation with `uber_blossom`

To compare point ceilings across the entire puzzle:

```bash
./uber_blossom e sombody
```

---

### Under the Hood: Pipeline Architecture

The core of `blossom` is a clean demonstration of how fast standard Unix streams are for text manipulation:

1. **Negative Regex Class Construction**:
   ```bash
   grep1="[$PETAL_LETTERS]"
   grep2="[^$ALL_LETTERS]"
   ```
2. **Filtering Dictionary Stream**:
   The script pipes the dictionary through `grep`, ensuring the word contains the center letter, matches petal letters, and contains no invalid characters:
   ```bash
   grep "$CENTER_LETTER" "$DICTIONARY" \
     | grep -P "$grep1" \
     | grep -v -P "$grep2" \
     | grep -v -P '^\S{1,3}$' \
     | sort > "$TMP/sorted"
   ```
3. **Pangram Detection via `sed`**:
   The script verifies character uniqueness against the full set (`$ALL_LETTERS`) by stripping extraneous characters and testing coverage.
4. **Multiplier Aggregation**:
   Scores are calculated on the fly and piped to `sort -n` to surface the highest scoring plays at the bottom of your terminal.

---

### Try It Out

Whether you want an algorithmic companion while playing your daily puzzle, need a dictionary testing tool, or want to explore the interactive web interface, check out:

- **Documentation & Web Solver**: [https://joshuacox.github.io/blossom/](https://joshuacox.github.io/blossom/)
- **GitHub Repository**: [https://github.com/joshuacox/blossom](https://github.com/joshuacox/blossom)
- **Official Game**: [Merriam-Webster Blossom Word Game](https://www.merriam-webster.com/games/blossom-word-game)
