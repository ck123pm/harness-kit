# Harness Kit Plan

## Current Direction

This package now ships the harness capabilities as Claude skills instead of Claude commands.

Installed artifacts:

- `skills/harness-init/SKILL.md`
- `skills/harness-update-spec/SKILL.md`
- `skills/md-to-html-doc/SKILL.md`

## Intended Workflow

1. Run `harness-kit install`.
2. Open Claude and ask it to use `harness-init` to create `.harness/`.
3. Later, ask Claude to use `harness-update-spec` to refresh stale specs incrementally.

## CLI Responsibilities

- Install packaged skills into Claude config.
- Check optional external tools such as `comet` and `openspec`.
- Diagnose environment state.
- Update or uninstall installed skill artifacts.

## Notes

- `harness-init`, `harness-update-spec`, and `md-to-html-doc` are directory-based skills.
- The install/update record logic must support hashing whole directories, not only single files.
