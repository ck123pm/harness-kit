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

## Directory Structure

Follow the directory layout and content routing rules in `templates/directory-structure.md`.

## README Template

`.harness/README.md` must follow the template bundled at `templates/harness-readme.md` in this skill. Fill in all `<!-- -->` placeholders based on actual project state:

- **Project**: name, tech stack, one-line description.
- **Injection Routing**: always present, reference `index/routing.md`.
- **Injection Priority**: always present, reference `index/priority.md`.
- **Language**: set to the language used across all `.harness/` files.

Do not restructure the template or add arbitrary sections — the README is a structured index consumed by the comet injection system.

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
