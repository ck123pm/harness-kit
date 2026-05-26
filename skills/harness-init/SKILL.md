---
name: harness-init
description: Initialize a project's .harness/ directory by deriving high-value project knowledge from the real codebase, splitting content into the expected index/rules/domain/decisions/guides/memory/human-docs structure, and avoiding facts that can be re-derived from source.
---

# Harness Init

Use this skill when the user wants to initialize a project's `.harness/` directory from the current codebase state.

## Core Principles

1. Do not record what the AI can cheaply derive from source code.
2. Split expensive-to-derive knowledge by type and place it in the right file.
3. Put design decisions, historical reasons, and tradeoffs into `decisions/`.
4. Put human-oriented docs in `human-docs/` as Markdown first, convert them to HTML with `md-to-html-doc`, then remove the Markdown source if the workflow requires generated HTML only.
5. Never fabricate content that is not supported by the actual repository state.

## Target Directory Structure

Create this structure under `.harness/`:

```text
.harness/
├── README.md
├── index/
│   ├── routing.md
│   ├── priority.md
│   ├── module-map.md
│   └── project-profile.md
├── rules/
│   ├── architecture.md
│   ├── coding.md
│   ├── testing.md
│   └── security.md
├── domain/
│   ├── glossary.md
│   ├── business-rules.md
│   └── runtime-semantics.md
├── decisions/
│   ├── adr/
│   └── tradeoffs.md
├── guides/
│   ├── backend.md
│   └── ops.md
├── memory/
│   ├── pitfalls.md
│   ├── regressions.md
│   ├── patterns.md
│   └── lessons.md
└── human-docs/
    ├── onboarding.html
    ├── architecture-intro.html
    └── operation-manual.html
```

## Content Routing

| Information type | Destination |
| --- | --- |
| Project identity, tech stack, module structure, key constants | `index/project-profile.md` |
| Task-to-context routing | `index/routing.md` |
| Injection priority and intensity | `index/priority.md` |
| Module-to-spec mapping | `index/module-map.md` |
| Architecture constraints, module boundaries, ownership, high-risk chains | `rules/architecture.md` |
| Coding standards, serialization, locking, conventions | `rules/coding.md` |
| Test framework, file layout, strategy, fast commands | `rules/testing.md` |
| Security constraints | `rules/security.md` |
| Domain terminology | `domain/glossary.md` |
| Stable business rules | `domain/business-rules.md` |
| Runtime semantics, state transitions, magic values | `domain/runtime-semantics.md` |
| External-system runtime semantics, message flow, integration behavior | `guides/backend.md` |
| Build, startup, logs, config, monitoring, troubleshooting | `guides/ops.md` |
| ADRs and tradeoffs | `decisions/` |
| Historical pitfalls, regressions, reusable patterns, lessons | `memory/` |

## Exploration Strategy

Before writing files, inspect the repository in at least three passes:

1. Project metadata and top-level docs: `package.json`, `pom.xml`, `README`, `AGENTS.md`, workspace config.
2. Module boundaries and entry points: application bootstraps, services, APIs, entities, consumers, producers, config, tests.
3. Runtime and history signals: external integrations, state machines, queues, locks, transactions, recent commits, regressions.

Prefer CodeGraph when it is available. Use local search only when you need literal text or filesystem details.

## Execution

1. Explore the repository thoroughly and base all outputs on the current branch state.
2. Create the full `.harness/` tree, even if some files are initially brief.
3. Keep generated content concise and high-signal.
4. If `human-docs/` content is needed, write Markdown first, then use `md-to-html-doc` to produce HTML.
5. Verify the final `.harness/` tree is complete.
