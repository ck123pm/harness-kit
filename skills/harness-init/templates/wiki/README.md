# wiki/ Directory Structure Reference

All wiki files are HTML generated from Markdown by `md-to-html-doc`. Create Markdown first in the template dir below, then convert.

## wiki/index.html Conventions

`index.html` is the **required root entry point** (GitLab Pages home). Always create it; never skip it.

**No separate `overview/` directory.** System overview content is inlined directly into `index.html`, not placed in a sub-directory.

### Page structure

```
Hero (project name + one-liner)
  └─ Doc-nav cards  (1 card per sub-doc, links to that sub-doc's top)
  └─ <hr>
  └─ System overview body  (inline: components, flows, key decisions)
```

### Sidebar nav

- **Current-page section group** — anchors for every `<h2>` on this page, with active-highlight support
- **Sub-docs group** — one top-level link per sub-doc (e.g. `architecture/`, `business/`), marked with `↗`; do NOT expand section-level anchors for sub-docs

## Template Directory Structure

```text
templates/wiki/
├── architecture/
│   ├── request-flow.md
│   ├── async-flow.md
│   └── module-relations.md
├── business/
│   ├── order-flow.md
│   └── payment-flow.md
├── onboarding/
│   ├── local-dev.md
│   └── debug-guide.md
├── decisions/
│   └── architecture-decisions.md
└── pitfalls/
    └── common-issues.md
```

## Instructions

- AI explores the codebase and populates only the templates that match real project content
- Skip templates with nothing to say — do not create empty files
- Feel free to add new template files when the project needs them
- After writing Markdown, run `md-to-html-doc` to produce HTML in `.harness/wiki/`
- Remove the Markdown source if the workflow requires generated HTML only
- Sub-docs stay as independent files under their sub-directory — do NOT inline them into `index.html`

### Content Guidance

| Template | When to create |
| --- | --- |
| `architecture/request-flow.md` | Project handles HTTP/gRPC requests through a middleware chain |
| `architecture/async-flow.md` | Project uses message queues, background jobs, or async processing |
| `architecture/module-relations.md` | Project has non-trivial inter-module dependencies |
| `business/order-flow.md` | Project has order lifecycle logic |
| `business/payment-flow.md` | Project has payment/integration logic |
| `onboarding/local-dev.md` | Project has non-trivial local setup |
| `onboarding/debug-guide.md` | Project has specific debugging patterns |
| `decisions/architecture-decisions.md` | Project has notable architecture decisions to record |
| `pitfalls/common-issues.md` | Project has known traps or frequent issues |
