---
name: harness-update-spec
description: Analyze and incrementally update an existing project's .harness/ specs against the current codebase. Use when the codebase has changed and .harness/ content may be stale, or when the user wants to check spec freshness. Also invoked by harness-init when user chooses incremental update mode.
---

# Harness Update Spec

Use this skill when:
- The user wants to inspect whether an existing `.harness/` directory is stale and update it incrementally
- The `harness-init` skill detects an existing `.harness/` and the user chooses incremental update mode

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

Route by content type before choosing the filename:

- Hard constraints, invariants, forbidden patterns, and non-negotiable gates go to `rules/*-rules.md`.
- How-to guidance, commands, examples, workflows, and troubleshooting go to `guides/*-guide.md` or the existing topic guide.
- Domain meaning, business semantics, state transitions, magic values, and runtime rules go to `domain/`.
- Design rationale and tradeoffs go to `decisions/`.
- Historical pitfalls, regressions, reusable patterns, and lessons go to `memory/`.
- Human-facing docs go to `wiki/`; do not depend on `wiki/` for AI context injection.

| Change type | Likely spec target |
| --- | --- |
| Dependency or runtime identity changes | `index/project-profile.md` |
| Module structure changes | `index/module-map.md` |
| New services, consumers, producers, RPC or message flows | `guides/backend.md` |
| New runtime semantics or state machines | `domain/runtime-semantics.md` |
| Architecture boundary constraints or forbidden dependencies | `rules/architecture-rules.md` |
| Architecture implementation workflow or module addition steps | `guides/architecture-guide.md` |
| Mandatory coding conventions or prohibited patterns | `rules/coding-rules.md` |
| Coding workflow, local idioms, examples | `guides/coding-guide.md` |
| Required test gates or coverage rules | `rules/testing-rules.md` |
| Test commands, fixture setup, verification workflow | `guides/testing-guide.md` |
| Security constraints or secret-handling rules | `rules/security-rules.md` |
| Security review workflow or safe integration steps | `guides/security-guide.md` |
| New design tradeoffs or ADR-worthy decisions | `decisions/tradeoffs.md` or `decisions/adr/` |
| New domain terms or business semantics | `domain/glossary.md`, `domain/business-semantics.md` |
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
4. If `README.md` deviates from the harness-init bundled template, regenerate it to match.
5. Re-run a quick file list check to ensure the directory remains coherent.
6. When creating any file under `memory/` for the first time: if `memory/index.md` does not exist, create it first as a lightweight index of all memory files. If `memory/` already exists but `index.md` is missing, treat it as a missing file and create it.

## Language

Before generating or updating any content, determine the output language using the same rules as `harness-init`:

1. Read the project's `CLAUDE.md` (or `.claude/CLAUDE.md`) if it exists. If it declares a language preference, follow that.
2. If no preference is found, match the language of the current conversation.
3. All generated files in `.harness/` must use the same language consistently and match the language of existing `.harness/` files.

## Wiki

When adding or updating wiki content, write Markdown in `templates/wiki/`, convert to HTML with `md-to-html-doc`, place HTML in `.harness/wiki/`.
