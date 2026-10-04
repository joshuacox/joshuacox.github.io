---
title: "wgu - WireGuard Configuration Assistant and Rotation Tool"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags: 
  - linux
  - wireguard
  - vpn
  - networking
  - bash
---

If you manage a large collection of WireGuard VPN configurations—such as the hundreds of endpoint profiles provided by VPN services like Mullvad—switching between endpoints or rotating servers cleanly from the terminal can quickly become tedious.

To solve this, I built **[wgu](https://joshuacox.github.io/wgu/)** ([GitHub repository](https://github.com/joshuacox/wgu)), a lightweight, zero-dependency command-line assistant and companion daemon utility designed to effortlessly manage and randomly rotate WireGuard connections across server profiles worldwide or filtered by country code.

---

### What is `wgu`?

`wgu` simplifies WireGuard endpoint selection down to a single command. Point it to your directory of `.conf` files (defaults to `/etc/wireguard`), and it handles selecting, tearing down old links, and bringing up new tunnels.

Key features include:
- **Random Configuration Selection**: Pick and connect to a random WireGuard endpoint from your pool of configs.
- **Country-Specific Filtering**: Filter endpoints by country code (e.g. `us`, `se`, `nl`, `de`).
- **Clean Teardown with `wgd`**: Comes with a companion helper script (`wgd`) to detect running WireGuard interfaces and cleanly bring them down before initiating a new connection.
- **Zero Extra Dependencies**: Written purely in Bash and uses standard `wg-quick` tooling under the hood.
- **Flexible Configuration**: Set your config directory and verbosity preferences in `~/.config/wgu/config` or via environment variables.

---

### Quick Install

You can install `wgu` via the one-liner bootstrap script:

```bash
curl -sL https://raw.githubusercontent.com/joshuacox/wgu/refs/heads/master/bootstrap.sh | bash
```

Or clone the repository and install it directly:

```bash
git clone https://github.com/joshuacox/wgu.git
cd wgu
./configure
sudo make install
```

Make sure you have WireGuard and `wg-quick` installed on your system (e.g., `sudo apt install wireguard`).

---

### Usage

Using `wgu` is designed to be as fast and intuitive as possible:

- **Connect to a random endpoint worldwide:**
  ```bash
  wgu
  ```

- **Connect to a random server in the United States:**
  ```bash
  wgu us
  ```

- **Connect to a random Swedish server:**
  ```bash
  wgu se
  ```

- **Tear down any active WireGuard tunnels:**
  ```bash
  wgd
  ```

---

### Configuration Options

By default, `wgu` looks for WireGuard configurations inside `/etc/wireguard`. You can customize this by setting `WG_DIR` in `~/.config/wgu/config` or `~/.wgu_config`:

```bash
WG_DIR=/path/to/your/configs
VERBOSITY=1
WG_D_B4_U=1 # Automatically bring down active tunnels before connecting
```

---

### Check it out

For more details, documentation, and source code, visit the project page:
- Website: [https://joshuacox.github.io/wgu/](https://joshuacox.github.io/wgu/)
- GitHub: [https://github.com/joshuacox/wgu](https://github.com/joshuacox/wgu)
