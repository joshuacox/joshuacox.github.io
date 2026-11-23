---
title: "swappy - Create a Linux Swapfile Pretty Darn Quick (PDQ)"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags: 
  - linux
  - sysadmin
  - bash
  - devops
  - cli
photo_url: /img/swappy-banner.png
---

When spinning up cheap cloud VPS instances (like 512MB or 1GB RAM droplets), memory exhaustion is one of the most common issues you encounter. A single `npm install`, compile step, or Docker build can instantly trigger the Linux Out-Of-Memory (OOM) killer and terminate your process.

Setting up a temporary or persistent swapfile is the classic remedy, but manually typing out `dd`, `chmod 0600`, `mkswap`, and `swapon` every time you provision a machine is repetitive.

To automate this, I created **[swappy](https://joshuacox.github.io/swappy/)** ([GitHub repository](https://github.com/joshuacox/swappy)), a fast command-line assistant designed to create and activate a Linux swapfile **PDQ** (Pretty Darn Quick).

---

### What Does `swappy` Do?

Running `swappy init` automatically:
1. Allocates zero-filled swap blocks using `dd` with progress tracking.
2. Sets secure ownership and permissions (`root:root` with `0600` access mode).
3. Formats the file with `mkswap`.
4. Activates the swap space with `swapon` (optionally configuring swap priority).
5. Appends a cleanup entry to `/root/deleteswaps.sh` for convenient teardown when no longer needed.

---

### Usage Examples

- **Quick 1GB default swapfile:**
  ```bash
  swappy init
  ```
  *(Defaults to `/swapfile` of 1024MB at priority 1)*

- **Specify a custom path:**
  ```bash
  swappy init /mnt/extra_swap
  ```

- **Specify path and custom size (in MB):**
  ```bash
  swappy init /swapfile 4096
  ```

- **Specify path, size, and swap priority:**
  ```bash
  swappy init /swapfile 4096 3
  ```

- **List active swap partitions and files:**
  ```bash
  swappy list
  ```

---

### Quick Installation

Run the bootstrap installer directly:

```bash
curl -sL https://raw.githubusercontent.com/joshuacox/swappy/master/bootstrap | bash
```

Or clone the repository and install it to `/usr/local/bin`:

```bash
git clone https://github.com/joshuacox/swappy.git
cd swappy
sudo make install
```

Ansible deployment is also supported straight out of the box with the included playbook:

```bash
make play
```

---

### Documentation & Links

- Interactive Documentation: [https://joshuacox.github.io/swappy/](https://joshuacox.github.io/swappy/)
- GitHub Repository: [https://github.com/joshuacox/swappy](https://github.com/joshuacox/swappy)
