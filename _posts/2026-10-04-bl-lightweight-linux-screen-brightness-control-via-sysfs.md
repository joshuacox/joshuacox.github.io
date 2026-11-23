---
title: "bl - Lightweight Linux Screen Brightness Control via Sysfs"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags:
  - linux
  - cli
  - sysfs
  - cpp
  - i3
  - wayland
photo_url: /img/bl-banner.png
---

Adjusting laptop display brightness on minimal Linux setups (such as tiling window managers like i3, bspwm, Sway, or Hyprland) often introduces awkward compromises: bulky desktop environment helper daemons, sluggish GUI utilities, or manual `echo` hacks into `/sys/class/backlight` requiring complicated sudoer rule configurations.

[bl](https://joshuacox.github.io/bl/) is a fast, lightweight backlight utility designed specifically for Linux sysfs interfaces. Written in modern C++17 (with a companion Bash fallback), it delivers instantaneous relative stepping and absolute percentage brightness adjustments with automatic privilege elevation.

---

### What is bl?

`bl` interacts directly with Linux kernel backlight devices exposed under `/sys/class/backlight/` (e.g. `intel_backlight`, `amdgpu_bl0`, or `acpi_video0`). It queries the driver's maximum hardware steps, accurately maps percentages to raw device integer registers, and handles writes seamlessly.

If launched as an unprivileged user without write permissions to the sysfs brightness interface, `bl` automatically re-invokes itself via `sudo`, preserving command-line arguments so brightness keys and terminal commands never fail silently.

Check out the documentation and architecture details at [joshuacox.github.io/bl](https://joshuacox.github.io/bl/) or visit the [GitHub repository](https://github.com/joshuacox/bl).

---

### Key Features

- **Direct Sysfs Integration**: Talks directly to `/sys/class/backlight` without requiring heavy X11/Wayland display server bindings or D-Bus services.
- **Both Absolute & Relative Scaling**:
  - **Absolute Percentage**: `bl 50` sets the screen to 50% of maximum brightness.
  - **Relative Stepping**: `bl +10` increases brightness by 10%; `bl -10` decreases brightness by 10%.
- **Automatic Sudo Re-elevation**: Automatically elevates privileges via `sudo execvp` if write permissions are needed.
- **Instant Querying**: Running bare `bl` reports current display brightness as an exact percentage.
- **Safety Clamps**: Built-in thresholds prevent accidentally setting the backlight to 0% (which turns off many LCD backlights entirely, making recovery tricky).
- **Ideal for Keyboard Shortcuts**: Fast sub-millisecond execution time makes it the perfect target for `XF86MonBrightnessUp` and `XF86MonBrightnessDown` multimedia keys.

---

### Installation

#### One-Line Automated Install
Install directly to `/usr/local/bin`:

```bash
curl -sL https://raw.githubusercontent.com/joshuacox/bl/refs/heads/main/bootstrap.sh | bash
```

#### Build from Source (CMake)
```bash
git clone https://github.com/joshuacox/bl.git
cd bl
mkdir -p build && cd build
cmake ..
make
sudo make install
```

The compiled binary `bl` is installed to `/usr/local/bin`.

---

### Usage & Examples

#### 1. Check Current Brightness
```bash
bl
```
*Output: `The screen is at 45% of total brightness`*

#### 2. Set to Absolute Brightness Percentage
Set brightness to 75%:
```bash
bl 75
```

Set to minimum readable brightness for dark rooms:
```bash
bl 10
```

#### 3. Relative Brightness Adjustments
Step up by 15%:
```bash
bl +15
```

Step down by 10%:
```bash
bl -10
```

---

### Window Manager Integration

`bl` is built to be mapped directly to your hardware brightness keys in your window manager or compositor config:

#### i3 / Sway Config (`~/.config/i3/config` or `~/.config/sway/config`)
```bash
# Brightness controls
bindsym XF86MonBrightnessUp exec --no-startup-id bl +5
bindsym XF86MonBrightnessDown exec --no-startup-id bl -5
```

#### Hyprland Config (`~/.config/hypr/hyprland.conf`)
```ini
bind = , XF86MonBrightnessUp, exec, bl +5
bind = , XF86MonBrightnessDown, exec, bl -5
```

#### Passwordless Sudoers Setup (Optional)
To avoid password prompts when adjusting brightness, add a single sudoers entry for `bl`:
```text
%wheel ALL=(ALL) NOPASSWD: /usr/local/bin/bl
```

---

### Links & Documentation

- **Project Site**: [https://joshuacox.github.io/bl/](https://joshuacox.github.io/bl/)
- **GitHub Repository**: [https://github.com/joshuacox/bl](https://github.com/joshuacox/bl)
- **Issue Tracker**: [https://github.com/joshuacox/bl/issues](https://github.com/joshuacox/bl/issues)
