# .harness/ Directory Structure and Content Routing

The `.harness/` directory uses a category-based layout. Reference files below are **starting points** — create only files with real content, add new files when needed, skip empty placeholders.

```text
.harness/
├── README.md           # always create: use templates/harness-readme.md
├── index/               # AI context entry points: routing, priority, module map, project profile
│   ├── routing.md      # always create: Task / phase / module / tech-domain context routing
│   ├── priority.md     # always create: Injection priority, intensity, conflict resolution
│   ├── module-map.md
│   └── project-profile.md
├── rules/               # Hard constraints; violations create risk
│   ├── architecture-rules.md
│   ├── coding-rules.md
│   ├── testing-rules.md
│   └── security-rules.md
├── domain/              # Domain knowledge: business semantics, state transitions, magic values, runtime rules
│   ├── glossary.md
│   ├── business-semantics.md
│   └── runtime-semantics.md
├── decisions/           # Design rationale and why changes should not be made casually
│   ├── adr/
│   └── tradeoffs.md
├── guides/              # AI execution manuals: correct practice, not encyclopedic docs
│   ├── architecture-guide.md
│   ├── coding-guide.md
│   ├── testing-guide.md
│   ├── security-guide.md
│   ├── backend.md
│   └── ops.md
├── memory/              # Historical pitfalls, regressions, reusable patterns, lessons learned
│   ├── index.md        # always create: lightweight index of all memory files (prevents context bloat)
│   ├── pitfalls.md
│   ├── regressions.md
│   ├── patterns.md
│   └── lessons.md
└── wiki/                # Human-facing docs, not injected into AI context by default; always create as HTML via templates/wiki/
    ├── index.html       # always create: root entry point (GitLab Pages home)
    ├── architecture/
    ├── business/
    ├── onboarding/
    ├── decisions/
    └── pitfalls/
```

Routing rule of thumb:

- Put **must / must not / invariant / forbidden** constraints in `rules/*-rules.md`.
- Put **how to implement / how to test / commands / workflow / examples of the correct path** in `guides/*-guide.md`.
- Put **business meaning, state semantics, magic values, runtime rules** in `domain/`.
- Put **why this design exists and why it should not be changed casually** in `decisions/`.
- Put **historical pitfalls, regressions, reusable patterns, and lessons** in `memory/`.
- Put **human-facing docs** in `wiki/`; `wiki/` is not injected into AI context by default.

| Information type | Reference file |
| --- | --- |
| AI context entry points: routing, priority, module map, project profile | `index/` |
| Hard constraints; violations create risk | `rules/` |
| Domain knowledge: business semantics, state transitions, magic values, runtime rules | `domain/` |
| Design rationale and why changes should not be made casually | `decisions/` |
| AI execution manuals: correct practice, not encyclopedic docs | `guides/` |
| Historical pitfalls, regressions, reusable patterns, lessons learned | `memory/` |
| Human-facing docs, not injected into AI context by default | `wiki/` |
| Project identity, tech stack, module structure | `index/project-profile.md` |
| Task / phase / module / tech-domain context routing | `index/routing.md` |
| Injection priority, intensity, conflict resolution | `index/priority.md` |
| Module-to-spec mapping | `index/module-map.md` |
| Architecture constraints, boundaries, ownership, forbidden dependencies | `rules/architecture-rules.md` |
| Architecture implementation workflow, module addition guide | `guides/architecture-guide.md` |
| Mandatory coding standards, conventions, prohibited patterns | `rules/coding-rules.md` |
| Coding workflow, idioms, examples of the correct implementation path | `guides/coding-guide.md` |
| Required test coverage, test gates, non-negotiable quality bars | `rules/testing-rules.md` |
| Test commands, fixtures, local verification workflow | `guides/testing-guide.md` |
| Security constraints, secrets handling, forbidden exposure patterns | `rules/security-rules.md` |
| Security review workflow, safe integration steps | `guides/security-guide.md` |
| Domain terminology | `domain/glossary.md` |
| Business semantics, domain invariants, product meaning | `domain/business-semantics.md` |
| Runtime semantics, state transitions, magic values, runtime rules | `domain/runtime-semantics.md` |
| External integrations, message flow | `guides/backend.md` |
| Build, config, monitoring, troubleshooting | `guides/ops.md` |
| ADRs, design tradeoffs | `decisions/` |
| Pitfalls, regressions, patterns, lessons | `memory/` |
