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

Create the `.harness/` directory with the category layout below. The listed files are **examples** — after exploring the codebase, create only the files that actually contain high-signal knowledge for that category. Do not create empty or placeholder files.

```text
.harness/
├── README.md
├── index/
│   ├── routing.md
│   ├── priority.md
│   └── ...          # additional index files (e.g. module-map.md, project-profile.md)
├── rules/
│   └── ...          # architecture, coding, testing, security, or other convention files
├── domain/
│   └── ...          # glossary, business-rules, runtime-semantics, or other domain files
├── decisions/
│   ├── adr/
│   └── ...          # tradeoffs, ADRs, and other design records
├── guides/
│   └── ...          # backend flows, ops runbooks, integration notes
├── memory/
│   └── ...          # pitfalls, regressions, patterns, lessons
└── human-docs/
    └── ...          # onboarding, architecture intro, operation manuals (HTML)
```

### README.md content

`.harness/README.md` must explain how to use this directory:

- **Injection routing**: Look up which `.harness/` file to read for a given task in `index/routing.md`.
- **Injection priority**: Look up the priority and intensity of context injection in `index/priority.md`.
- List the categories present and briefly what each covers.

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

## Language

Before generating any content, determine the output language:

1. Read the project's `CLAUDE.md` (or `.claude/CLAUDE.md`) if it exists. If it declares a language preference (e.g. `language: zh-CN`, "使用中文", "write in English"), follow that.
2. If no language preference is found, match the language of the current conversation.
3. All generated files in `.harness/` must use the same language consistently.

## Execution

1. Explore the repository thoroughly and base all outputs on the current branch state.
2. Create the `.harness/` directory and populate files according to the category structure above. Only create a file when the codebase has high-signal content for that category; skip empty or placeholder files.
3. Ensure `index/routing.md` and `index/priority.md` are always created, and that `README.md` references them as the lookup targets for injection routing and priority.
4. Keep generated content concise and high-signal.
5. If `human-docs/` content is needed, write Markdown first, then use `md-to-html-doc` to produce HTML.
6. Verify the final `.harness/` tree is coherent — all referenced files exist and no file is empty.
