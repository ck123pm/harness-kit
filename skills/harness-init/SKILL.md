---
name: harness-init
description: Initialize a project's .harness/ directory by exploring the real codebase and generating structured project knowledge docs. Use when starting harness for a new project or rebuilding stale .harness/ content.
---

# Harness Init

## Core Principles

1. Do not record what the AI can cheaply derive from source code.
2. Split expensive-to-derive knowledge by type and place it in the right file.
3. Put design decisions, historical reasons, and tradeoffs into `decisions/`.
4. Put human-oriented docs in `wiki/` — write Markdown in `templates/wiki/`, convert to HTML with `md-to-html-doc`, place HTML in `.harness/wiki/`, remove Markdown source if workflow requires HTML only.
5. Never fabricate content that is not supported by the actual repository state.

## Directory Structure and Content Routing

The `.harness/` directory uses a category-based layout. The reference files below are **starting points** — create only files with real content, add new files when needed, and skip empty placeholders.

```text
.harness/
├── README.md           # always create: use templates/harness-readme.md
├── index/
│   ├── routing.md      # always create
│   ├── priority.md     # always create
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
└── wiki/                # always create as HTML via templates/wiki/
    ├── overview/
    ├── architecture/
    ├── business/
    ├── onboarding/
    ├── decisions/
    └── pitfalls/
```

| Information type | Reference file |
| --- | --- |
| Project identity, tech stack, module structure | `index/project-profile.md` |
| Task-to-context routing | `index/routing.md` |
| Injection priority and intensity | `index/priority.md` |
| Module-to-spec mapping | `index/module-map.md` |
| Architecture constraints, boundaries, ownership | `rules/architecture.md` |
| Coding standards, conventions | `rules/coding.md` |
| Test framework, strategy, commands | `rules/testing.md` |
| Security constraints | `rules/security.md` |
| Domain terminology | `domain/glossary.md` |
| Stable business rules | `domain/business-rules.md` |
| Runtime semantics, state transitions | `domain/runtime-semantics.md` |
| External integrations, message flow | `guides/backend.md` |
| Build, config, monitoring, troubleshooting | `guides/ops.md` |
| ADRs, design tradeoffs | `decisions/` |
| Pitfalls, regressions, patterns, lessons | `memory/` |

## README Template

`.harness/README.md` must follow the template bundled at `templates/harness-readme.md` in this skill. Fill in all `<!-- -->` placeholders based on actual project state:

- **Project**: name, tech stack, one-line description.
- **Injection Routing**: always present, reference `index/routing.md`.
- **Injection Priority**: always present, reference `index/priority.md`.
- **Language**: set to the language used across all `.harness/` files.

Do not restructure the template or add arbitrary sections — the README is a structured index consumed by the comet injection system.

## Exploration Strategy

Before writing files, inspect the repository in at least three passes:

1. Project metadata and top-level docs: `package.json`, `pom.xml`, `README`, `AGENTS.md`, workspace config.
2. Module boundaries and entry points: application bootstraps, services, APIs, entities, consumers, producers, config, tests.
3. Runtime and history signals: external integrations, state machines, queues, locks, transactions, recent commits, regressions.

Prefer CodeGraph when it is available. Use local search only when you need literal text or filesystem details.

## Language

Before generating any content, determine the output language:

1. Read the project's `CLAUDE.md` (or `.claude/CLAUDE.md`) if it exists. If it declares a language preference (e.g. `language: zh-CN`, "使用中文", "write in English"), follow that.
2. If no language preference is found, match the language of the current conversation.
3. All generated files in `.harness/` must use the same language consistently.
