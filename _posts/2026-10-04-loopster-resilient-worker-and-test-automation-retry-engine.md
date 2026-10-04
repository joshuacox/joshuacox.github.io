---
title: "loopster - Resilient Worker & Test Automation Retry Engine"
published: true
layout: post
disqus: yes
fbcomments: no
category: blog
tags:
  - bash
  - cli
  - testing
  - automation
  - devops
  - ai
photo_url: /img/loopster-banner.png
---

Whether polling a cloud microservice until healthchecks pass, waiting for a Docker container to finish bootstrapping, handling flaky network tests in CI/CD pipelines, or orchestrating autonomous AI coding agents (like Aider or Claude Code) that iterate until compilation and unit tests pass—developers constantly write ad-hoc `while` loops in Bash.

However, ad-hoc shell loops usually lack exponential backoff, crash abruptly without cleaning up temporary resources, and fail to provide structured diagnostic verbosity.

[loopster](https://joshuacox.github.io/loopster/) is a resilient Bash automation utility designed to solve this. It decouples the *worker* action from the *test* validation, running the worker repeatedly with configurable retry limits, exponential backoff, and dedicated lifecycle cleanup hooks.

---

### What is loopster?

`loopster` introduces a structured, bulletproof pattern for iterative tasks:

1. **Worker Command (`--loop <cmd>`)**: The action to execute during each iteration (e.g. prompt an AI agent, poll an endpoint, restart a service).
2. **Verification Command (`--test <cmd>`)**: The test command that confirms success (exits with code `0`).
3. **Exponential Backoff (`--backoff <factor>`, `--max-wait <sec>`)**: Incrementally increases delay between consecutive failures to avoid overloading services.
4. **Lifecycle Teardown Hooks**:
   - `--success-cleanup <cmd>`: Runs immediately when the test succeeds.
   - `--fail-cleanup <cmd>`: Runs if retries are exhausted or if the process receives `SIGINT` (Ctrl+C).

Check out the interactive command builder and documentation at [joshuacox.github.io/loopster](https://joshuacox.github.io/loopster/) or explore the [GitHub repository](https://github.com/joshuacox/loopster).

---

### Key Capabilities

- **Separation of Concerns**: Keep your worker action separate from your validation check.
- **Configurable Backoff & Jitter**: Supports fixed wait intervals (`--wait <sec>`), exponential backoff multipliers (`--backoff 2`), and upper limits (`--max-wait 30`).
- **Finite or Infinite Retries**: Set maximum retry budgets (`-c 10`) or run indefinitely (`--infinite`) for permanent daemons.
- **Graceful Signal Handling**: Traps `SIGINT` and `SIGTERM` cleanly, guaranteeing that failure cleanup routines run even if manually interrupted.
- **Layered Squawk Logging**: Built-in tiered verbosity (`-v` or `--verbosity <lvl>`) provides formatted visual diagnostics without cluttered terminal noise.
- **Flexible Defaults via Environment Variables**: Every parameter can be overridden using environment variables (`$COUNT`, `$TEST`, `$LOOP`, `$WAIT`, `$BACKOFF`).

---

### Installation

#### Automated Bootstrap
Install directly into `/usr/local/bin`:

```bash
curl -sL https://raw.githubusercontent.com/joshuacox/loopster/refs/heads/main/bootstrap.sh | bash
```

#### From Source (CMake)
```bash
git clone https://github.com/joshuacox/loopster.git
cd loopster
cmake .
make
sudo make install

# Optionally generate .deb or .tar.gz packages
cpack
```

---

### Real-World Use Cases

#### 1. Waiting for Database / Service Readiness
Wait for a local service container to boot with exponential backoff before running database migrations:

```bash
loopster \
  --test "curl -fsS http://localhost:8080/healthz" \
  --loop "echo 'Waiting for service container to initialize...'" \
  --wait 2 \
  --backoff 2 \
  --max-wait 30 \
  --count 15 \
  --success-cleanup "./run-migrations.sh" \
  --fail-cleanup "docker compose logs --tail 50"
```

#### 2. Autonomous AI Coding Loop
Iterate with an AI assistant until code compiles and tests pass:

```bash
loopster \
  --count 8 \
  --loop "aider --file src/main.c -m 'Fix memory leak and pass all assertions in test suite'" \
  --test "make clean && make && ./bin/test_suite" \
  --success-cleanup "git commit -am 'Autonomous fix succeeded'" \
  --fail-cleanup "git checkout -b fix-failed-investigate"
```

#### 3. Flaky CI/CD Test Retries
Automatically retry intermittent integration test suites while capturing diagnostic traces:

```bash
loopster \
  --count 3 \
  --wait 5 \
  --test "./run-e2e-tests.sh" \
  --fail-cleanup "tar -czf failure-artifacts.tar.gz ./logs"
```

---

### Links & Documentation

- **Website & Interactive Generator**: [https://joshuacox.github.io/loopster/](https://joshuacox.github.io/loopster/)
- **GitHub Repository**: [https://github.com/joshuacox/loopster](https://github.com/joshuacox/loopster)
- **Issues & Contributions**: [https://github.com/joshuacox/loopster/issues](https://github.com/joshuacox/loopster/issues)
