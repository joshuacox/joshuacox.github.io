---
title: "mirror - Robust Offline Website Mirroring with Wget"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags:
  - wget
  - linux
  - cli
  - archiving
  - bash
  - devops
photo_url: /img/mirror-banner.png
---

Archiving documentation sites, backing up static web portals, or preparing reference materials for offline travel usually leads developers to GNU Wget. However, anyone who has tried running `wget --mirror` raw knows the pitfalls: external CSS and fonts don't download, absolute links remain pointed at the live web, default User-Agents trigger immediate HTTP 403 Forbidden responses, and aggressive rapid requests risk IP rate-limiting.

[mirror](https://joshuacox.github.io/mirror/) is a streamlined shell utility that wraps GNU Wget with battle-tested, sensible defaults. It produces 100% functional, self-contained local copies of websites with relative link rewriting, external asset resolution, polite crawling delays, and modern browser headers.

---

### What is mirror?

`mirror` bundles the correct combination of Wget flags into a clean, concise CLI. Behind the scenes, it configures:

- `--mirror` (`-m`): Turns on recursion, infinite depth, timestamping, and keep-session artifacts.
- `--convert-links` (`-k`): Rewrites URLs in downloaded HTML and CSS documents so they point directly to local files rather than the live web.
- `--adjust-extension` (`-E`): Appends `.html` or `.css` extensions to clean URLs so local desktop browsers render them properly from the disk.
- `--page-requisites` (`-p`): Downloads all inline images, stylesheets, scripts, and media needed to display the page offline.
- `--no-parent` (`-np`): Guarantees the crawler never ascends to parent directories above the target root.
- `--continue` (`-c`): Resumes interrupted downloads smoothly without starting from scratch.
- `--random-wait` & `--wait`: Introduces polite request jitter to prevent server bans.
- **Modern Desktop User-Agent**: Sends realistic browser headers to avoid automated anti-bot 403 Forbidden errors.

Check out the interactive documentation at [joshuacox.github.io/mirror](https://joshuacox.github.io/mirror/) or visit the [GitHub repository](https://github.com/joshuacox/mirror).

---

### Key Capabilities

- **One-Command Full Clones**: Run `mirror https://docs.example.com` and get an offline replica ready to browse via `file://`.
- **Domain Spanning (`-s`, `-D`)**: Seamlessly crawl required static assets hosted across external CDN hostnames (e.g. `cdn.example.com`, `assets.example.com`).
- **Target Output Directory (`-o`)**: Route files into dedicated archive paths (`mirror -o ~/Archives/example https://example.com`).
- **Polite Crawling (`-w`)**: Configure courteous delay intervals between consecutive HTTP requests.
- **Robots.txt Override (`--no-robots`)**: Allow crawling of documentation areas restricted to search engine indexers.
- **Debug Inspection (`--debug`)**: Inspect the exact synthesized `wget` argument array before execution.
- **Pass-through Flag Support**: Pass extra arbitrary Wget arguments after `--` (e.g. `mirror https://example.com -- --limit-rate=500k`).

---

### Installation

#### Automated Bootstrap
Install directly into `/usr/local/bin`:

```bash
curl -sL https://raw.githubusercontent.com/joshuacox/mirror/master/bootstrap | bash
```

#### From Source (Make)
```bash
git clone https://github.com/joshuacox/mirror.git
cd mirror

# System-wide install
sudo make install

# Or rootless install to ~/.local/bin
make PREFIX="$HOME/.local" install
```

#### Via Ansible Playbook
```bash
ansible-playbook mirror.yaml
```

---

### Everyday Usage & Recipes

#### 1. Mirror an Entire Documentation Site
Download an offline copy into the current directory:

```bash
mirror https://docs.example.com
```

#### 2. Save into Archive Directory with Rate Limiting
Politely crawl a site with a 2-second delay between requests:

```bash
mirror -o ~/offline-docs/k8s -w 2 https://kubernetes.io/docs/
```

#### 3. Span CDN and Static Asset Subdomains
Ensure fonts, scripts, and graphics from separate subdomains are included:

```bash
mirror -s -D example.com,cdn.example.com,assets.example.com https://example.com
```

#### 4. Dry Run / Debug Command Output
Verify the exact flags Wget will receive:

```bash
mirror --debug https://example.com
```

#### 5. Bandwidth Throttling
Pass Wget flags directly using the `--` separator:

```bash
mirror https://example.com -- --limit-rate=1m
```

---

### Links & Documentation

- **Documentation Site**: [https://joshuacox.github.io/mirror/](https://joshuacox.github.io/mirror/)
- **GitHub Repository**: [https://github.com/joshuacox/mirror](https://github.com/joshuacox/mirror)
- **Issues & Contributions**: [https://github.com/joshuacox/mirror/issues](https://github.com/joshuacox/mirror/issues)
