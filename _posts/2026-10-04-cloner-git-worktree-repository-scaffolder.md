---
title: "cloner - Git Worktree Repository Scaffolding Tool"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags: 
  - git
  - worktree
  - linux
  - bash
  - cli
photo_url: /img/cloner-banner.png
---

Git worktrees are one of Git's most powerful yet underutilized features. They allow you to check out multiple branches simultaneously across separate working directories from a single repository, without stashing uncommitted changes, constantly switching branches, or re-running expensive build steps.

However, standard Git workflows usually begin with a standard clone (`git clone <url>`), leaving your default repository inside a working branch rather than configured cleanly as a bare hub for sibling worktrees.

To solve this, I built **[cloner](https://joshuacox.github.io/cloner/)** ([GitHub repository](https://github.com/joshuacox/cloner)), a zero-dependency CLI tool that clones a repository structured natively for **Git worktrees**.

---

### What Does `cloner` Do Under the Hood?

When you clone a repository with `cloner`:
1. It initializes the destination directory for your project.
2. It sets up a bare Git clone inside `.git/`.
3. It configures the fetch refspec (`+refs/heads/*:refs/remotes/origin/*`) so linked worktrees track remote branches seamlessly.
4. It dynamically detects the remote default branch (`main` or `master`) or honors your custom branch choice (`--branch <name>`).
5. It checks out the default branch into its own clean worktree directory right beside `.git/`.

Subsequent branches can then be created cleanly at any time:
```bash
git worktree add <new_branch>
```

Your resulting workspace layout is completely clean and modular:

```text
my-project/
├── .git/          # Bare Git storage hub
├── main/          # Default branch worktree
└── new_feature/   # Additional concurrent worktree
```

---

### Installation

You can install `cloner` via the one-liner bootstrap script:

```bash
curl -sL https://raw.githubusercontent.com/joshuacox/cloner/refs/heads/main/bootstrapcloner.sh | bash
```

Or install it locally with `make`:

```bash
git clone https://github.com/joshuacox/cloner.git
cd cloner
sudo make install
```

Shell completions for both **Bash** and **Zsh** are installed automatically!

---

### Common Usage Examples

- **Clone a repository using its default branch:**
  ```bash
  cloner git@github.com:joshuacox/cloner.git
  ```

- **Clone into a custom directory name:**
  ```bash
  cloner git@github.com:joshuacox/cloner.git my_cloner
  ```

- **Specify an initial branch:**
  ```bash
  cloner --branch develop git@github.com:joshuacox/cloner.git
  ```

- **Shallow clone with limited history (great for massive monorepos):**
  ```bash
  cloner --depth 1 git@github.com:torvalds/linux.git
  ```

---

### Resources & Documentation

- Interactive Documentation: [https://joshuacox.github.io/cloner/](https://joshuacox.github.io/cloner/)
- GitHub Repository: [https://github.com/joshuacox/cloner](https://github.com/joshuacox/cloner)
