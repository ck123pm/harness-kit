# .harness/ Directory Structure and Content Routing

The `.harness/` directory uses a category-based layout. Reference files below are **starting points** — create only files with real content, add new files when needed, skip empty placeholders.

```text
.harness/
├── README.md           # always create: use templates/harness-readme.md
├── index/
│   ├── routing.md      # always create: Task / phase / module / tech-domain context routing
│   ├── priority.md     # always create: Injection priority, intensity, conflict resolution
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
│   ├── index.md        # always create: lightweight index of all memory files (prevents context bloat)
│   ├── pitfalls.md
│   ├── regressions.md
│   ├── patterns.md
│   └── lessons.md
└── wiki/                # always create as HTML via templates/wiki/
    ├── index.html       # always create: root entry point (GitLab Pages home)
    ├── architecture/
    ├── business/
    ├── onboarding/
    ├── decisions/
    └── pitfalls/
```

| Information type | Reference file |
| --- | --- |
| Project identity, tech stack, module structure | `index/project-profile.md` |
| Task / phase / module / tech-domain context routing | `index/routing.md` |
| Injection priority, intensity, conflict resolution | `index/priority.md` |
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
