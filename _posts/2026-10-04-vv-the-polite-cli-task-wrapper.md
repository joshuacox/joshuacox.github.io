---
title: "vv - The Polite CLI Task Wrapper with Audio & Desktop Alerts"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags: 
  - linux
  - bash
  - cli
  - productivity
  - devops
photo_url: /img/vv-banner.png
---

How many times have you launched an extensive build (`cargo build`, `make -j$(nproc)`, `docker build`), switched to your browser or another workspace, and completely forgotten about it for twenty minutes after it finished?

To solve this, I built **[vv](https://joshuacox.github.io/vv/)** ([GitHub repository](https://github.com/joshuacox/vv)), a lightweight command-line task wrapper that politely executes long-running processes, times their execution, and chimes with distinctive sound cues and desktop notifications the moment they complete.

---

### What Makes `vv` Special?

`vv` isn't just an alert script—it’s designed to be a polite Unix citizen:

1. **Audio Cues on Completion**: Plays audio upon finish. It distinguishes between **success** (exit `0`) and **failure** (non-zero exit) so you know immediately whether your build passed without even looking at your terminal.
2. **Universal Audio Player Support**: Auto-detects whatever player is present on your system—`canberra-gtk-play`, `paplay` (PulseAudio), `pw-play` (PipeWire), `afplay` (macOS), `aplay` (ALSA), `mpv`, `ogg123`, `ffplay`, or falls back gracefully to the terminal bell (`\a`).
3. **Desktop Notifications**: Dispatches native desktop notifications via `notify-send` (Linux) or `osascript` (macOS).
4. **Polite Process Scheduling**: Wraps commands automatically in `nice` (CPU scheduling) and `ionice` (I/O priority) so heavy compilation doesn't freeze your desktop responsiveness.
5. **Disk Writeback Sync**: Runs `sync` after completion so you know the exact time when kernel-buffered writes have safely flushed to physical disk.
6. **Preserves Exit Codes & Arguments**: Transparently preserves quotes, spaces, and exit statuses so you can chain it in pipelines (`vv make && vv make test`).

---

### Usage Examples

Prefix any command with `vv`:

- **Run package upgrades and get notified:**
  ```bash
  vv apt-get upgrade -y
  ```

- **Compile large projects:**
  ```bash
  vv make -j$(nproc)
  ```

- **Compile Rust projects without post-command disk sync:**
  ```bash
  VV_SYNC=0 vv cargo build --release
  ```

- **Preserves quotes and whitespace seamlessly:**
  ```bash
  vv cp -a "VirtualBox VMs" /mnt/backup/
  ```

---

### Installation

Install via the one-liner bootstrap script:

```bash
curl -sL https://raw.githubusercontent.com/joshuacox/vv/refs/heads/master/bootstrapvv.sh | bash
```

Or install manually using `install` or `cmake`:

```bash
git clone https://github.com/joshuacox/vv.git
cd vv
sudo install -m 0755 vv /usr/local/bin/vv
sudo install -m 0644 man/vv.1 /usr/local/share/man/man1/vv.1
```

Nix Flakes are also supported:

```bash
nix profile install github:joshuacox/vv
```

---

### Documentation & Links

- Interactive Documentation: [https://joshuacox.github.io/vv/](https://joshuacox.github.io/vv/)
- GitHub Repository: [https://github.com/joshuacox/vv](https://github.com/joshuacox/vv)
