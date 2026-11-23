---
title: "bomsaway - Make UTF-8 Byte Order Marks (BOM) Go Away"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags: 
  - linux
  - bash
  - jekyll
  - cli
  - vim
photo_url: /img/bomsaway-banner.png
---

If you have ever worked on a static site generator like Jekyll, Hugo, or Next.js, or compiled source code with a strict parser, you might have run into mysterious build breaks, unexpected leading whitespace, or parsing errors on line 1 column 1.

Nine times out of ten, the culprit is an invisible character: the UTF-8 **Byte Order Mark** (`\xEF\xBB\xBF`), or BOM. 

Windows text editors (and some misconfigured graphical tools) love prepending this byte sequence to Unicode files. While valid in UTF-16/32, RFC 3629 explicitly discourages BOMs in UTF-8, and UNIX tools like YAML parsers or Markdown compilers often choke on them.

To deal with this once and for all, check out **[bomsaway](https://joshuacox.github.io/bomsaway/)** ([GitHub repository](https://github.com/joshuacox/bomsaway)), a fast, Unix-friendly shell utility to find, detect, and cleanly strip BOMs across individual files or whole directories.

---

### Why Not Just Run `sed`?

You can certainly strip BOMs with a raw `sed` command:

```bash
sed -i '1 s/\xEF\xBB\xBF//' *.md
```

Or inside VIM by disabling the flag before saving:

```vim
:set nobomb
```

However, when you need to recursively process deeply nested directories, filter by file extension, handle platform quirks across Linux and macOS (Darwin's BSD sed vs GNU sed), avoid clobbering permissions, or run non-destructive dry runs with temp files, having a dedicated command in your `$PATH` saves a ton of time.

---

### What Can `bomsaway` Do?

Originally created by Enrico Maria Crisostomo as `bom-remove` and rebranded with a bit more punch as **bomsaway**, this CLI utility provides flexible options for batch cleanup:

- **Clean a specific file:**
  ```bash
  bomsaway file-to-clean.md
  ```

- **Clean an entire directory recursively:**
  ```bash
  bomsaway -r dir-to-clean/
  ```

- **Clean only specific file extensions (e.g. `.md` or `.yaml`):**
  ```bash
  bomsaway -e md -r docs/
  ```

- **Clean BOM occurrences throughout the entire file:**
  ```bash
  bomsaway -a file.txt
  ```

- **Prevent descending across mounted filesystems:**
  ```bash
  bomsaway -xr /data
  ```

---

### Quick Installation

You can install `bomsaway` directly using the one-liner bootstrap script:

```bash
curl -sL https://raw.githubusercontent.com/joshuacox/bomsaway/master/bootstrapbomsaway.sh | bash
```

Alternatively, clone the repository and install it to `/usr/local/bin`:

```bash
git clone https://github.com/joshuacox/bomsaway.git
cd bomsaway
sudo make install
```

Ansible playbooks are also included if you want to deploy `bomsaway` across your server fleet:

```bash
make play
```

---

### Project Links & Documentation

- Interactive Documentation: [https://joshuacox.github.io/bomsaway/](https://joshuacox.github.io/bomsaway/)
- GitHub Repository: [https://github.com/joshuacox/bomsaway](https://github.com/joshuacox/bomsaway)
