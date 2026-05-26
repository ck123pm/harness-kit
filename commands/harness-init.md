---
name: harness-init
description: Initialize .harness/ AI Engineering Harness directory structure, inject actual project code knowledge
---

# Harness Init

Based on the latest code on the current branch, initialize the corresponding files according to the directory structure below.

**Core Principles (strictly follow):**
1. **Don't record what code can derive**: Information the AI can derive directly from source code (class names, method signatures, simple logic) should not be recorded
2. **Split high-cost derivation info by type**: Project identity goes to `index/project-profile.md`, data flow/message flow and external system runtime semantics (DB/QMQ/RPC/translation service/lock/CAT/Shark) go to `guides/backend.md`, high-risk chains go to `rules/architecture.md`
3. **Undervable content goes to decisions**: Design decisions, historical reasons, trade-offs (why use magic numbers, why dual type system) go into `decisions/`
4. **Human-readable content in human-docs/**: onboarding, architecture intro, operation manuals — generate md first, convert to HTML, then delete the md
5. **Don't hardcode non-existent content**: Must derive from real project code, don't fabricate

**Target Directory Structure:**

```
.harness/
│
├── README.md
│   # Harness usage: principles, lifecycle, injection strategy
│
├── index/
│   ├── routing.md
│   │   # Task/phase/module → which context to inject (most important, decides context routing)
│   ├── priority.md
│   │   # Injection priority and intensity: MUST / SHOULD / HINT
│   ├── module-map.md
│   │   # Module → rules/domain/guides/memory mapping
│   └── project-profile.md
│       # Project identity card: app id, purpose, tech stack, runtime, key entry points, constants
│
├── rules/
│   ├── architecture.md
│   │   # Architecture constraints: dependency direction, module boundaries, Ownership, high-risk chains, prohibited cross-domain behavior
│   ├── coding.md
│   │   # Coding standards: naming, annotations, serialization, distributed locks
│   ├── testing.md
│   │   # Test rules: framework, file matching, strategy, fast test commands
│   └── security.md
│       # Security constraints: data security, SQL security, concurrency security, external call security
│
├── domain/
│   ├── glossary.md
│   │   # Domain terminology: core concepts, POI types, category IDs
│   ├── business-rules.md
│   │   # Long-term business rules
│   └── runtime-semantics.md
│       # Business semantics, state transitions, magic values, runtime rules
│
├── decisions/
│   ├── adr/
│   │   # Architecture Decision Records
│   └── tradeoffs.md
│       # Design tradeoffs: why designed this way, why not change casually
│
├── guides/
│   ├── backend.md
│   │   # AI execution manual: external system runtime semantics, message flow, new Service/Consumer/Producer, distributed locks, transactions
│   └── ops.md
│       # Operations manual: startup modes, logs, builds, config, monitoring, troubleshooting
│
├── memory/
│   ├── pitfalls.md
│   │   # Historical pitfall experiences
│   ├── regressions.md
│   │   # Historical regression issues
│   ├── patterns.md
│   │   # Reusable engineering patterns
│   └── lessons.md
│       # Long-term experience summary
│
└── human-docs/
    ├── onboarding.html
    │   # Newcomer onboarding (for humans, not injected to AI)
    ├── architecture-intro.html
    │   # Architecture intro for humans (not injected to AI)
    └── operation-manual.html
        # Operation manual for humans (not injected to AI)
```

**Content Split Rules:**

| Information Type | Location | Reason |
|---|---|---|
| Project identity (app id, tech stack, module structure, key constants) | `index/project-profile.md` | High-frequency access, quick project overview |
| Data flow/message flow (QMQ Topic, consumption chains) | `guides/backend.md` | Reference when developing new features |
| External system runtime semantics (DB/QMQ/RPC/translation/lock/CAT/Shark) | `guides/backend.md` | Integration knowledge needed for coding |
| ops (startup, logs, build, config, monitoring, troubleshooting) | `guides/ops.md` | Operations and publishing |
| High-risk chains | `rules/architecture.md` | Part of architecture constraints |
| Module boundaries/Ownership/prohibited cross-domain | `rules/architecture.md` | Part of architecture constraints |
| Design decisions/tradeoffs | `decisions/` | Understanding "why designed this way" |

**Exploration Strategy:**

1. Read project metadata: package.json/pom.xml (module structure, dependencies, versions), README.md, AGENTS.md
2. Identify tech stack: framework versions, RPC mode, database, message queue, cache
3. Map module boundaries: each module's responsibilities, dependency directions, prohibited behaviors
4. Deep dive into key code:
   - Service entry points
   - Entity definitions
   - Consumer/Producer (message flow, Topic, serialization mode)
   - Enums and state machines
   - Config files (databases, external services, feature flags)
   - Test structure
5. Check git history: recent commits, fix records, regressions

**Execution Steps:**

1. Thoroughly explore the project's real structure (at least 3 rounds: tech stack → modules → data flow/message flow). If codegraph MCP is available, prefer using it.
2. Create all `.harness/` directories and files based on actual code content, split info by content rules
3. For `human-docs/`, write `.md` first, then call `md-to-html-doc` skill to convert to `.html`, then delete `.md`
4. After completion, verify directory structure is complete
