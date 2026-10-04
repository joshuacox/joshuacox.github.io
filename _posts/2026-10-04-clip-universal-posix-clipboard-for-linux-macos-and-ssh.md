---
title: "clip - Universal POSIX Clipboard for Linux, macOS & SSH"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags:
  - linux
  - cli
  - bash
  - wayland
  - ssh
  - productivity
photo_url: /img/clip-banner.png
---

Working across different Unix-like environments often means dealing with a fragmented mess of clipboard utilities: `wl-copy` / `wl-paste` on modern Wayland desktops, `xclip` or `xsel` on X11, `pbcopy` / `pbpaste` on macOS, and `clip.exe` under WSL. To make matters worse, copying text from a remote headless server over an SSH session or inside `tmux` usually requires awkward mouse highlighting or brittle X11 forwarding.

[clip](https://joshuacox.github.io/clip/) solves this by providing a unified, POSIX-compliant clipboard tool that works across all of these environments out of the box—with zero dependencies.

---

### What is clip?

`clip` is a lightweight command-line utility written in clean, standard `/bin/sh`. It automatically detects your display server, terminal capabilities, and operating system, routing clipboard input and output to the appropriate native backend without requiring manual configuration.

Beyond local graphical desktops, `clip` features first-class support for **OSC 52 ANSI escape sequences** (`--osc52`), allowing you to copy text from remote cloud servers, Docker containers, or `tmux` multiplexers straight to your local workstation's clipboard over standard SSH connections.

Check out the interactive documentation and terminal simulator at [joshuacox.github.io/clip](https://joshuacox.github.io/clip/) or visit the [GitHub repository](https://github.com/joshuacox/clip).

---

### Key Capabilities

- **Automatic Environment Detection**:
  - **Wayland**: Automatically delegates to `wl-copy` and `wl-paste`.
  - **X11**: Prefers `xclip`, falls back to `xsel`.
  - **macOS**: Native integration with `pbcopy` and `pbpaste`.
  - **Windows / WSL**: Hooks into `clip.exe` or `powershell.exe`.
  - **Remote SSH / Headless Sessions**: Leverages OSC 52 terminal escapes to write directly to your local emulator clipboard without network tunnels or display servers.
- **Pipe & File Inputs**: Pipe standard input (`command | clip`) or pass multiple files (`clip file1.txt file2.txt`) with upfront validation.
- **Paste & Symlink Support**: Output clipboard contents to stdout using `clip -p` or invoke via a convenient `paste` symlink.
- **Trailing Newline Trimming**: Strip trailing newlines with `-n` or `--trim`—ideal for copying secrets, passwords, git commit hashes, and URLs.
- **Primary Selection**: Target the middle-click primary selection buffer with `-s` / `--primary` on X11, Wayland, and supported terminals.
- **Clipboard Clearing**: Securely wipe clipboard buffers with `clip -c`.
- **Pure POSIX Compliance**: Written in clean `/bin/sh` with zero external build requirements or runtimes.
- **Shell Completions**: Includes tab-completion definitions for Bash, Zsh, and Fish.

---

### Installation

#### One-Line Quick Install
Install directly to your system:

```bash
curl -sL https://git.io/clipinstall | bash
```

#### Via Makefile (Recommended)
Installs `clip`, documentation man pages, and shell completions:

```bash
git clone https://github.com/joshuacox/clip.git
cd clip
sudo make install
```

To also install the handy `paste` symlink:

```bash
sudo make install-paste
```

#### Via Nix Flake
Run directly or install with Nix:

```bash
# Run immediately without installation
nix run github:joshuacox/clip -- --help

# Install to profile
nix profile install github:joshuacox/clip
```

#### Via Homebrew (macOS / Linux)
```bash
brew install joshuacox/clip/clip
```

---

### Usage & Examples

#### 1. Copying from Pipelines
Stream stdout directly into your clipboard:

```bash
date -I | clip
```

#### 2. Copying Without Trailing Newlines
Avoid accidental newlines when copying paths, hashes, or tokens:

```bash
pwd | clip -n
```

#### 3. Copying over Remote SSH (OSC 52)
Copy text from a remote server directly to your local physical machine's clipboard without X11 or Wayland forwarding:

```bash
ssh user@remote-box 'cat /etc/os-release' | clip --osc52
```

Or run `clip --osc52` directly inside your remote SSH terminal or `tmux` session:

```bash
cat id_ed25519.pub | clip --osc52
```

#### 4. Copying Files
Quickly load file contents into the clipboard:

```bash
clip ~/.ssh/id_rsa.pub
clip header.txt body.txt footer.txt
```

#### 5. Pasting Clipboard Contents
Output clipboard contents to stdout or redirect into a file:

```bash
clip -p > output.txt
```

*(If you installed the `paste` symlink, you can simply run `paste > output.txt`!)*

#### 6. Wiping Sensitive Clipboard Data
Clear the clipboard buffer immediately after pasting sensitive credentials:

```bash
clip -c
```

---

### Links & Documentation

- **Website & Interactive Playground**: [https://joshuacox.github.io/clip/](https://joshuacox.github.io/clip/)
- **GitHub Repository**: [https://github.com/joshuacox/clip](https://github.com/joshuacox/clip)
- **Issues & Contributions**: [https://github.com/joshuacox/clip/issues](https://github.com/joshuacox/clip/issues)
