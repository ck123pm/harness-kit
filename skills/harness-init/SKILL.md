---
name: harness-init
description: Initialize a project's .harness/ directory by exploring the real codebase and generating structured project knowledge docs. Use when starting harness for a new project or rebuilding stale .harness/ content.
---

# Harness Init

## Core Principles

1. Do not record what the AI can cheaply derive from source code.
2. Split expensive-to-derive knowledge by type and place it in the right file.
3. Put design decisions, historical reasons, and tradeoffs into `decisions/`.
4. Put human-oriented docs in `wiki/` — write Markdown in `templates/wiki/`, convert to HTML with `md-to-html-doc`, place HTML in `.harness/wiki/`, remove Markdown source if workflow requires HTML only. `templates/wiki/README.md` is AI guidance, not a document to generate — never copy or convert it.
5. Never fabricate content that is not supported by the actual repository state.

## Directory Structure

Follow the directory layout and content routing rules in `templates/directory-structure.md`.

When generating content, route by content type, not by topic name alone:

- Put hard constraints in `rules/*-rules.md`: must / must not, invariants, forbidden dependencies, security constraints, non-negotiable testing gates, and rules whose violation creates risk.
- Put execution guidance in `guides/*-guide.md`: how to implement correctly, commands to run, examples, workflows, local verification, migration steps, and troubleshooting paths.
- For the same topic, split content when both kinds exist. For example, coding constraints go to `rules/coding-rules.md`; implementation style, local idioms, and examples go to `guides/coding-guide.md`.
- Put business meaning, domain invariants, state transitions, magic values, and runtime semantics in `domain/`, not in `rules/` unless they are also engineering constraints the AI must enforce while editing code.
- Put design rationale, rejected alternatives, and "why this cannot be changed casually" in `decisions/`.
- Put historical pitfalls, regressions, reusable patterns, and lessons learned in `memory/`.
- Put human-facing explanatory docs in `wiki/`; do not rely on `wiki/` for AI context because it is not injected by default.

## README Template

`.harness/README.md` must follow the template bundled at `templates/harness-readme.md` in this skill. Fill in all `<!-- -->` placeholders based on actual project state:

- **Project**: name, tech stack, one-line description.
- **Injection Routing**: always present, reference `index/routing.md`.
- **Injection Priority**: always present, reference `index/priority.md`.
- **Language**: set to the language used across all `.harness/` files.

Do not restructure the template or add arbitrary sections — the README is a structured index consumed by the comet injection system.

## Existing .harness/ Detection

Before starting exploration, check if `.harness/` already exists:

**If `.harness/` does not exist**: Proceed with full exploration and generation (see Exploration Strategy below).

**If `.harness/` exists**: List the existing files and ask the user to choose an update mode:

1. **Full overwrite** (`overwrite`): Delete the existing `.harness/` directory and regenerate all files from scratch. Use this when the project structure has fundamentally changed or the existing specs are severely outdated.

2. **Incremental update** (`incremental`): Scan the current codebase and compare with existing `.harness/` content. Update only files that have changed, add new files for newly discovered aspects, and preserve user-customized content. This follows the same analysis flow as the `harness-update-spec` skill.

3. **Skip** (`skip`): Terminate without making any changes. Use this when you accidentally invoked the skill or want to keep the existing specs as-is.

For incremental updates, follow these steps:
- Read existing `.harness/` files and index their content
- Re-scan the project (see Exploration Strategy)
- Identify what changed: new modules, updated dependencies, architecture shifts, new patterns
- Generate a change report showing which files will be updated and why
- Ask the user to confirm before applying changes
- Apply updates: modify changed sections, append to history-oriented files (memory/, decisions/), create new files as needed
- Preserve user customizations unless they directly conflict with new findings

## Exploration Strategy
Inspect the repository in three passes:

1. Project metadata: `package.json`, `pom.xml`, `README`, `AGENTS.md`, workspace config.
2. Module boundaries: bootstraps, services, APIs, entities, consumers, producers, config, tests.
3. Runtime signals: external integrations, state machines, queues, locks, transactions, recent commits.

Prefer CodeGraph. Use local search only for literal text or filesystem details.

## Language
Determine output language before generating content:

1. Check `CLAUDE.md` for a language preference — follow if present.
2. Otherwise match the conversation language.
3. All `.harness/` files use the same language consistently.
