---
title: "agy_turbo - Unleashing Turbo Mode in the Antigravity CLI"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags:
  - antigravity
  - ai
  - cli
  - automation
  - devops
  - linux
  - tekromancy
  - open-source
photo_url: /img/agy-turbo-banner.jpg
description: "Configure the Google Antigravity CLI (agy) to run with unrestricted, frictionless Turbo mode—bringing autonomous agent workflows from the desktop IDE to headless terminal environments."
---

If you have worked with the Google Antigravity desktop IDE, you are likely familiar with **Turbo mode**—the setting that unlocks true autonomous agentic programming. Instead of prompting you to review every single diff, approve every terminal command, and confirm every artifact step, Turbo mode lets the agent execute multi-step plans, run builds, fix runtime bugs, and refactor codebases without constant micro-management.

However, many engineers don't just work in a graphical desktop IDE. We work over SSH on remote headless dev boxes, inside tmux sessions, on cloud workstations, or within automated container pipelines.

In those headless environments, the Antigravity command-line interface (`agy`) is our primary tool. But by default, `agy` is tuned for interactive confirmation: pausing for permissions, gating file writes, enforcing workspace sandboxes, and prompting before running shell commands. In an unattended terminal or background process, this interactive friction brings autonomous execution to an immediate halt.

To bridge this gap, [Tekromancy](https://github.com/Tekromancy) has released [**`agy_turbo`**](https://github.com/Tekromancy/agy_turbo)—a lightweight, zero-dependency configuration engine that brings the full power of Antigravity desktop's Turbo mode directly to the `agy` CLI.

---

### What Does Turbo Mode Actually Configure?

Under the hood, `agy` reads its global runtime behaviors from `~/.gemini/antigravity-cli/settings.json`. Hand-crafting this configuration file is tedious and error-prone, as it requires balancing legacy permission keys, modern fine-grained capabilities, domain whitelists, and trusted directory arrays.

`agy_turbo` solves this by providing a clean, declarative template (`settings.json.tpl`) powered by a straightforward `.env` file and a robust configuration script (`configure.sh`).

Here is a breakdown of the key settings configured by `agy_turbo`:

| Setting | Turbo Value | Effect in `agy` CLI |
| :--- | :--- | :--- |
| `agentMode` | `"accept-edits"` | Automatically applies code edits and file creations without pausing for confirmation diffs. |
| `toolPermission` | `"always-proceed"` | Grants instant approval to execute shell commands, read URLs, and query MCP tools. |
| `artifactReviewPolicy` | `"always-proceed"` | Proceeds immediately through multi-step plans and documentation artifacts. |
| `allowNonWorkspaceAccess` | `true` | Unlocks reading and writing files outside the active workspace directory. |
| `enableTerminalSandbox` | `false` | Runs shell commands natively without OS sandbox or container restrictions. |
| `trustedWorkspaces` | Dynamic `${DIR_LIST}` | Pre-populates trusted directories so `agy` never pauses to ask for workspace trust. |
| `permissions.allow` | Universal rules | Grants wildcard execution across commands, file I/O, MCP servers, and specified URL endpoints. |

```
                       ┌───────────────────────────────┐
                       │       .env Configuration      │
                       │ (DIR_LIST, URL_LIST, Policies)│
                       └──────────────┬────────────────┘
                                      │
                                      ▼
                       ┌───────────────────────────────┐
                       │         configure.sh          │
                       │  (Normalizer & Backup Engine) │
                       └──────────────┬────────────────┘
                                      │
                                      ▼
                       ┌───────────────────────────────┐
                       │         ~/.gemini/            │
                       │   antigravity-cli/            │
                       │     settings.json             │
                       └──────────────┬────────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
     [Unattended CI/CD]                              [Interactive Headless SSH]
   Zero-prompt automation                          Frictionless terminal speed
```

---

### Deep Dive: Overcoming CLI Sandboxes & Permission Gates

When running autonomous agents in headless environments, three common hurdles frequently break workflows:

#### 1. Cross-Workspace File Access
Modern software engineering frequently spans multiple repositories or touches external files—such as inspecting global shell configurations (`~/.bashrc`, `~/.zshrc`), referencing shared monorepo packages, or reading dotfiles managed with tools like GNU Stow. 

By default, `agy` strictly locks operations inside the current working directory. `agy_turbo` enables `allowNonWorkspaceAccess: true` and dynamically maps your home directory and custom project roots into `paths-allow` and `trustedWorkspaces`.

#### 2. Native Terminal Command Execution
Certain toolchains (such as Docker, Podman, systemctl, or hardware interaction tools) struggle when executed inside restricted command-line sandbox environments. By disabling `enableTerminalSandbox`, `agy` gains native shell execution privileges directly in the user's execution context, eliminating strange environment variable stripping and sandbox permission errors.

#### 3. Granular Whitelisting & Safety Nets
While `agy_turbo` opens up autonomous operation, it doesn't leave you defenseless. The configuration template explicitly supports:
- **`DENY_LIST`**: Hard-deny critical sensitive paths (e.g., `~/.ssh/id_rsa`, `~/.aws/credentials`).
- **`ASK_LIST`**: Force explicit user confirmation for specific high-risk commands (e.g., destructive `rm -rf` operations or production database drops).
- **`URL_LIST`**: Whitelist specific API domains, documentation mirrors, or package registries while preventing unexpected network calls.

---

### Safe Deployment & Lifecycle

`agy_turbo` was engineered with systems administration best practices in mind:

1. **Dry-Run Inspection**: You can preview the rendered JSON payload directly in your terminal before writing a single byte to disk:
   ```bash
   ./configure.sh --dry-run
   # or
   make dry-run
   ```

2. **Automated Backups**: Running `configure.sh` automatically creates a timestamped backup of your existing settings at `~/.gemini/antigravity-cli/settings.json.bak`.

3. **Strict File Permissions**: The rendered `settings.json` is automatically hardened to `chmod 600`, ensuring only your user account can inspect or modify agent permission policies.

---

### Quick Start: Up and Running in 60 Seconds

Setting up `agy_turbo` takes less than a minute:

```bash
# 1. Clone the repository
git clone https://github.com/Tekromancy/agy_turbo.git
cd agy_turbo

# 2. Copy the sample environment file
cp .env.example .env

# 3. (Optional) Customize trusted paths or URL rules in .env
vim .env

# 4. Populate your Antigravity CLI configuration
./configure.sh
# or: make install
```

Once installed, simply launch your agent using `agy`:

```bash
agy
```

Your CLI agent will immediately operate with full Turbo mode velocity—reading files, running builds, applying diffs, and solving complex coding tasks without unnecessary pauses.

---

### Sovereign Tooling for the Agentic Era

Autonomous agents are only as effective as the autonomy you grant them. When you want careful, supervised review, interactive modes are great. But when you want an agent to act like a true pair programmer—auditing dependencies, generating migration plans, or executing test suites while you grab a coffee—`agy_turbo` provides the speed and freedom you need.

* **GitHub Repository**: [https://github.com/Tekromancy/agy_turbo](https://github.com/Tekromancy/agy_turbo)
* **Collaborative Systems Research**: [https://tekromancy.com](https://tekromancy.com)
* **Browse All Dispatches**: [https://joshuacox.github.io/blog](https://joshuacox.github.io/blog)
