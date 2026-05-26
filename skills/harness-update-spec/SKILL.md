---
name: harness-update-spec
description: Analyze and incrementally update an existing project's .harness/ specs against the current codebase. Use when the codebase has changed and .harness/ content may be stale, or when the user wants to check spec freshness.
---

# Harness Update Spec

Use this skill when the user wants to inspect whether an existing `.harness/` directory is stale and update it incrementally.

## Core Principles

1. Use the current `.harness/` content as the baseline and compare it with the real codebase state.
2. Focus on incremental changes: what changed, what is missing, and what should be amended.
3. Prefer interactive confirmation when the user wants review-first behavior; otherwise execute the requested updates directly.
4. Do not add facts that can be cheaply re-derived from source code.
5. Preserve historical records in `decisions/` and `memory/` by appending when appropriate instead of overwriting blindly.

## Analysis Flow

### 1. Scan existing `.harness/`

Read the current `.harness/` files and build a quick index of:

- Which spec files already exist.
- What each file currently covers.
- Which expected files are missing.

If `.harness/` does not exist, stop and tell the user to initialize it with the `harness-init` skill first.

### 2. Re-scan the project

Inspect the live repository in at least three passes:

1. Tech stack changes: dependency additions, removals, or upgrades.
2. Module boundary changes: new or removed modules, services, entry points, entities.
3. Runtime flow changes: new consumers, producers, RPC edges, topics, configs, transactions, locks, external integrations.
4. High-risk chain changes: new distributed behavior, critical state transitions, external dependencies.
5. Recent git history: commits that imply architectural or behavior changes.

Prefer CodeGraph when it is available.

### 3. Derive a diff matrix

Map detected changes to spec targets. These are reference mappings — create new files when the change doesn't fit an existing one.

| Change type | Likely spec target |
| --- | --- |
| Dependency or runtime identity changes | `index/project-profile.md` |
| Module structure changes | `index/module-map.md` |
| New services, consumers, producers, RPC or message flows | `guides/backend.md` |
| New runtime semantics or state machines | `domain/runtime-semantics.md` |
| Architecture boundary changes | `rules/architecture.md` |
| New design tradeoffs or ADR-worthy decisions | `decisions/tradeoffs.md` or `decisions/adr/` |
| New domain terms or business rules | `domain/glossary.md`, `domain/business-rules.md` |
| New pitfalls, regressions, or reusable patterns | `memory/` |

### 4. Report proposed updates

When the user asks for analysis first, present a compact report that includes:

- Newly detected changes.
- Missing spec files.
- Which `.harness/` files should be updated and why.

If the user asks you to proceed, apply only the selected or clearly necessary updates.

### 5. Apply updates

When updating:

1. Do not rewrite correct existing content without reason.
2. Append to history-oriented files when that better preserves context.
3. Keep internal references inside `.harness/` consistent after edits.
4. Re-run a quick file list check to ensure the directory remains coherent.

## Language

Before generating or updating any content, determine the output language using the same rules as `harness-init`:

1. Read the project's `CLAUDE.md` (or `.claude/CLAUDE.md`) if it exists. If it declares a language preference, follow that.
2. If no preference is found, match the language of the current conversation.
3. All generated files in `.harness/` must use the same language consistently and match the language of existing `.harness/` files.

## Human Docs

If you add or refresh `human-docs/` content, write Markdown first and then use `md-to-html-doc` to produce the HTML artifacts expected by the harness.
